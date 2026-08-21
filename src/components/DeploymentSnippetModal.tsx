import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Terminal,
  Key,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { AIModel } from '../types';

interface DeploymentSnippetModalProps {
  model: AIModel | null;
  txHash: string;
  onClose: () => void;
}

export const DeploymentSnippetModal: React.FC<DeploymentSnippetModalProps> = ({
  model,
  txHash,
  onClose,
}) => {
  if (!model) return null;

  const [activeLang, setActiveLang] = useState<'curl' | 'python' | 'js'>('curl');
  const [copied, setCopied] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(true);
  const [provisionProgress, setProvisionProgress] = useState(0);

  // Generate deterministic access key
  const buyerApiKey = `shdw_live_${txHash.slice(0, 8)}_${model.id.replace(/-/g, '_')}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setProvisionProgress((prev) => {
        if (prev >= 100) {
          setIsProvisioning(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const snippets = {
    curl: `curl -X POST https://api.shadow.market/v1/models/${model.id}/infer \\
  -H "Authorization: Bearer ${buyerApiKey}" \\
  -H "X-Solana-Escrow-Tx: ${txHash}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Execute benchmark inference with on-chain bond guarantee",
    "sla_enforcement": true,
    "max_latency_ms": ${model.latencyMs + 200}
  }'`,

    python: `import requests

url = "https://api.shadow.market/v1/models/${model.id}/infer"
headers = {
    "Authorization": "Bearer ${buyerApiKey}",
    "X-Solana-Escrow-Tx": "${txHash}",
    "Content-Type": "application/json"
}
payload = {
    "prompt": "Execute benchmark inference with on-chain bond guarantee",
    "sla_enforcement": True,
    "max_latency_ms": ${model.latencyMs + 200}
}

response = requests.post(url, json=payload, headers=headers)
print("Model Output:", response.json()["output"])
print("Performance Proof PDA:", response.json()["proof_pda"])`,

    js: `import { ShadowClient } from '@shadow-market/sdk';

const shadow = new ShadowClient({
  apiKey: '${buyerApiKey}',
  escrowTx: '${txHash}',
  cluster: 'devnet'
});

async function main() {
  const result = await shadow.models.infer({
    modelId: '${model.id}',
    prompt: 'Execute benchmark inference with on-chain bond guarantee',
    slaEnforcement: true
  });

  console.log('Result:', result.output);
  console.log('On-chain SLA verified:', result.isHonored);
}

main();`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl glass-card-neon border-2 border-purple-500/50 p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(147,51,234,0.4)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/40 text-zinc-300 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-purple-500/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ESCROW BOND PURCHASE CONFIRMED</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-shadow-hero">
            Access Granted: {model.name}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-semibold mt-1">
            Your payment is locked in Solana Escrow PDA. Copy the production snippet below to invoke the model.
          </p>
        </div>

        {/* Provisioning Status or Code Panel */}
        <div className="my-6">
          {isProvisioning ? (
            <div className="p-6 rounded-2xl bg-black/70 border border-purple-500/30 text-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin mx-auto" />
              <h3 className="font-mono text-sm font-bold text-purple-200">
                Provisioning access key across Solana Devnet RPC edge nodes...
              </h3>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${provisionProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{provisionProgress}% complete</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Credentials preview */}
              <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 truncate">
                  <Key className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-zinc-400">API Key:</span>
                  <span className="text-emerald-300 font-bold truncate">{buyerApiKey}</span>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase shrink-0">Devnet Authenticated</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                <div className="flex items-center gap-2">
                  {(['curl', 'python', 'js'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition ${
                        activeLang === lang
                          ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                          : 'text-zinc-400 hover:text-white bg-black/40'
                      }`}
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'python' ? 'Python 3' : 'Node / TypeScript'}
                    </button>
                  ))}
                </div>

                <button
                  id="copy-deployment-snippet-btn"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-400/40 text-white font-mono text-xs flex items-center gap-1.5 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Snippet Box */}
              <pre className="p-4 rounded-xl bg-zinc-950/95 border border-purple-500/30 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-64">
                {snippets[activeLang]}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono">
            SLA Protection: <span className="text-emerald-400 font-bold">Active</span> (100% refund on breach)
          </span>
          <button
            onClick={onClose}
            className="neon-glow-btn px-5 py-2 rounded-xl text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
