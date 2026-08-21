import React, { useState } from 'react';
import {
  X,
  Plus,
  Lock,
  Coins,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Droplets,
} from 'lucide-react';
import { AIModel, ModelCategory, WalletState } from '../types';
import { executeSolanaDevnetTransaction } from '../services/solanaService';

interface ListModelModalProps {
  onClose: () => void;
  wallet: WalletState;
  onConnectWallet: () => void;
  onRequestAirdrop: () => void;
  isAirdropping: boolean;
  onModelCreated: (model: AIModel, txHash: string, updatedBalance?: number) => void;
}

export const ListModelModal: React.FC<ListModelModalProps> = ({
  onClose,
  wallet,
  onConnectWallet,
  onRequestAirdrop,
  isAirdropping,
  onModelCreated,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ModelCategory>('Trading');
  const [claimedAccuracy, setClaimedAccuracy] = useState('99.2');
  const [bondAmountSol, setBondAmountSol] = useState('25');
  const [pricePerCallSol, setPricePerCallSol] = useState('0.05');
  const [tokenMint, setTokenMint] = useState<'SOL' | 'USDC'>('SOL');
  const [endpointUrl, setEndpointUrl] = useState('https://api.shadow.market/v1/models/custom/predict');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const bondNum = parseFloat(bondAmountSol) || 0;
  const hasInsufficientBalance = wallet.connected && wallet.balanceSol < bondNum;
  const shortfallAmount = Math.max(0, bondNum - wallet.balanceSol);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline || bondNum <= 0) return;

    if (!wallet.connected) {
      onConnectWallet();
      return;
    }

    if (hasInsufficientBalance) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Execute real or simulated Devnet transaction
      const txResult = await executeSolanaDevnetTransaction({
        amountSol: bondNum,
        recipientAddress: 'ShdwBond11111111111111111111111111111111111',
      });

      const txHash = txResult.signature;

      const newModel: AIModel = {
        id: `model-${Date.now()}`,
        name,
        tagline,
        description: description || tagline,
        category,
        creator: {
          name: wallet.publicKey ? `Creator (${wallet.publicKey.slice(0, 4)}...${wallet.publicKey.slice(-4)})` : 'Anonymous Creator',
          address: wallet.publicKey || '5Z53...x3vp',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          honoredStreak: 0,
          totalBondedSol: bondNum,
          rating: 'New Listing',
        },
        claimedAccuracy: parseFloat(claimedAccuracy) || 98.0,
        currentTrustScore: null, // Initial unrated state
        bondAmountSol: bondNum,
        tokenMint,
        pricePerCallSol: parseFloat(pricePerCallSol) || 0.05,
        testsCount: 0,
        settlementsCount: 0,
        slashesCount: 0,
        status: 'unrated',
        latencyMs: 250,
        endpointUrl,
        slashConditions: [
          `Accuracy falls below ${(parseFloat(claimedAccuracy) - 4).toFixed(1)}% on test suites`,
          'Execution latency exceeds 2500ms SLA cap',
        ],
        benchmarks: [
          { metric: 'Claimed Accuracy', claimed: parseFloat(claimedAccuracy) || 98.0, verified: parseFloat(claimedAccuracy) || 98.0, unit: '%' },
        ],
        settlementHistory: [],
        samplePrompts: [
          'Run sample verification query with locked collateral guarantee.',
        ],
        bannerGradient: 'from-purple-950/70 via-indigo-950/80 to-black',
        contractPda: 'Shdw' + txHash.slice(0, 36),
      };

      setIsSubmitting(false);
      onModelCreated(newModel, txHash, txResult.updatedBalance);
    } catch (err: any) {
      console.error('Failed to stake bond:', err);
      setSubmitError(err?.message || 'Failed to sign or broadcast transaction on Solana Devnet.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card-neon border-2 border-purple-500/50 p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(147,51,234,0.4)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/40 text-zinc-300 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-purple-500/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>SOLANA DEVNET ANCHOR LISTING</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white text-shadow-hero">
            Stake Performance Bond & List Model
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-semibold mt-1">
            Back your AI model with real on-chain collateral to earn immediate buyer trust.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="my-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {/* Model Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-300 font-bold block mb-1">Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chronos Sentinel v2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950/90 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-300 font-bold block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950/90 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-purple-400 focus:outline-none"
              >
                <option value="Trading">Trading & Finance</option>
                <option value="Code & Security">Code & Security</option>
                <option value="NLP">NLP & Text Reasoning</option>
                <option value="Vision">Computer Vision</option>
                <option value="Autonomous Agent">Autonomous Agent</option>
                <option value="BioMed">BioMed & Science</option>
                <option value="Multimodal">Multimodal</option>
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="text-xs font-mono text-zinc-300 font-bold block mb-1">Short Tagline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sub-second Solana MEV arbitrage predictor with 99% accuracy guarantee"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-zinc-950/90 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono text-zinc-300 font-bold block mb-1">Full Architecture & Description</label>
            <textarea
              rows={2}
              placeholder="Explain model training data, benchmark validation, and SLA enforcement terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950/90 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Claimed Accuracy & Bond Staking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/60 border border-purple-500/30">
            <div>
              <label className="text-[11px] font-mono text-zinc-300 font-bold block mb-1">
                Claimed Accuracy (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="99.9"
                required
                value={claimedAccuracy}
                onChange={(e) => setClaimedAccuracy(e.target.value)}
                className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2 text-xs text-emerald-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-300 font-bold block mb-1">
                Bond to Stake (SOL) *
              </label>
              <input
                type="number"
                min="5"
                required
                value={bondAmountSol}
                onChange={(e) => setBondAmountSol(e.target.value)}
                className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2 text-xs text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-300 font-bold block mb-1">
                Price Per Call (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.001"
                required
                value={pricePerCallSol}
                onChange={(e) => setPricePerCallSol(e.target.value)}
                className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2 text-xs text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Insufficient Balance Inline Alert */}
          {hasInsufficientBalance && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <p className="font-bold">Insufficient Devnet SOL for Bond Deposit</p>
                  <p className="text-[11px] text-rose-300 font-mono">
                    Shortfall: {shortfallAmount.toFixed(2)} SOL needed (Your Balance: {wallet.balanceSol.toFixed(2)} SOL)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRequestAirdrop}
                disabled={isAirdropping}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>+1 SOL Faucet</span>
              </button>
            </div>
          )}

          {/* Wallet check alert */}
          {!wallet.connected && (
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs flex items-center justify-between">
              <span>Connect your Solana wallet to sign the Escrow creation transaction.</span>
              <button
                type="button"
                onClick={onConnectWallet}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold text-xs"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || hasInsufficientBalance}
              className="w-full neon-glow-btn py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 border border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Locking Bond into Solana Escrow...' : `Stake ${bondNum} SOL & Deploy Listing`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
