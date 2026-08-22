import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Shield,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sliders,
  DollarSign,
  Cpu,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Bot,
} from 'lucide-react';
import { AIModel } from '../types';

interface ModelRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: AIModel[];
  onSelectModel: (model: AIModel, initialPrompt?: string) => void;
  onBuyAccess: (model: AIModel) => void;
}

export const ModelRecommenderModal: React.FC<ModelRecommenderModalProps> = ({
  isOpen,
  onClose,
  models,
  onSelectModel,
  onBuyAccess,
}) => {
  const [useCase, setUseCase] = useState<string>('Trading');
  const [budgetTier, setBudgetTier] = useState<'any' | 'low' | 'medium' | 'high'>('any');
  const [minSla, setMinSla] = useState<number>(99.0);
  const [latencyPref, setLatencyPref] = useState<'ultra' | 'balanced' | 'deep'>('balanced');
  const [customText, setCustomText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  if (!isOpen) return null;

  const useCaseOptions = [
    { id: 'Trading', label: 'Trading & Arbitrage', icon: '📈', desc: 'DEX routing, flash arbitrage, orderbook signals' },
    { id: 'Code & Security', label: 'Smart Contract Audit', icon: '🛡️', desc: 'Solana Anchor formal verification, reentrancy' },
    { id: 'BioMed', label: 'Clinical & Diagnostics', icon: '🧬', desc: 'Biomedical pathology, drug interactions' },
    { id: 'Vision', label: 'Visual & Fraud Sentinel', icon: '👁️', desc: 'Deepfake detection, KYC document parsing' },
    { id: 'Autonomous Agent', label: 'Autonomous Agent', icon: '🤖', desc: 'Multi-step goal execution, on-chain actions' },
  ];

  const handleRunRecommendation = async () => {
    setIsAnalyzing(true);
    try {
      let budgetVal = undefined;
      if (budgetTier === 'low') budgetVal = 0.05;
      if (budgetTier === 'medium') budgetVal = 0.10;
      if (budgetTier === 'high') budgetVal = 0.20;

      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCase,
          budgetSol: budgetVal,
          minSla,
          latencyPreference: latencyPref,
          customRequirements: customText,
        }),
      });

      const data = await res.json();
      setRecommendationResult(data);
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMatchedModelObj = (modelId: string): AIModel | undefined => {
    return models.find((m) => m.id === modelId) || models[0];
  };

  return (
    <div
      id="model-recommender-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="model-recommender-modal"
        className="relative w-full max-w-4xl bg-[#0d051f]/95 border-2 border-purple-500/60 rounded-3xl shadow-[0_20px_80px_rgba(168,85,247,0.4)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-[#0d051f] border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center border border-purple-300/50 shadow-[0_0_20px_rgba(168,85,247,0.7)]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wider flex items-center gap-2">
                Intelligent Model Recommender
              </h2>
              <p className="text-xs text-purple-300/90 font-medium">
                AI-driven matching based on use case, budget, SLA threshold & on-chain collateral
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30">
          
          {/* Step 1: Requirements Builder */}
          <div className="space-y-5">
            {/* Use Case Domain Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-purple-300 mb-2.5">
                1. Select Primary Domain / Use Case:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {useCaseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setUseCase(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      useCase === opt.id
                        ? 'bg-purple-900/60 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-[1.02]'
                        : 'bg-zinc-950/60 border-purple-500/20 hover:border-purple-500/50 text-zinc-300'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{opt.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.label}</h4>
                      <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Budget Tier */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-purple-500/25 space-y-2">
                <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                  <span>Max Budget / Query</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {budgetTier === 'any' ? 'Flexible' : budgetTier === 'low' ? '< 0.05 SOL' : budgetTier === 'medium' ? '< 0.10 SOL' : '> 0.12 SOL'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['low', 'medium', 'any'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setBudgetTier(tier)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        budgetTier === tier
                          ? 'bg-emerald-600 text-white font-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min SLA Accuracy */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-purple-500/25 space-y-2">
                <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                  <span>Min SLA Guarantee</span>
                  <span className="text-purple-400 font-mono font-bold">{minSla}%+</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[98.5, 99.0, 99.5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMinSla(val)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        minSla === val
                          ? 'bg-purple-600 text-white font-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Latency Preference */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-purple-500/25 space-y-2">
                <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                  <span>Latency Target</span>
                  <span className="text-indigo-400 font-mono font-bold capitalize">{latencyPref}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['ultra', 'balanced', 'deep'] as const).map((lat) => (
                    <button
                      key={lat}
                      onClick={() => setLatencyPref(lat)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        latencyPref === lat
                          ? 'bg-indigo-600 text-white font-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {lat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Natural Language Custom Requirement */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-purple-300 mb-1.5">
                Optional: Describe Custom Technical Specifications
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="E.g., I need sub-second arbitrage calculations between Raydium and Orca with guaranteed protection against stale price quotes..."
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-950/90 border border-purple-500/30 text-sm text-white placeholder-zinc-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleRunRecommendation}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-base tracking-wider uppercase shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  <span>Gemini Oracle Analyzing Model Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Find Best Bonded Model Matches</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {recommendationResult && (
            <div className="pt-6 border-t border-purple-500/30 space-y-6 animate-fade-in">
              
              {/* AI Reasoning Summary */}
              {recommendationResult.reasoning && (
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-purple-200 text-xs sm:text-sm flex items-start gap-3 shadow-md">
                  <Bot className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Gemini 2.5 Oracle Match Justification:</span>
                    <p className="leading-relaxed">{recommendationResult.reasoning}</p>
                  </div>
                </div>
              )}

              {/* #1 Top Match Hero Card */}
              {recommendationResult.topRecommendation && (() => {
                const topRec = recommendationResult.topRecommendation;
                const fullModel = getMatchedModelObj(topRec.id);
                return (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/60 via-indigo-950/80 to-[#0a0316] border-2 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.4)] relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-xs font-black font-mono flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {topRec.matchScore || 99}% COMPATIBILITY MATCH
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-mono">
                          ★ TOP RECOMMENDED MODEL
                        </span>
                        <h3 className="text-2xl font-heading font-black text-white mt-1">
                          {topRec.name}
                        </h3>
                        <p className="text-sm text-purple-200/90 font-medium">
                          {topRec.tagline}
                        </p>
                      </div>

                      {/* Specs Badge Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
                        <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">PDA Staked Bond</span>
                          <span className="text-base font-black text-amber-300 font-mono flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            {topRec.bondAmountSol} SOL
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">SLA Accuracy Guarantee</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {topRec.claimedAccuracy}%
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Price Per Call</span>
                          <span className="text-base font-black text-purple-300 font-mono">
                            {topRec.pricePerCallSol} SOL
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Execution Latency</span>
                          <span className="text-base font-black text-indigo-300 font-mono">
                            {topRec.latencyMs}ms
                          </span>
                        </div>
                      </div>

                      {/* Recommended Test Prompt */}
                      {topRec.recommendedPrompt && (
                        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-purple-500/20 space-y-1">
                          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-300" />
                            Suggested Test Prompt for Sandbox:
                          </span>
                          <p className="text-xs text-zinc-200 font-mono italic">
                            "{topRec.recommendedPrompt}"
                          </p>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        {fullModel && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectModel(fullModel, topRec.recommendedPrompt);
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.6)] cursor-pointer"
                          >
                            <Zap className="w-4 h-4 text-amber-300" />
                            Test in Interactive Sandbox
                          </button>
                        )}
                        {fullModel && (
                          <button
                            onClick={() => {
                              onClose();
                              onBuyAccess(fullModel);
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
                          >
                            <Shield className="w-4 h-4 text-white" />
                            Lock Escrow & Buy Access ({topRec.pricePerCallSol} SOL)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Other Ranked Options */}
              {recommendationResult.rankedModels && recommendationResult.rankedModels.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                    Alternative Ranked Models:
                  </h4>
                  <div className="space-y-2">
                    {recommendationResult.rankedModels.slice(1).map((alt: any) => {
                      const fullModel = getMatchedModelObj(alt.id);
                      return (
                        <div
                          key={alt.id}
                          className="p-4 rounded-2xl bg-zinc-950/70 border border-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{alt.name}</h5>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                                {alt.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5">{alt.tagline}</p>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {fullModel && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectModel(fullModel);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold cursor-pointer transition-all"
                              >
                                Test Sandbox
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
