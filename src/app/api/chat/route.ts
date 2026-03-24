import { mockNiches } from '@/lib/mock-data';
import { db } from '@/db';
import { users, wallets, aiModels, usageLogs, platformSettings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

async function resolveApiKey(): Promise<string | null> {
  let apiKey = process.env.OPENROUTER_API_KEY || null;
  if (!apiKey && process.env.DATABASE_URL) {
    try {
      const [settings] = await db.select({ key: platformSettings.openRouterApiKey }).from(platformSettings).limit(1);
      if (settings?.key) apiKey = settings.key;
    } catch { }
  }
  return apiKey;
}

// Returns a ReadableStream in the ai/react v2 text format (plain text)
function makePlainTextStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char));
        await new Promise(r => setTimeout(r, 5));
      }
      controller.close();
    }
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = await resolveApiKey();
    const userId = "user_2p5X7z9W1V3U4t5S";
    const { messages, nicheId, generateImages } = await req.json();

    // --- IMAGE GENERATION MODE ---
    if (generateImages) {
      const lastMessage = messages[messages.length - 1];
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(lastMessage.content)}?width=800&height=400&nologo=true`;
      return new Response(
        makePlainTextStream(`![Generated Image](${imageUrl})\n\n_Image generated within OLLI-E Native Chat._`),
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    let agent: any;
    let userRecord: any = { id: "mock_user", clerkId: userId };

    // DB Bypass if unconfigured locally
    if (!process.env.DATABASE_URL) {
      agent = mockNiches.find((n: any) => n.id === nicheId);
      if (!agent) return new Response('Agent not found.', { status: 404 });
    } else {
      const [dbAgent] = await db.select().from(aiModels).where(eq(aiModels.id, nicheId)).limit(1);
      if (!dbAgent) return new Response('Agent not found in database.', { status: 404 });
      agent = dbAgent;

      const [u] = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
      if (!u) return new Response('User not found.', { status: 404 });
      userRecord = u;

      const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userRecord.id)).limit(1);
      if (!wallet || Number(wallet.balance) <= 0) {
        return new Response('Insufficient credits. Please top up your wallet.', { status: 402 });
      }
    }

    // No API key — return helpful guidance
    if (!apiKey) {
      return new Response(
        makePlainTextStream(`Hello! I'm **${agent.nicheName}**, your specialized OLLI-E assistant.\n\n⚠️ The OpenRouter API key hasn't been configured yet. Please ask your admin to add it under Settings → API Configuration. Once set, I'll be fully ready to guide you step by step!`),
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const systemPrompt = agent.systemPrompt || `You are ${agent.nicheName}, a specialized AI assistant. Always greet the user and ask step-by-step questions to understand their needs before providing help.`;

    // Call OpenRouter with streaming
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://olli-e.vercel.app',
        'X-Title': 'OLLI-E AI Platform',
      },
      body: JSON.stringify({
        model: agent.providerModelId,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorBody = await openrouterResponse.text();
      console.error('[OPENROUTER ERROR]', openrouterResponse.status, errorBody);
      return new Response(
        JSON.stringify({ error: `OpenRouter error ${openrouterResponse.status}: ${errorBody.slice(0, 200)}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!openrouterResponse.body) {
      return new Response(JSON.stringify({ error: 'No response stream from OpenRouter.' }), { status: 500 });
    }

    // Transform OpenRouter SSE → plain text stream that ai/react v2 useChat can read
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8');
    let completionText = '';
    let promptTokensEst = messages.reduce(
      (acc: number, m: any) => acc + ((m.content?.length || 0) / 4), systemPrompt.length / 4
    );

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = openrouterResponse.body!.getReader();
        let done = false;

        try {
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (!value) continue;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(l => l.trim());

            for (const line of lines) {
              const data = line.replace(/^data: /, '').trim();
              if (!data || data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const content: string = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  completionText += content;
                  controller.enqueue(encoder.encode(content));
                }
              } catch { }
            }
          }
        } finally {
          controller.close();

          // Billing
          if (process.env.DATABASE_URL) {
            try {
              const completionTokens = Math.ceil(completionText.length / 4);
              const baseCost = ((promptTokensEst + completionTokens) * Number(agent.baseCostPer1k)) / 1000;
              const totalCost = baseCost * (1 + agent.profitMarginPercent / 100);

              await db.update(wallets)
                .set({ balance: sql`${wallets.balance} - ${totalCost.toString()}` })
                .where(eq(wallets.userId, userRecord.id));

              await db.insert(usageLogs).values({
                userId: userRecord.id,
                modelId: agent.id,
                inputTokens: Math.ceil(promptTokensEst),
                outputTokens: completionTokens,
                totalCostDeducted: totalCost.toString(),
              });
            } catch (billingErr) {
              console.error('[BILLING ERROR]', billingErr);
            }
          }
        }
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
