import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Zap,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Cpu,
  Sparkles,
  ArrowRight,
  GitBranch,
  Activity,
  Layers,
  ArrowDown,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onExploreMarketplace: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  onClose,
  onExploreMarketplace,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'simulator' | 'formula'>('graph');
  const [simAccuracy, setSimAccuracy] = useState<number>(99.1);
  const [simSlaThreshold, setSimSlaThreshold] = useState<number>(98.0);
  const [simBondCollateral, setSimBondCollateral] = useState<number>(100);

  const isHonored = simAccuracy >= simSlaThreshold;
  const slashAmount = !isHonored ? +(simBondCollateral * 0.15).toFixed(2) : 0;
  const buyerRefund = !isHonored ? +(0.05 + slashAmount * 0.5).toFixed(3) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl glass-card-neon border-2 border-purple-500/50 p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden shadow-[0_0_80px_rgba(147,51,234,0.5)] my-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          id="close-how-it-works-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/40 text-zinc-300 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-purple-500/30 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>SOLANA DEVNET ANCHOR PROTOCOL</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
            How Shadow Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-200 font-semibold mt-1">
            Eliminating subjective star ratings with programmatic on-chain performance bonds and instant slashing.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
                activeTab === 'graph'
                  ? 'bg-purple-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-purple-300/60'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Protocol Architecture Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'bg-purple-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-purple-300/60'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Live SLA Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('formula')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-2 ${
                activeTab === 'formula'
                  ? 'bg-purple-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-purple-300/60'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Mathematical Trust Model</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Protocol Architecture Graph */}
        {activeTab === 'graph' && (
          <div className="my-5 overflow-y-auto max-h-[58vh] pr-1 space-y-6">
            {/* Visual Flow Diagram */}
            <div className="p-6 rounded-2xl bg-black/80 border border-purple-500/30 relative">
              <div className="text-xs font-mono font-bold text-purple-300 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  END-TO-END EXECUTION PIPELINE
                </span>
                <span className="text-zinc-400">Anchor PDA Escrow State Machine</span>
              </div>

              {/* Connected Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Node 1: Creator Stake */}
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col justify-between relative group hover:border-purple-400 transition shadow-[0_0_20px_rgba(147,51,234,0.15)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-900 border border-purple-400 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                      1
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 uppercase">Creator PDA</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-white mb-1">
                    Stake Performance Bond
                  </div>
                  <p className="text-[11px] text-zinc-300 font-semibold">
                    Creator locks 50-200 SOL in an Anchor Escrow PDA, defining an immutable SLA accuracy contract.
                  </p>
                  <div className="mt-3 pt-2 border-t border-purple-500/20 text-[10px] font-mono text-purple-400">
                    Instruction: <code className="text-white">init_model_bond</code>
                  </div>
                </div>

                {/* Node 2: Buyer Query */}
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col justify-between relative group hover:border-indigo-400 transition shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-900 border border-indigo-400 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                      2
                    </span>
                    <span className="text-[10px] font-mono text-indigo-300 uppercase">Buyer Escrow</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-white mb-1">
                    Query & Escrow Deposit
                  </div>
                  <p className="text-[11px] text-zinc-300 font-semibold">
                    Buyer sends query with micro-payment locked in escrow pending verifiable inference benchmark proof.
                  </p>
                  <div className="mt-3 pt-2 border-t border-indigo-500/20 text-[10px] font-mono text-indigo-400">
                    Instruction: <code className="text-white">deposit_escrow</code>
                  </div>
                </div>

                {/* Node 3: Consensus Oracle */}
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between relative group hover:border-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-900 border border-cyan-400 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                      3
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase">Consensus Proof</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-white mb-1">
                    Streaming AI Oracle
                  </div>
                  <p className="text-[11px] text-zinc-300 font-semibold">
                    Consensus oracles evaluate response latency, exact token output, and correctness against ground truth.
                  </p>
                  <div className="mt-3 pt-2 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                    Validation: <code className="text-white">proof_of_accuracy</code>
                  </div>
                </div>

                {/* Node 4: Settlement Router */}
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between relative group hover:border-emerald-400 transition shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-400 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                      4
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 uppercase">Settlement</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-white mb-1">
                    Anchor Settlement Engine
                  </div>
                  <p className="text-[11px] text-zinc-300 font-semibold">
                    Smart contract evaluates proof: honors creator or slashes collateral with automatic buyer refund.
                  </p>
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                    Instruction: <code className="text-white">settle_mandate</code>
                  </div>
                </div>
              </div>

              {/* Split Outcome Branching */}
              <div className="mt-6 pt-5 border-t border-purple-500/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A: Honored */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-400/40 text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">OUTCOME A &bull; SLA HONORED</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 border border-emerald-400 text-emerald-300">
                        Accuracy &ge; SLA
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 font-semibold mt-1">
                      Query fee is released directly to creator wallet. Bond remains intact. Trust score increases and extends verified streak.
                    </p>
                  </div>
                </div>

                {/* Path B: Slashed */}
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-900/60 border border-rose-400/40 text-rose-300 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">OUTCOME B &bull; BOND SLASHED</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-950 border border-rose-400 text-rose-300">
                        Accuracy &lt; SLA
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 font-semibold mt-1">
                      Anchor smart contract automatically burns 15% of creator bond, refunds 100% of user query fee, and docks model Trust Score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live SLA Simulator */}
        {activeTab === 'simulator' && (
          <div className="my-5 overflow-y-auto max-h-[58vh] pr-1 space-y-6">
            <div className="p-6 rounded-2xl bg-black/80 border border-purple-500/30 space-y-6">
              <div className="text-xs font-mono font-bold text-purple-300 flex items-center justify-between">
                <span>INTERACTIVE SETTLEMENT SIMULATOR</span>
                <span className="text-zinc-400">Adjust parameters to see live Anchor execution</span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-2 font-bold">
                    OBSERVED ACCURACY: <span className="text-white text-sm">{simAccuracy}%</span>
                  </label>
                  <input
                    type="range"
                    min="85.0"
                    max="100.0"
                    step="0.1"
                    value={simAccuracy}
                    onChange={(e) => setSimAccuracy(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>85.0%</span>
                    <span>100.0%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-2 font-bold">
                    PLEDGED SLA THRESHOLD: <span className="text-purple-300 text-sm">{simSlaThreshold}%</span>
                  </label>
                  <input
                    type="range"
                    min="90.0"
                    max="99.5"
                    step="0.5"
                    value={simSlaThreshold}
                    onChange={(e) => setSimSlaThreshold(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>90.0%</span>
                    <span>99.5%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-2 font-bold">
                    STAKED BOND: <span className="text-amber-300 text-sm">{simBondCollateral} SOL</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={simBondCollateral}
                    onChange={(e) => setSimBondCollateral(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>20 SOL</span>
                    <span>500 SOL</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Output */}
              <div
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isHonored
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                        isHonored ? 'bg-emerald-900/80 text-emerald-300' : 'bg-rose-900/80 text-rose-300'
                      }`}
                    >
                      {isHonored ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg font-bold text-white">
                          {isHonored ? 'SLA Satisfied (Transaction Honored)' : 'SLA Breach Detected (Bond Slashed)'}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isHonored ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isHonored ? 'TX_HONOR' : 'TX_SLASH'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-semibold mt-0.5">
                        {isHonored
                          ? `Model achieved ${simAccuracy}% (exceeding ${simSlaThreshold}% SLA). Creator receives query payout.`
                          : `Model fell to ${simAccuracy}% (below ${simSlaThreshold}% SLA). 15% bond slashed.`}
                      </p>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Creator Impact</span>
                      <div
                        className={`font-mono text-sm font-black ${
                          isHonored ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isHonored ? '+0.005 SOL' : `-${slashAmount} SOL`}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">Buyer Refund</span>
                      <div className="font-mono text-sm font-black text-purple-300">
                        {isHonored ? '0.000 SOL (Valid)' : `+${buyerRefund} SOL`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mathematical Trust Model */}
        {activeTab === 'formula' && (
          <div className="my-5 overflow-y-auto max-h-[58vh] pr-1 space-y-6">
            <div className="p-6 rounded-2xl bg-black/80 border border-purple-500/30 space-y-4">
              <div className="text-xs font-mono font-bold text-purple-300">
                PROVABLE REPUTATION & EXPONENTIAL DECAY FORMULATION
              </div>

              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center font-mono text-base sm:text-lg font-bold text-white shadow-inner">
                <code>Trust(t) = ( &alpha; &times; Acc_t + &beta; &times; Bond_Weight ) &times; e^(-&lambda; &Delta;t) - (2.5 &times; Slash_Count)</code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 font-semibold pt-2">
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-purple-500/20">
                  <span className="font-mono text-purple-400 font-bold block mb-1">Skin-in-the-Game Weight (&beta;)</span>
                  Higher bonded collateral acts as an economic shield, providing positive upward pressure on model trust rankings.
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-purple-500/20">
                  <span className="font-mono text-purple-400 font-bold block mb-1">Time Decay (&lambda; = 30d half-life)</span>
                  Inactive models lose trust over time, requiring continuous verified uptime and fresh inference proofs to remain on leaderboards.
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-purple-500/20">
                  <span className="font-mono text-rose-400 font-bold block mb-1">Severe Slashing Penalty (2.5&times;)</span>
                  Violations result in catastrophic trust degradation that cannot be gamed by artificial reviews or volume spam.
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-purple-500/20">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">Anchor Determinism</span>
                  100% computed on-chain with verifiable state roots stored inside Solana Program Derived Addresses (PDAs).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400 font-mono">
            Solana Program ID: <span className="text-purple-300 font-bold">ShdwBond111111111111111111111111111111111</span>
          </span>
          <button
            onClick={() => {
              onClose();
              onExploreMarketplace();
            }}
            className="neon-glow-btn px-6 py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            <span>Explore Bonded Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

