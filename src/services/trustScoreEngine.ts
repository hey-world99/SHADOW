import { SettlementEvent } from '../types';

export interface TrustScoreMetrics {
  score: number | null; // null if unrated
  isUnrated: boolean;
  totalSettlements: number;
  honoredCount: number;
  slashedCount: number;
  honoredRate: number; // percentage
  volumeWeightedScore: number;
  recencyWeightedScore: number;
  streakCount: number;
  grade: 'AAA' | 'AA' | 'A' | 'BBB' | 'WARNING' | 'UNRATED';
  colorClass: string;
}

/**
 * Recalculates Trust Score whenever a settlement event fires.
 * Formula:
 * - Recency weighting: events in the last 24h have full weight 1.0, decaying to 0.7 after 7d
 * - Penalty multiplier: Slashes are weighted 2.5x more heavily than Honors to protect buyers
 * - Volume factor: Higher bonded SOL values increase confidence bounds
 * - Edge case: 0 settlements returns null ("Unrated — New Listing")
 */
export function calculateTrustScore(events: SettlementEvent[]): TrustScoreMetrics {
  if (!events || events.length === 0) {
    return {
      score: null,
      isUnrated: true,
      totalSettlements: 0,
      honoredCount: 0,
      slashedCount: 0,
      honoredRate: 0,
      volumeWeightedScore: 0,
      recencyWeightedScore: 0,
      streakCount: 0,
      grade: 'UNRATED',
      colorClass: 'text-zinc-400 border-zinc-600 bg-zinc-900/60',
    };
  }

  const now = Date.now();
  let totalWeight = 0;
  let weightedPositive = 0;
  let honoredCount = 0;
  let slashedCount = 0;
  let currentStreak = 0;
  let streakBroken = false;

  // Chronological sorting (newest first)
  const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp);

  for (const event of sorted) {
    const ageDays = Math.max(0, (now - event.timestamp) / (1000 * 60 * 60 * 24));
    // Exponential decay with half-life ~ 14 days
    const recencyWeight = Math.exp(-0.05 * ageDays);
    const volumeMultiplier = Math.log10(Math.max(10, event.bondAmount)) / 2;
    const baseWeight = recencyWeight * volumeMultiplier;

    if (event.type === 'HONOR') {
      honoredCount++;
      totalWeight += baseWeight;
      weightedPositive += baseWeight * (event.actualAccuracy / 100);
      if (!streakBroken) currentStreak++;
    } else {
      slashedCount++;
      streakBroken = true;
      // 2.5x penalty for slashes
      const slashPenaltyWeight = baseWeight * 2.5;
      totalWeight += slashPenaltyWeight;
      // slashed outcome provides 0 positive weight
    }
  }

  const rawScore = totalWeight > 0 ? (weightedPositive / totalWeight) * 100 : 0;
  const clampedScore = Math.min(99, Math.max(15, Math.round(rawScore)));

  let grade: 'AAA' | 'AA' | 'A' | 'BBB' | 'WARNING' | 'UNRATED' = 'A';
  let colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';

  if (clampedScore >= 95) {
    grade = 'AAA';
    colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
  } else if (clampedScore >= 90) {
    grade = 'AA';
    colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
  } else if (clampedScore >= 80) {
    grade = 'A';
    colorClass = 'text-amber-300 border-amber-500/40 bg-amber-950/30';
  } else if (clampedScore >= 70) {
    grade = 'BBB';
    colorClass = 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30';
  } else {
    grade = 'WARNING';
    colorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
  }

  return {
    score: clampedScore,
    isUnrated: false,
    totalSettlements: events.length,
    honoredCount,
    slashedCount,
    honoredRate: events.length > 0 ? Math.round((honoredCount / events.length) * 100) : 0,
    volumeWeightedScore: clampedScore,
    recencyWeightedScore: clampedScore,
    streakCount: currentStreak,
    grade,
    colorClass,
  };
}
