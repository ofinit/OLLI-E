export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-zinc-200 space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase text-zinc-500 tracking-widest">Legal</p>
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="text-zinc-400 text-sm">Last updated: March 20, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
        <p className="text-zinc-400 leading-relaxed">
          By accessing or using OLLI-E AI ("Service"), you agree to be bound by these Terms of Service. This Service is a platform that provides access to specialized AI capabilities. If you do not agree to these terms, you may not use the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">2. Pre-paid Credit System</h2>
        <p className="text-zinc-400 leading-relaxed">
          Use of AI features requires pre-purchased credits in your OLLI-E Wallet. All credits are non-refundable once consumed. You are solely responsible for monitoring your wallet balance. The Service will automatically halt API requests when your balance reaches zero.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">3. Storage & Data Ownership</h2>
        <p className="text-zinc-400 leading-relaxed">
          OLLI-E AI does not store your generated files or documents on its servers. All file outputs are stored directly in your own Amazon S3 bucket, which you connect and fully own. OLLI-E AI is not responsible for the security, availability, or integrity of data stored in your S3 bucket. You are solely responsible for your AWS account security and access keys.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Prohibited Use</h2>
        <p className="text-zinc-400 leading-relaxed">
          You may not use the Service to generate content that is illegal, deceptive, harmful, or violates any third-party rights. Attempting to reverse engineer, probe, or extract information about the underlying AI models is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Pricing & API Cost Fluctuations</h2>
        <p className="text-zinc-400 leading-relaxed">
          The credit cost per AI interaction is dynamically calculated based on the actual cost from underlying API providers plus a service margin. This pricing may change without prior notice when our upstream API providers adjust their rates. Credits in your wallet are not affected by price changes after purchase.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">6. GST & Taxation (India)</h2>
        <p className="text-zinc-400 leading-relaxed">
          All wallet top-ups made by Indian residents may be subject to Goods and Services Tax (GST) as applicable under the laws of India. Business customers with a valid GSTIN may enter it during checkout to receive compliant tax invoices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Disclaimer of Warranties</h2>
        <p className="text-zinc-400 leading-relaxed">
          The Service is provided "as is" without warranties of any kind. AI-generated outputs may be inaccurate. Always verify important outputs before use. OLLI-E AI is not liable for decisions made based on AI outputs.
        </p>
      </section>
    </div>
  );
}
