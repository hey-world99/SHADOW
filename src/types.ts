export type ModelCategory =
  | 'All'
  | 'Trading'
  | 'Code & Security'
  | 'NLP'
  | 'Vision'
  | 'Autonomous Agent'
  | 'BioMed'
  | 'Multimodal';

export interface SettlementEvent {
  id: string;
  timestamp: number;
  modelId: string;
  modelName: string;
  type: 'HONOR' | 'SLASH';
  bondAmount: number; // in SOL
  claimedAccuracy: number; // e.g. 98.5
  actualAccuracy: number; // e.g. 99.1 or 91.2
  buyerAddress?: string;
  creatorAddress?: string;
  txHash: string;
  reason?: string;
  refundAmount?: number;
}

export interface LeaderboardEntry {
  rank: number;
  modelId: string;
  modelName: string;
  creatorName: string;
  creatorAddress: string;
  totalBondStakedSol: number;
  trustScore: number;
  honoredCount: number;
  slashedCount: number;
  totalSettlements: number;
  consecutiveStreak: number;
}

export interface ModelBenchmark {
  metric: string;
  claimed: number;
  verified: number;
  unit: string;
}

export interface AIModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ModelCategory;
  creator: {
    name: string;
    address: string;
    avatar: string;
    honoredStreak: number;
    totalBondedSol: number;
    rating: string;
  };
  claimedAccuracy: number; // percentage
  currentTrustScore: number | null; // null if unrated/brand new
  bondAmountSol: number; // staked SOL
  tokenMint: 'SOL' | 'USDC';
  pricePerCallSol: number;
  testsCount: number;
  settlementsCount: number;
  slashesCount: number;
  status: 'active' | 'slashed' | 'unrated';
  latencyMs: number;
  endpointUrl: string;
  slashConditions: string[];
  benchmarks: ModelBenchmark[];
  settlementHistory: SettlementEvent[];
  samplePrompts: string[];
  systemPromptPreset?: string;
  bannerGradient: string;
  contractPda: string;
}

export interface WalletTransaction {
  signature: string;
  description: string;
  timestamp: number;
  type: 'BOND_STAKE' | 'PURCHASE' | 'SETTLE' | 'AIRDROP' | 'SLASH';
  amountSol: number;
  status: 'confirmed' | 'pending' | 'failed';
  explorerUrl: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balanceSol: number;
  network: 'devnet';
  isPhantom: boolean;
  transactions: WalletTransaction[];
}

export interface CreatorProfile {
  address: string;
  name: string;
  avatar: string;
  streakCount: number;
  totalBondedSol: number;
  totalSettlements: number;
  totalEarningsSol: number;
  modelsCount: number;
  rank: number;
  trustScore: number;
  category: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  txHash?: string;
  explorerUrl?: string;
  duration?: number;
}
