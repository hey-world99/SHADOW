import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Coins,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  ExternalLink,
  Plus,
  Layers,
  FileCode2,
  CheckCircle2,
  Droplets,
  Radio,
} from 'lucide-react';
import { AIModel, WalletState } from '../types';
import { getSolanaExplorerUrl } from '../services/solanaService';

interface CreatorDashboardProps {
  wallet: WalletState;
  models: AIModel[];
  onOpenListModel: () => void;
  onConnectWallet: () => void;
  onRequestAirdrop: () => void;
  onSelectModel: (modelId: string) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  wallet,
  models,
  onOpenListModel,
  onConnectWallet,
  onRequestAirdrop,
  onSelectModel,
}) => {
  // Compute portfolio stats
  const creatorModels = models.slice(0, 3); // Sample creator portfolio
  const totalBondsAtRisk = creatorModels.reduce((acc, m) => acc + m.bondAmountSol, 0);
  const totalEarningsSol = creatorModels.reduce((acc, m) => acc + m.settlementsCount * m.pricePerCallSol, 0);
  const totalSettlements = creatorModels.reduce((acc, m) => acc + m.settlementsCount, 0);

  return (
    <div className="main-container py-8 space-y-8">
      {/* Top Banner & Profile Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/30 text-purple-200 text-xs font-mono font-bold mb-2">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>CREATOR HUB & PORTFOLIO</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            Your Bonded Models & Yield
          </h2>
          <p className="text-sm text-zinc-300 font-semibold text-shadow-sm mt-1">
            Manage your staked performance bonds, monitor SLA proofs, and claim inference revenues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenListModel}
            className="neon-glow-btn px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white flex items-center gap-2 border border-purple-400/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Model (Stake Bond)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Bonds Currently At Risk</span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1 text-shadow-sm">
            {totalBondsAtRisk} <span className="text-purple-400 text-sm">SOL</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Locked across 3 active listings</span>
        </div>

        <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Total Earnings Claimable</span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 mt-1 text-shadow-sm">
            {totalEarningsSol.toFixed(2)} <span className="text-sm">SOL</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">From verified API inference calls</span>
        </div>

        <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Total Honored Settlements</span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1 text-shadow-sm">
            {totalSettlements}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-bold">99.7% Success Rate</span>
        </div>

        <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Creator Reputation Grade</span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-purple-300 mt-1 text-shadow-sm">
            AAA &bull; Top Tier 1
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Consecutive Streak: 48</span>
        </div>
      </div>

      {/* Creator's Listed Models Table */}
      <div className="glass-card-neon rounded-2xl border border-purple-500/30 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Your Staked Models
          </h3>
          <span className="text-xs font-mono text-zinc-400 font-bold">3 Active Listings on Solana Devnet</span>
        </div>

        <div className="space-y-3">
          {creatorModels.map((model) => (
            <div
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className="p-4 rounded-xl bg-black/50 hover:bg-purple-950/40 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm group-hover:text-purple-300 transition">
                    {model.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                    {model.category}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    {model.claimedAccuracy}% SLA Claim
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1">{model.tagline}</p>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-auto text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Bond Staked</span>
                  <span className="font-black text-white">{model.bondAmountSol} SOL</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Trust Score</span>
                  <span className="font-black text-emerald-400">{model.currentTrustScore}%</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Settlements</span>
                  <span className="font-black text-white">{model.settlementsCount}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectModel(model.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
