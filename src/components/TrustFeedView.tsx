import React, { useState } from 'react';
import {
  Radio,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SettlementEvent } from '../types';
import { getSolanaExplorerUrl } from '../services/solanaService';

interface TrustFeedViewProps {
  settlements: SettlementEvent[];
  onSelectModel: (modelId: string) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  onInspectTx?: (txData: any) => void;
}

export const TrustFeedView: React.FC<TrustFeedViewProps> = ({
  settlements,
  onSelectModel,
  demoMode,
  setDemoMode,
  onInspectTx,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HONOR' | 'SLASH'>('ALL');

  const filteredSettlements = settlements.filter((s) => {
    if (filter === 'ALL') return true;
    return s.type === filter;
  });

  const honoredCount = settlements.filter((s) => s.type === 'HONOR').length;
  const slashedCount = settlements.filter((s) => s.type === 'SLASH').length;

  return (
    <div className="main-container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/30 text-purple-200 text-xs font-mono font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>REAL-TIME ORACLE SETTLEMENT STREAM</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            Live Trust & Slashing Ledger
          </h2>
          <p className="text-sm text-zinc-300 font-semibold text-shadow-sm mt-1">
            Every transaction is verified on-chain. When models violate SLAs, bonds are slashed and buyers refunded instantly.
          </p>
        </div>

        {/* Live Stream Controller & Filter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition ${
              demoMode
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            {demoMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Stream Live</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Stream Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Total Verified Events</span>
          <div className="font-mono text-3xl font-black text-white mt-1 text-shadow-sm">
            {settlements.length} <span className="text-sm text-purple-400 font-normal">on Devnet</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Sub-second block finalization</span>
        </div>

        <div className="glass-card-neon p-5 rounded-2xl border border-emerald-500/30">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Honored Claims</span>
          <div className="font-mono text-3xl font-black text-emerald-300 mt-1 text-shadow-sm">
            {honoredCount} <span className="text-sm font-normal text-emerald-400 font-mono">({Math.round((honoredCount / (settlements.length || 1)) * 100)}%)</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Creator yields paid out</span>
        </div>

        <div className="glass-card-neon p-5 rounded-2xl border border-rose-500/30">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">Slashed Violations</span>
          <div className="font-mono text-3xl font-black text-rose-400 mt-1 text-shadow-sm">
            {slashedCount} <span className="text-sm font-normal text-rose-400 font-mono">({Math.round((slashedCount / (settlements.length || 1)) * 100)}%)</span>
          </div>
          <span className="text-[11px] text-rose-300 mt-1 block font-bold">100% Instant Buyer Refunds</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'ALL'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
              : 'text-zinc-400 hover:text-white bg-black/40'
          }`}
        >
          All Events ({settlements.length})
        </button>
        <button
          onClick={() => setFilter('HONOR')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'HONOR'
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'text-zinc-400 hover:text-white bg-black/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Honored Only ({honoredCount})
        </button>
        <button
          onClick={() => setFilter('SLASH')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filter === 'SLASH'
              ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
              : 'text-zinc-400 hover:text-white bg-black/40'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Slashed Only ({slashedCount})
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredSettlements.map((event) => {
          const isHonored = event.type === 'HONOR';
          return (
            <div
              key={event.id}
              onClick={() => onSelectModel(event.modelId)}
              className={`p-4 sm:p-5 rounded-2xl glass-card-neon border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isHonored
                  ? 'border-emerald-500/30 hover:border-emerald-400/60'
                  : 'border-rose-500/40 hover:border-rose-400/70 bg-rose-950/20'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                    isHonored
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  }`}
                >
                  {isHonored ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-white text-base hover:text-purple-300 transition">
                      {event.modelName}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded ${
                        isHonored
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      }`}
                    >
                      {isHonored ? 'SLA Honored' : 'Bond Slashed'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-1 font-semibold">
                    Claimed Accuracy: <span className="font-mono text-white">{event.claimedAccuracy}%</span> &bull; Verified
                    Observed: <span className={`font-mono font-bold ${isHonored ? 'text-emerald-400' : 'text-rose-400'}`}>{event.actualAccuracy}%</span>
                    {event.reason && ` &bull; ${event.reason}`}
                  </p>
                </div>
              </div>

              {/* Right Amounts & Explorer */}
              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase block font-bold">
                    {isHonored ? 'Collateral Released' : 'Buyer Refunded'}
                  </span>
                  <span className={`font-mono text-sm font-black ${isHonored ? 'text-emerald-400' : 'text-rose-300'}`}>
                    {isHonored ? `+${event.bondAmount} SOL` : `${event.refundAmount} SOL`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onInspectTx) {
                      onInspectTx({
                        signature: event.txHash,
                        instructionName: isHonored ? 'settle_performance_sla' : 'slash_and_refund',
                        type: isHonored ? 'SLA_VERIFIED' : 'SLASH_REFUND',
                        status: 'finalized',
                        timestamp: event.timestamp,
                        modelName: event.modelName,
                        amountSol: isHonored ? event.bondAmount : event.refundAmount,
                        oracleAccuracy: event.actualAccuracy,
                        slaAccuracy: event.claimedAccuracy,
                        blockSlot: 284910243 + Math.floor(Math.random() * 500),
                      });
                    }
                  }}
                  className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  title="Inspect On-Chain Logs & Oracle Proof"
                >
                  <span className="text-[11px] font-bold hidden sm:inline">Receipt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
