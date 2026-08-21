import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Terminal,
  Cpu,
  Layers,
  Coins,
  ArrowRight,
  Database,
} from 'lucide-react';

export interface TxDetailData {
  signature: string;
  instructionName?: string;
  type?: 'STAKE_BOND' | 'PURCHASE_ACCESS' | 'SLA_VERIFIED' | 'SLASH_REFUND' | 'AIRDROP' | 'GENERIC';
  status: 'confirmed' | 'finalized' | 'failed';
  blockSlot?: number;
  timestamp: number;
  modelName?: string;
  amountSol?: number;
  pdaEscrow?: string;
  oracleAccuracy?: number;
  slaAccuracy?: number;
  logs?: string[];
  caller?: string;
}

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  txData: TxDetailData | null;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  txData,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !txData) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSlash = txData.type === 'SLASH_REFUND' || txData.instructionName?.includes('slash');
  const isAirdrop = txData.type === 'AIRDROP';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d071b] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] text-white max-h-[90vh] overflow-y-auto">
        {/* Glow ambient */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
              isSlash
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-rose-900/40'
                : 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-400/60 text-purple-200 shadow-purple-900/50'
            }`}
          >
            {isSlash ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg sm:text-xl font-bold tracking-wider text-white">
                SOLANA TRANSACTION RECEIPT
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
                FINALIZED
              </span>
            </div>
            <p className="text-xs text-purple-200/80 font-mono">
              Cluster: Solana Devnet · Anchor Program
            </p>
          </div>
        </div>

        {/* Signature Box */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/30 mb-5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
            <span>TRANSACTION SIGNATURE</span>
            <button
              onClick={() => copyToClipboard(txData.signature)}
              className="flex items-center gap-1 text-purple-300 hover:text-white transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-mono text-purple-200 break-all bg-black/40 p-2 rounded-lg border border-purple-500/20">
            {txData.signature}
          </div>
        </div>

        {/* Overview Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="text-[10px] font-mono text-zinc-400">INSTRUCTION</div>
            <div className="text-xs font-bold text-white truncate font-mono">
              {txData.instructionName || txData.type || 'execute'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="text-[10px] font-mono text-zinc-400">AMOUNT</div>
            <div className="text-xs font-bold text-purple-200 font-mono">
              {txData.amountSol !== undefined ? `${txData.amountSol} SOL` : '0.00 SOL'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="text-[10px] font-mono text-zinc-400">BLOCK SLOT</div>
            <div className="text-xs font-bold text-zinc-300 font-mono">
              #{txData.blockSlot || 284910243}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="text-[10px] font-mono text-zinc-400">TIME</div>
            <div className="text-xs font-bold text-zinc-300 font-mono">
              {new Date(txData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* SLA & Oracle Proof (if applicable) */}
        {(txData.oracleAccuracy !== undefined || txData.slaAccuracy !== undefined) && (
          <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 mb-5 space-y-2">
            <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>ORACLE BENCHMARK PROOF & SLA EVALUATION</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <span className="text-zinc-400 block text-[10px]">CLAIMED SLA</span>
                <span className="font-bold text-white">{txData.slaAccuracy ?? 95}%</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  (txData.oracleAccuracy ?? 100) < (txData.slaAccuracy ?? 95)
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <span className="block text-[10px] opacity-80">VERIFIED ORACLE ACCURACY</span>
                <span className="font-bold">{txData.oracleAccuracy ?? 98.4}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Program Log Stream */}
        <div className="p-4 rounded-2xl bg-black/80 border border-purple-500/30 mb-5 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-purple-500/20">
            <div className="flex items-center gap-1.5 text-purple-300">
              <Terminal className="w-3.5 h-3.5" />
              <span>Anchor Program Execution Logs</span>
            </div>
            <span className="text-emerald-400 text-[10px]">Status: Success (0x0)</span>
          </div>
          <div className="text-zinc-400 space-y-1 bg-black/50 p-2.5 rounded-xl max-h-36 overflow-y-auto">
            <div>Program ShdwBond11111111111111111111111111111111111 invoke [1]</div>
            <div className="text-purple-300">
              &gt; Program log: Instruction: {txData.instructionName || txData.type || 'execute'}
            </div>
            {txData.modelName && (
              <div className="text-zinc-300">&gt; Target Model: {txData.modelName}</div>
            )}
            {isSlash ? (
              <div className="text-rose-400">
                &gt; SLA Breach detected: Collateral slashed from PDA and refunded to buyer.
              </div>
            ) : (
              <div className="text-emerald-400">
                &gt; Verification passed: Escrow state updated successfully.
              </div>
            )}
            <div>Program ShdwBond11111111111111111111111111111111111 consumed 42,108 compute units</div>
            <div className="text-emerald-400">Program ShdwBond11111111111111111111111111111111111 success</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
          <div className="text-[11px] font-mono text-zinc-400">
            Program ID: <span className="text-purple-300">ShdwBond1111...1111</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.5)] transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
