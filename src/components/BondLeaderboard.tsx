import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Trophy,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getAccountExplorerUrl } from '../services/solanaService';

interface BondLeaderboardProps {
  entries: LeaderboardEntry[];
  onSelectModel: (modelId: string) => void;
}

export const BondLeaderboard: React.FC<BondLeaderboardProps> = ({
  entries,
  onSelectModel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'bond' | 'trust' | 'streak' | 'settlements'>('trust');

  const filteredEntries = useMemo(() => {
    return entries
      .filter(
        (e) =>
          e.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.creatorAddress.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (filterBy === 'trust') return b.trustScore - a.trustScore;
        if (filterBy === 'bond') return b.totalBondStakedSol - a.totalBondStakedSol;
        if (filterBy === 'streak') return b.consecutiveStreak - a.consecutiveStreak;
        if (filterBy === 'settlements') return b.totalSettlements - a.totalSettlements;
        return 0;
      });
  }, [entries, searchQuery, filterBy]);

  return (
    <div className="main-container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/30 text-purple-200 text-xs font-mono font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>GLOBAL BOND RANKINGS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            Verifiable Trust Leaderboard
          </h2>
          <p className="text-sm text-zinc-300 font-semibold text-shadow-sm mt-1">
            Real skin-in-the-game. Models ranked strictly by mathematical on-chain proof and bonded collateral.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-purple-500/30">
          <button
            onClick={() => setFilterBy('trust')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterBy === 'trust'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Highest Trust
          </button>
          <button
            onClick={() => setFilterBy('bond')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterBy === 'bond'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-300" />
            Top Bonded
          </button>
          <button
            onClick={() => setFilterBy('streak')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterBy === 'streak'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Longest Streak
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search creator, model, or Solana address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-purple-500/30 focus:border-purple-400 focus:outline-none text-white text-xs font-semibold placeholder:text-zinc-500"
        />
      </div>

      {/* Leaderboard Table Container */}
      <div className="glass-card-neon rounded-2xl border border-purple-500/30 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-500/30 bg-black/70 text-[11px] font-mono uppercase text-zinc-400 font-bold">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Model & Creator</th>
                <th className="py-3.5 px-4 text-right">Bond Staked</th>
                <th className="py-3.5 px-4 text-center">Trust Score</th>
                <th className="py-3.5 px-4 text-center">Honored / Slashed</th>
                <th className="py-3.5 px-4 text-center">Consecutive Streak</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {filteredEntries.map((entry, index) => {
                const isTop3 = index < 3;
                return (
                  <tr
                    key={entry.rank}
                    onClick={() => onSelectModel(entry.modelId)}
                    className="hover:bg-purple-950/40 transition cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 font-mono font-black">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                            <Trophy className="w-4 h-4" />
                          </div>
                        ) : index === 1 ? (
                          <div className="w-7 h-7 rounded-xl bg-zinc-400/20 border border-zinc-300 text-zinc-200 flex items-center justify-center">
                            2
                          </div>
                        ) : index === 2 ? (
                          <div className="w-7 h-7 rounded-xl bg-amber-800/30 border border-amber-600 text-amber-400 flex items-center justify-center">
                            3
                          </div>
                        ) : (
                          <span className="text-zinc-400 pl-2">#{entry.rank}</span>
                        )}
                      </div>
                    </td>

                    {/* Model & Creator */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-white text-sm group-hover:text-purple-300 transition block">
                          {entry.modelName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-zinc-400">{entry.creatorName}</span>
                          <span className="text-purple-400">&bull;</span>
                          <a
                            href={getAccountExplorerUrl(entry.creatorAddress)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[10px] text-purple-300 hover:text-white flex items-center gap-0.5"
                          >
                            <span>{entry.creatorAddress.slice(0, 4)}...{entry.creatorAddress.slice(-4)}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Total Bond Staked */}
                    <td className="py-4 px-4 text-right font-mono font-black text-white text-sm">
                      <span className="text-purple-300">{entry.totalBondStakedSol.toLocaleString()}</span> SOL
                    </td>

                    {/* Trust Score */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{entry.trustScore}%</span>
                      </div>
                    </td>

                    {/* Honored / Slashed */}
                    <td className="py-4 px-4 text-center font-mono">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-emerald-400 font-bold">{entry.honoredCount}</span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-rose-400 font-bold">{entry.slashedCount}</span>
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{entry.consecutiveStreak} streak</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectModel(entry.modelId);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_12px_rgba(168,85,247,0.4)] transition"
                      >
                        Inspect Bond
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
