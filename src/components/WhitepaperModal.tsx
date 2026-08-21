import React from 'react';
import {
  X,
  BookOpen,
  FileCode2,
  Lock,
  Cpu,
  Layers,
  Database,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WhitepaperModalProps {
  onClose: () => void;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl glass-card-neon border-2 border-purple-500/50 p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(147,51,234,0.4)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/40 text-zinc-300 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-purple-500/30 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/40 text-indigo-200 text-xs font-mono font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SHADOW PROTOCOL SPECIFICATION v1.0</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
            Technical Architecture & Game Theory
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-semibold mt-1">
            Proof of Collateral: An on-chain economic mechanism for decentralized machine intelligence validation.
          </p>
        </div>

        {/* Content Body */}
        <div className="my-6 space-y-6 max-h-[55vh] overflow-y-auto pr-2 font-sans text-xs text-zinc-300 leading-relaxed no-scrollbar">
          {/* Section 1 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              1. The Incentive Inversion Problem
            </h3>
            <p>
              Traditional AI registries rely on subjective star ratings, GitHub stars, and easily spoofable benchmark leaderboards. Because ratings carry no financial downside for dishonest actors, Sybil attacks and synthetic review generation are endemic.
            </p>
            <p>
              Shadow inverts this incentive model: <strong>Reputation is a function of capital at risk</strong>. An AI creator cannot list a model without staking programmatic collateral into a Solana Program Derived Address (PDA).
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. Trust Score Mathematical Formulation
            </h3>
            <p>
              Trust Score T at time t is computed over the sequence of settlement events S = [s_1, s_2, ... s_n]:
            </p>
            <div className="p-3 rounded-xl bg-zinc-950/90 font-mono text-purple-300 text-xs border border-purple-500/20 overflow-x-auto">
              w_i = e^(-lambda * delta_t_i) * sqrt(bond_i)<br />
              T = (sum(w_i * accuracy_i) / sum(w_i)) - (2.5 * total_slashed_ratio)
            </div>
            <p>
              Where \( \lambda \) represents the half-life decay rate (30 days), and the penalty coefficient 2.5 ensures that a single slashing violation heavily depresses the model's public rank until a long streak of honored performance is restored.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              3. Anchor State Accounts & PDA Derivation
            </h3>
            <p>
              The smart contract program relies on two primary deterministic seed seeds:
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-zinc-300">
              <li>Listing Account: <code>[b"shadow_listing", creator.key().as_ref(), listing_id.to_le_bytes().as_ref()]</code></li>
              <li>Escrow Vault: <code>[b"shadow_vault", listing.key().as_ref()]</code></li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-500/30 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono">
            Solana Devnet Cluster: <span className="text-emerald-400 font-bold">api.devnet.solana.com</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-white font-bold text-xs"
          >
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};
