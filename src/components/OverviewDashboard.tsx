import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Award,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle,
  FileCode2,
  Lock,
  ArrowUpRight,
  Sparkles,
  Bot,
  Play,
  Terminal,
} from 'lucide-react';
import { AIModel, SettlementEvent } from '../types';
import { getSolanaExplorerUrl } from '../services/solanaService';

interface OverviewDashboardProps {
  onExploreMarketplace: () => void;
  onOpenContract: () => void;
  onOpenCreatorHub: () => void;
  onOpenLeaderboard: () => void;
  onOpenTrustFeed: () => void;
  onOpenHowItWorks: () => void;
  onOpenListModel: () => void;
  onOpenRecommender?: () => void;
  onSelectModel: (id: string) => void;
  recentSettlements: SettlementEvent[];
  totalBondedSol: number;
  models: AIModel[];
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onExploreMarketplace,
  onOpenContract,
  onOpenCreatorHub,
  onOpenLeaderboard,
  onOpenTrustFeed,
  onOpenHowItWorks,
  onOpenListModel,
  onOpenRecommender,
  onSelectModel,
  recentSettlements,
  totalBondedSol,
  models,
}) => {
  const [liveVolume] = useState<number>(4820000);

  return (
    <div className="main-container py-6 sm:py-10 space-y-10">
      {/* Overview Top Header Banner */}
      <div className="w-full glass-card-neon rounded-3xl p-6 sm:p-8 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOLANA DEVNET ESCROW ACTIVE</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            Protocol Overview & Escrow State
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base font-semibold leading-relaxed">
            Monitor real-time bonded AI agent mandates, automated SLA slashing, and cryptographic settlements across the Shadow network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {onOpenRecommender && (
            <button
              onClick={onOpenRecommender}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-700 hover:from-amber-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(245,158,11,0.4)] transition cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>AI Recommender</span>
            </button>
          )}
          <button
            onClick={onExploreMarketplace}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] transition"
          >
            <Layers className="w-4 h-4" />
            <span>Browse Models</span>
          </button>
          <button
            onClick={onOpenContract}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/40 text-purple-200 hover:text-white text-xs sm:text-sm font-bold transition"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Anchor Contract</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/15 blur-3xl pointer-events-none" />
      </div>

      {/* Live Trust Feed Ticker Bar */}
      <section className="w-full bg-black/60 border border-purple-500/30 rounded-2xl p-3 backdrop-blur-xl">
        <div className="flex items-center gap-4 overflow-hidden">
          <div
            onClick={onOpenTrustFeed}
            className="flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold shrink-0 cursor-pointer hover:bg-purple-900 transition"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>LIVE SETTLEMENT STREAM</span>
          </div>

          <div className="flex items-center gap-4 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
            {recentSettlements.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectModel(item.modelId)}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/25 text-xs text-zinc-200 cursor-pointer transition shrink-0 group"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === 'HONOR'
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  }`}
                />
                <span className="font-bold text-white group-hover:text-purple-300 transition">
                  {item.modelName}
                </span>
                <span
                  className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    item.type === 'HONOR'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {item.type === 'HONOR'
                    ? `Honored: +${item.bondAmount} SOL`
                    : `Slashed: Refunded ${item.refundAmount} SOL`}
                </span>
                <span className="text-zinc-400 text-[11px] font-mono">
                  {item.actualAccuracy}% acc
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Metrics Dashboard Bar */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {/* Metric 1 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              PROTECTED VOLUME
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                ${(liveVolume / 1000000).toFixed(2)}M+
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>&uarr; 24% this week</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              On-chain bonded collateral ({totalBondedSol} SOL)
            </span>
          </div>

          {/* Metric 2 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              ACTIVE MANDATES
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                1,842
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>100% Escrow Backed</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              On-chain devnet rules
            </span>
          </div>

          {/* Metric 3 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              AI AUDIT SPEED
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                1.2s
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold mt-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Sub-second proof verification</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              Streaming score latency
            </span>
          </div>

          {/* Metric 4 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              JURY ACCURACY
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                99.4%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3-Persona Consensus</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              Zero false slashing events
            </span>
          </div>
        </div>
      </section>

      {/* Featured AI Models Spotlight */}
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Featured Bond-Backed AI Models
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Models with verified collateral stakes locked in Solana Program Derived Addresses
            </p>
          </div>
          <button
            onClick={onExploreMarketplace}
            className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white transition"
          >
            <span>View All ({models.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {models.slice(0, 3).map((model) => (
            <div
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className="glass-card-neon rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400/70 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-900/80 border border-purple-400/40 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-200" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition">
                        {model.name}
                      </h3>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {model.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                    {model.bondAmountSol} SOL Bond
                  </span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 mb-4">
                  {model.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/40 p-2.5 rounded-xl border border-purple-500/20 mb-4">
                  <div>
                    <span className="text-zinc-500 block">SLA Threshold</span>
                    <span className="text-purple-200 font-bold">
                      {model.claimedAccuracy ?? 95}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Trust Score</span>
                    <span className="text-emerald-400 font-bold">
                      {model.currentTrustScore ?? 90}/100
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <span className="text-[11px] font-mono text-purple-300">
                  {model.pricePerCallSol ?? 0.05} SOL / query
                </span>
                <span className="text-xs font-bold text-purple-200 group-hover:text-white flex items-center gap-1">
                  <span>Test Model</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Step Architecture Cards */}
      <section className="w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold mb-3">
            <span>ON-CHAIN AGENT ACCOUNTABILITY</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            How Shadow Guarantees AI Model Accountability
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-2 font-semibold text-shadow-sm">
            Autonomous inference needs programmable boundaries, live AI audits, and real-time claim settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {/* Card 01 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                01
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Collateral Escrow Lock
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Founders and AI operators deposit native SOL into an escrow mandate on Solana Devnet before opening agent access.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-purple-300 font-bold">
              <span>Anchor PDA Lock</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                02
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Live AI Risk Audit & Proof
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Gemini & Groq streaming oracles evaluate agent transaction velocity, accuracy thresholds, and policy parameters to flag violations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-emerald-300 font-bold">
              <span>Automated Verification</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                03
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Milestone Vault Release
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Transacted SOL is verified against active spending caps. Funds release in tranches only when payments pass AI compliance checks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-cyan-300 font-bold">
              <span>Programmatic Release</span>
            </div>
          </div>

          {/* Card 04 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                04
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Community & Slash Governance
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                A 3-Persona AI Jury votes on ambiguous claim submissions. Flagged transactions trigger automatic refunds to mandate owners.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-rose-300 font-bold">
              <span>Instant Slash & Refund</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
