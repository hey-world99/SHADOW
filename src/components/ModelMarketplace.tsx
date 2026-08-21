import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Code2,
  Lock,
} from 'lucide-react';
import { AIModel, ModelCategory } from '../types';
import { calculateTrustScore } from '../services/trustScoreEngine';
import { getAccountExplorerUrl } from '../services/solanaService';

interface ModelMarketplaceProps {
  models: AIModel[];
  onSelectModel: (modelId: string) => void;
  onOpenSandbox: (modelId: string) => void;
  onOpenListModel: () => void;
}

const CATEGORIES: ModelCategory[] = [
  'All',
  'Trading',
  'Code & Security',
  'NLP',
  'Vision',
  'Autonomous Agent',
  'BioMed',
  'Multimodal',
];

export const ModelMarketplace: React.FC<ModelMarketplaceProps> = ({
  models,
  onSelectModel,
  onOpenSandbox,
  onOpenListModel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trust' | 'bond' | 'accuracy' | 'tests' | 'newest'>('trust');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedModels = useMemo(() => {
    return models
      .filter((model) => {
        const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
        const matchesSearch =
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'trust') {
          const scoreA = a.currentTrustScore ?? -1;
          const scoreB = b.currentTrustScore ?? -1;
          return scoreB - scoreA;
        }
        if (sortBy === 'bond') {
          return b.bondAmountSol - a.bondAmountSol;
        }
        if (sortBy === 'accuracy') {
          return b.claimedAccuracy - a.claimedAccuracy;
        }
        if (sortBy === 'tests') {
          return b.testsCount - a.testsCount;
        }
        if (sortBy === 'newest') {
          return b.settlementsCount === 0 ? 1 : -1;
        }
        return 0;
      });
  }, [models, selectedCategory, searchQuery, sortBy]);

  return (
    <div id="marketplace-section" className="main-container py-8 scroll-mt-20">
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/30 text-purple-200 text-xs font-mono font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>DISCOVERY MARKETPLACE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            Bond-Backed AI Models
          </h2>
          <p className="text-sm text-zinc-300 font-semibold text-shadow-sm mt-1">
            Zero star ratings. Every model stakes real on-chain collateral behind its benchmark claim.
          </p>
        </div>

        <button
          onClick={onOpenListModel}
          className="neon-glow-btn px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white flex items-center gap-2 border border-purple-400/50 self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Stake & List Your Model</span>
        </button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-4 rounded-2xl glass-card-neon border border-purple-500/30 mb-8 space-y-4">
        {/* Search and Sort row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model, creator, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-purple-500/30 focus:border-purple-400 focus:outline-none text-white text-xs font-semibold placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/80 border border-purple-500/30 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="trust">Highest Trust Score</option>
                <option value="bond">Largest Bond Size</option>
                <option value="accuracy">Claimed Accuracy</option>
                <option value="tests">Most Tested</option>
                <option value="newest">New Listings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-purple-400'
                  : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      {filteredAndSortedModels.length === 0 ? (
        <div className="text-center py-16 glass-card-neon rounded-2xl border border-purple-500/30 p-8">
          <ShieldAlert className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="font-heading text-xl font-bold text-white">No models found</h3>
          <p className="text-xs text-zinc-400 mt-1">Try adjusting your search filters or category chips.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedModels.map((model) => {
            const trustMetrics = calculateTrustScore(model.settlementHistory);
            const isUnrated = model.currentTrustScore === null;
            const trustScore = model.currentTrustScore;

            return (
              <div
                key={model.id}
                onClick={() => onSelectModel(model.id)}
                className="glass-card-neon rounded-2xl border border-purple-500/30 p-6 flex flex-col justify-between cursor-pointer group hover:border-purple-400/70 transition-all hover:scale-[1.01] relative overflow-hidden"
              >
                {/* Top Row: Category & Status Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40">
                      {model.category}
                    </span>

                    {/* Trust Score Badge */}
                    <div className="flex items-center gap-1.5">
                      {isUnrated ? (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-600">
                          Unrated &bull; New Listing
                        </span>
                      ) : trustScore! >= 90 ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{trustScore}% Trust</span>
                        </div>
                      ) : trustScore! >= 70 ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-amber-950/80 text-amber-300 border border-amber-500/50">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          <span>{trustScore}% Trust</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>{trustScore}% Slashed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Model Title & Tagline */}
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-purple-300 transition text-shadow-sm">
                    {model.name}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1.5 line-clamp-2 font-medium leading-relaxed">
                    {model.tagline}
                  </p>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-purple-500/20">
                    <img
                      src={model.creator.avatar}
                      alt={model.creator.name}
                      className="w-6 h-6 rounded-full object-cover border border-purple-400/40"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-bold truncate">{model.creator.name}</p>
                      <p className="text-[10px] font-mono text-purple-300/80 truncate">
                        Streak: {model.creator.honoredStreak} Honored
                      </p>
                    </div>
                  </div>

                  {/* Metrics Row (Claimed Accuracy & Bond Staked) */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-black/50 border border-purple-500/20">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Bond Staked</span>
                      <div className="font-mono text-sm font-black text-white text-shadow-sm flex items-center gap-1">
                        <Lock className="w-3 h-3 text-purple-400" />
                        <span>{model.bondAmountSol} SOL</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Claimed Accuracy</span>
                      <div className="font-mono text-sm font-black text-emerald-400 text-shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{model.claimedAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA Actions */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-purple-500/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSandbox(model.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Code2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Sandbox Test</span>
                  </button>

                  <button
                    onClick={() => onSelectModel(model.id)}
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition"
                  >
                    <span>View & Bet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
