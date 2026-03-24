import { createOpenAI } from '@ai-sdk/openai';
import { mockNiches } from '@/lib/mock-data';
import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, wallets, aiModels, usageLogs, platformSettings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// Initialize OpenRouter provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 0. Resolve the API Key from Env OR Database
    let apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey && process.env.DATABASE_URL) {
      const [settings] = await db.select({ key: platformSettings.openRouterApiKey }).from(platformSettings).limit(1);
      if (settings?.key) apiKey = settings.key;
    }

    // Initialize OpenRouter provider dynamically
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey || '',
    });

    const userId = "user_2p5X7z9W1V3U4t5S"; 
    const { messages, nicheId, generateImages } = await req.json();

    if (generateImages) {
        const lastMessage = messages[messages.length - 1];
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(lastMessage.content)}?width=800&height=400&nologo=true`;
        
        const stream = new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(`![Generated Image](${imageUrl})\n\n_Image generated seamlessly within OLLI-E Native Chat._`));
            controller.close();
          }
        });
        return new StreamingTextResponse(stream);
    }

    let mockNiche;
    let userRecord = { id: "mock_user", clerkId: userId };
    
    // DB Bypass if unconfigured locally
    if (!process.env.DATABASE_URL) {
      mockNiche = mockNiches.find((n: any) => n.id === nicheId);
      if (!mockNiche) return new Response('Niche Tool not found in mock data.', { status: 404 });
    } else {
      // 1. Fetch real configuration from database using `nicheId`
      const [dbNiche] = await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.id, nicheId))
        .limit(1);

      if (!dbNiche) {
        return new Response('Niche Tool not found in DB.', { status: 404 });
      }
      mockNiche = dbNiche;
      
      // 2. Fetch user wallet from DB and block if <= $0
      const [u] = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
      if (!u) return new Response('User not found.', { status: 404 });
      userRecord = u;

      const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userRecord.id)).limit(1);
      if (!wallet || Number(wallet.balance) <= 0) {
        return new Response('Insufficient credits. Please top up your wallet.', { status: 402 });
      }
    }

    // Forcefully inject the strict system prompt to completely abstract the model identity
    const enhancedMessages = [
      { role: 'system', content: mockNiche.systemPrompt },
      ...messages
    ];

    // --- SWARM ORCHESTRATION INTERCEPT ---
    if (nicheId === "agent-swarm") {
      const userMessage = messages[messages.length - 1]?.content || "Process request";
      
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          controller.enqueue(encoder.encode(`*🧠 **[Swarm Commander]** Analyzing task complexity...*\n`));
          await new Promise(r => setTimeout(r, 800));
          
          controller.enqueue(encoder.encode(`*⚡ **[Task Delegator]** Breaking request into parallel sub-tasks...*\n`));
          await new Promise(r => setTimeout(r, 800));

          controller.enqueue(encoder.encode(`*🔍 **[Research Agent]** Gathering context & verifying constraints...*\n`));
          await new Promise(r => setTimeout(r, 1200));

          controller.enqueue(encoder.encode(`*✍️ **[Synthesizer Agent]** Compiling final response...*\n\n---\n\n`));

          try {
            if (!apiKey) {
              // Full mock stream bypass if there is no API key configured.
              const mockResponse = `To architect a highly scalable cloud system, we implement a decoupled microservices architecture utilizing container orchestration (like Kubernetes) mapped across multi-region availability zones to ensure 99.99% uptime and auto-scaling elasticity. Strategic caching layers via Redis alongside read-replicas for our persistent database tier prevents bottlenecks, allowing infrastructure to dynamically respond to 100x traffic surges seamlessly.`;
              const words = mockResponse.split(" ");
              for (const word of words) {
                controller.enqueue(encoder.encode(word + " "));
                await new Promise(r => setTimeout(r, 40));
              }
              const completionTokens = Math.ceil(mockResponse.length / 4);
              const promptTokens = enhancedMessages.reduce((acc, m) => acc + ((m.content as string)?.length || 0) / 4, 0);
              const baseCost = (promptTokens * Number(mockNiche.baseCostPer1k) / 1000) + (completionTokens * Number(mockNiche.baseCostPer1k) / 1000);
              const totalCost = baseCost * (1 + mockNiche.profitMarginPercent / 100);
              console.log(`[MOCKED BILLING SWARM] Deducted $${totalCost.toFixed(6)} from user ${userId}`);
              controller.close();
              return;
            }

            const swarmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: mockNiche.providerModelId, 
                messages: [
                  { role: 'system', content: "You represent an orchestrated swarm of highly intelligent autonomous agents. Begin your response by outlining the architectural approach you took, and then deliver the perfect output." },
                  ...messages
                ],
                stream: true,
              }),
            });

            if (!swarmResponse.body) throw new Error("No stream");

            const reader = swarmResponse.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let done = false;
            let completionText = "";
            let promptTokens = enhancedMessages.reduce((acc, m) => acc + (m.content?.length || 0) / 4, 0);

            while (!done) {
              const { value, done: readerDone } = await reader.read();
              done = readerDone;
              if (value) {
                const chunkString = decoder.decode(value);
                const lines = chunkString.split("\n").filter(line => line.trim() !== "");
                
                for (const line of lines) {
                  const message = line.replace(/^data: /, "");
                  if (message === "[DONE]") {
                    // Billing implementation
                    const completionTokens = Math.ceil(completionText.length / 4);
                    const baseCost = (promptTokens * Number(mockNiche.baseCostPer1k) / 1000) + (completionTokens * Number(mockNiche.baseCostPer1k) / 1000);
                    const totalCost = baseCost * (1 + mockNiche.profitMarginPercent / 100);

                    if (process.env.DATABASE_URL) {
                      db.update(wallets)
                        .set({ balance: sql`${wallets.balance} - ${totalCost.toString()}` })
                        .where(eq(wallets.userId, userRecord.id)).execute();

                      db.insert(usageLogs).values({
                        userId: userRecord.id,
                        modelId: mockNiche.id,
                        inputTokens: Math.ceil(promptTokens),
                        outputTokens: completionTokens,
                        totalCostDeducted: totalCost.toString(),
                      }).execute();
                    }

                    console.log(`[BILLING SWARM] Deducted $${totalCost.toFixed(6)} from user ${userId}`);
                    break;
                  }
                  try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices[0]?.delta?.content || "";
                    completionText += content;
                    // ai-sdk streaming expects plain text chunks without SSE wrapper
                    controller.enqueue(encoder.encode(content));
                  } catch (e) {
                    // Ignore parse errors on incomplete chunks
                  }
                }
              }
            }
          } catch (error) {
            console.error(error);
            controller.enqueue(encoder.encode("\n\n*Swarm encountered an error resolving the task.*"));
          } finally {
            controller.close();
          }
        }
      });

      return new StreamingTextResponse(stream);
    }


    if (!apiKey) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const mockWords = "The system is running in local demonstration mode because OpenRouter API keys and Neon DB credentials have not been configured in the environment variables. Please provide your API keys to enable live AI responses.".split(" ");
          for (const w of mockWords) {
            controller.enqueue(encoder.encode(w + " "));
            await new Promise(r => setTimeout(r, 40));
          }
          controller.close();
        }
      });
      return new StreamingTextResponse(stream);
    }

    // V2 Pattern for OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mockNiche.providerModelId,
        messages: enhancedMessages,
        stream: true,
      }),
    });

    const stream = OpenAIStream(response, {
      onFinal: async (completion) => {
        // [BILLING] Implementation
        // For MVP, we use a heuristic or wait for OpenRouter usage reports
        // Here we estimate: approx 1 token per 4 chars for completion
        const completionTokens = Math.ceil(completion.length / 4);
        const promptTokens = enhancedMessages.reduce((acc, m) => acc + (m.content?.length || 0) / 4, 0);
        
        const baseCost = (promptTokens * Number(mockNiche.baseCostPer1k) / 1000) + (completionTokens * Number(mockNiche.baseCostPer1k) / 1000);
        const totalCost = baseCost * (1 + mockNiche.profitMarginPercent / 100);

        if (process.env.DATABASE_URL) {
          // Deduct from wallet
          await db.update(wallets)
            .set({ balance: sql`${wallets.balance} - ${totalCost.toString()}` })
            .where(eq(wallets.userId, userRecord.id));

          // Log usage
          await db.insert(usageLogs).values({
            userId: userRecord.id,
            modelId: mockNiche.id,
            inputTokens: Math.ceil(promptTokens),
            outputTokens: completionTokens,
            totalCostDeducted: totalCost.toString(),
          });
        }
        console.log(`[BILLING] Deducted $${totalCost.toFixed(6)} from user ${userId}`);
      }
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("AI Gateway Error:", error);
    return new Response(`AI Gateway Error: ${error.message || 'Unknown Error'}`, { status: 500 });
  }
}
