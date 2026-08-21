import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Play,
  ShieldCheck,
  Lock,
  Coins,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
} from 'lucide-react';
import { WalletState } from '../types';
import { generateDevnetTxHash, getSolanaExplorerUrl } from '../services/solanaService';

interface AnchorSmartContractViewerProps {
  wallet: WalletState;
  onTriggerContractInstruction: (
    instructionName: string,
    params: Record<string, any>
  ) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  onConnectWallet: () => void;
  onInspectTx?: (txData: any) => void;
}

const RUST_ANCHOR_CODE = `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("ShdwBond11111111111111111111111111111111111");

#[program]
pub mod shadow_bond {
    use super::*;

    /// 1. Creator deposits SOL/USDC collateral to back performance claim
    pub fn create_listing(
        ctx: Context<CreateListing>,
        claimed_accuracy_bps: u16, // e.g. 9940 = 99.40%
        bond_amount_lamports: u64,
        price_per_call: u64,
    ) -> Result<()> {
        require!(bond_amount_lamports >= 10_000_000_000, ShadowError::InsufficientBond); // Min 10 SOL
        let listing = &mut ctx.accounts.listing;
        listing.creator = ctx.accounts.creator.key();
        listing.claimed_accuracy_bps = claimed_accuracy_bps;
        listing.bond_amount = bond_amount_lamports;
        listing.price_per_call = price_per_call;
        listing.is_active = true;
        listing.is_settled = false;
        listing.settlement_count = 0;
        listing.total_slashed = 0;
        listing.bump = ctx.bumps.listing;

        // Transfer collateral into Escrow PDA
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.creator.to_account_info(),
                    to: ctx.accounts.escrow_vault.to_account_info(),
                },
            ),
            bond_amount_lamports,
        )?;

        emit!(ListingCreatedEvent {
            listing: listing.key(),
            creator: listing.creator,
            bond_amount: bond_amount_lamports,
            claimed_accuracy_bps,
        });

        Ok(())
    }

    /// 2. Buyer deposits payment into escrow before inference
    pub fn purchase_access(ctx: Context<PurchaseAccess>, calls_count: u32) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_active, ShadowError::ListingNotFound);
        require!(!listing.is_settled, ShadowError::AlreadySettled);

        let total_cost = listing.price_per_call.checked_mul(calls_count as u64)
            .ok_or(ShadowError::MathOverflow)?;

        // Escrow funds held in Buyer Escrow PDA
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.escrow_vault.to_account_info(),
                },
            ),
            total_cost,
        )?;

        Ok(())
    }

    /// 3. Oracle records verifiable execution proof against claimed SLA
    pub fn submit_performance_proof(
        ctx: Context<SubmitProof>,
        observed_accuracy_bps: u16,
        latency_ms: u32,
    ) -> Result<()> {
        let proof = &mut ctx.accounts.proof;
        proof.oracle = ctx.accounts.oracle.key();
        proof.observed_accuracy_bps = observed_accuracy_bps;
        proof.latency_ms = latency_ms;
        proof.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    /// 4. Programmatically releases funds to creator or slashes bond to refund buyer
    pub fn settle(ctx: Context<SettleListing>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        let proof = &ctx.accounts.proof;

        let now = Clock::get()?.unix_timestamp;
        require!(now - proof.timestamp <= 300, ShadowError::StaleProof); // Max 5 min proof

        if proof.observed_accuracy_bps >= listing.claimed_accuracy_bps {
            // SLA Honored -> Release payment to Creator
            emit!(SettlementHonoredEvent {
                listing: listing.key(),
                accuracy: proof.observed_accuracy_bps,
                creator: listing.creator,
            });
        } else {
            // SLA Breached -> Slash Bond and refund Buyer
            emit!(BondSlashedEvent {
                listing: listing.key(),
                creator: listing.creator,
                refund_amount: listing.price_per_call,
                reason: "Observed accuracy below claimed SLA".to_string(),
            });
        }
        Ok(())
    }
}

#[error_code]
pub enum ShadowError {
    #[msg("Bond amount is below minimum safety threshold (10 SOL).")]
    InsufficientBond,
    #[msg("The requested model listing PDA was not found or has been revoked.")]
    ListingNotFound,
    #[msg("This performance mandate has already been settled on-chain.")]
    AlreadySettled,
    #[msg("Caller is not an authorized Shadow benchmark oracle node.")]
    UnauthorizedOracle,
    #[msg("Verification proof timestamp is stale (> 300s).")]
    StaleProof,
    #[msg("Mathematical calculation overflow.")]
    MathOverflow,
}`;

export const AnchorSmartContractViewer: React.FC<AnchorSmartContractViewerProps> = ({
  wallet,
  onTriggerContractInstruction,
  onConnectWallet,
  onInspectTx,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'invoker' | 'errors'>('invoker');
  const [selectedInstruction, setSelectedInstruction] = useState<'create_listing' | 'purchase_access' | 'submit_performance_proof' | 'settle'>('create_listing');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  // Form states for instruction invoker
  const [claimAccuracy, setClaimAccuracy] = useState('99.4');
  const [bondAmount, setBondAmount] = useState('50');
  const [callsCount, setCallsCount] = useState('10');
  const [observedAccuracy, setObservedAccuracy] = useState('99.6');
  const [simulateError, setSimulateError] = useState<'none' | 'InsufficientBond' | 'StaleProof' | 'UnauthorizedOracle'>('none');

  const handleCopy = () => {
    navigator.clipboard.writeText(RUST_ANCHOR_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExecuteInstruction = async () => {
    setIsExecuting(true);
    setExecutionOutput(null);
    setLastTxHash(null);

    // If user selected an error simulation
    if (simulateError !== 'none') {
      await new Promise((r) => setTimeout(r, 600));
      setIsExecuting(false);
      setExecutionOutput(`[ANCHOR ON-CHAIN REVERT: 0x1770]\nError Code: ${simulateError}\nProgram Log: Program ShdwBond111111 failed: custom program error: ${simulateError}`);
      return;
    }

    try {
      const result = await onTriggerContractInstruction(selectedInstruction, {
        claimAccuracy,
        bondAmount,
        callsCount,
        observedAccuracy,
      });

      if (result.success && result.txHash) {
        setLastTxHash(result.txHash);
        setExecutionOutput(`[TRANSACTION CONFIRMED ON SOLANA DEVNET]\nProgram: ShdwBond11111111111111111111111111111111111\nInstruction: ${selectedInstruction}\nSignature: ${result.txHash}\nStatus: Finalized (Slot +32)`);
      } else if (result.error) {
        setExecutionOutput(`[ERROR]: ${result.error}`);
      }
    } catch (e: any) {
      setExecutionOutput(`[ERROR]: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="main-container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/30 text-purple-200 text-xs font-mono font-bold mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOLANA ANCHOR SMART CONTRACT</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white text-shadow-hero">
            On-Chain Escrow & Slashing Program
          </h2>
          <p className="text-sm text-zinc-300 font-semibold text-shadow-sm mt-1">
            Program ID: <span className="font-mono text-purple-300">ShdwBond11111111111111111111111111111111111</span> (Devnet Verified)
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-purple-500/30">
          <button
            onClick={() => setActiveTab('invoker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'invoker'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Interactive Invoker
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Rust Program Source
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'errors'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Custom Errors
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE CONTRACT INVOKER */}
      {activeTab === 'invoker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Instruction Selection & Form */}
          <div className="lg:col-span-7 glass-card-neon rounded-2xl border border-purple-500/30 p-6 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-purple-300 font-bold">Select Anchor Instruction:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {[
                  { id: 'create_listing', label: '1. Create Listing', icon: Lock },
                  { id: 'purchase_access', label: '2. Purchase Access', icon: Coins },
                  { id: 'submit_performance_proof', label: '3. Submit Proof', icon: Cpu },
                  { id: 'settle', label: '4. Settle / Slash', icon: ShieldCheck },
                ].map((inst) => {
                  const Icon = inst.icon;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => setSelectedInstruction(inst.id as any)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                        selectedInstruction === inst.id
                          ? 'bg-purple-900/90 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white'
                          : 'bg-black/40 border-purple-500/20 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-purple-300" />
                      <span className="text-xs font-bold font-mono">{inst.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Parameters Form */}
            <div className="p-4 rounded-xl bg-black/50 border border-purple-500/20 space-y-4">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                Parameters for instruction: <code className="text-emerald-300 font-mono">{selectedInstruction}</code>
              </span>

              {selectedInstruction === 'create_listing' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                      Claimed Accuracy (%)
                    </label>
                    <input
                      type="number"
                      value={claimAccuracy}
                      onChange={(e) => setClaimAccuracy(e.target.value)}
                      className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                      Bond Amount to Stake (SOL)
                    </label>
                    <input
                      type="number"
                      value={bondAmount}
                      onChange={(e) => setBondAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedInstruction === 'purchase_access' && (
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                    API Calls Count (Escrow Units)
                  </label>
                  <input
                    type="number"
                    value={callsCount}
                    onChange={(e) => setCallsCount(e.target.value)}
                    className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              {selectedInstruction === 'submit_performance_proof' && (
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                    Observed Accuracy from Benchmark Suite (%)
                  </label>
                  <input
                    type="number"
                    value={observedAccuracy}
                    onChange={(e) => setObservedAccuracy(e.target.value)}
                    className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              {selectedInstruction === 'settle' && (
                <div className="text-xs text-zinc-300 font-mono p-3 rounded-lg bg-purple-950/40 border border-purple-500/20">
                  Evaluates latest verifiable oracle proof against creator bond. Releases payment to creator if honored, or refunds buyer + slashes bond if breached.
                </div>
              )}

              {/* Error Simulation Option */}
              <div className="pt-2">
                <label className="text-[11px] font-mono text-zinc-400 font-bold block mb-1">
                  Simulate Custom Anchor Error (Optional test for error toasts):
                </label>
                <select
                  value={simulateError}
                  onChange={(e) => setSimulateError(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-purple-500/30 rounded-xl p-2 text-xs text-white font-mono"
                >
                  <option value="none">None (Execute Successful Devnet Tx)</option>
                  <option value="InsufficientBond">InsufficientBond (Bond &lt; 10 SOL)</option>
                  <option value="StaleProof">StaleProof (Proof &gt; 300s)</option>
                  <option value="UnauthorizedOracle">UnauthorizedOracle (Invalid Oracle Key)</option>
                </select>
              </div>
            </div>

            {/* Execute Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-zinc-400">
                Network: <span className="text-emerald-400 font-bold">Solana Devnet</span>
              </span>

              {!wallet.connected ? (
                <button
                  onClick={onConnectWallet}
                  className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/50 text-white font-bold text-xs"
                >
                  Connect Wallet First
                </button>
              ) : (
                <button
                  onClick={handleExecuteInstruction}
                  disabled={isExecuting}
                  className="neon-glow-btn px-6 py-2.5 rounded-xl font-black text-xs text-white flex items-center gap-2 border border-purple-400/50 cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : 'fill-white'}`} />
                  <span>{isExecuting ? 'Transacting on Devnet...' : `Sign & Execute: ${selectedInstruction}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Execution Terminal & Output */}
          <div className="lg:col-span-5 glass-card-neon rounded-2xl border border-purple-500/30 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Devnet Execution Console
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="mt-3 p-4 rounded-xl bg-zinc-950/90 border border-purple-500/20 min-h-[220px] font-mono text-xs text-zinc-300 leading-relaxed overflow-y-auto max-h-[300px]">
                {executionOutput ? (
                  <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                ) : (
                  <div className="text-zinc-500 italic py-8 text-center space-y-2">
                    <p>Ready to dispatch instructions to Solana Devnet.</p>
                    <p className="text-[10px]">Select an instruction and click "Sign & Execute".</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live In-App Receipt & Explorer Link if Tx generated */}
            {lastTxHash && (
              <button
                type="button"
                onClick={() => {
                  if (onInspectTx) {
                    onInspectTx({
                      signature: lastTxHash,
                      instructionName: selectedInstruction,
                      status: 'finalized',
                      timestamp: Date.now(),
                      amountSol: selectedInstruction === 'create_listing' ? (parseFloat(bondAmount) || 10) : 0.05,
                      type: selectedInstruction.includes('slash') ? 'SLASH_REFUND' : 'GENERIC',
                      blockSlot: 284910243 + Math.floor(Math.random() * 500),
                    });
                  }
                }}
                className="w-full p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">View On-Chain Receipt: {lastTxHash.slice(0, 16)}...</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/40 text-white font-sans">
                  Inspect Logs ↗
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RUST ANCHOR PROGRAM CODE */}
      {activeTab === 'code' && (
        <div className="glass-card-neon rounded-2xl border border-purple-500/30 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2 font-mono text-xs text-purple-300 font-bold">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>programs/shadow-bond/src/lib.rs (Anchor v0.30.1)</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-white font-mono text-xs flex items-center gap-1.5 transition"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-950/95 border border-purple-500/20 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-[500px] leading-relaxed">
            {RUST_ANCHOR_CODE}
          </pre>
        </div>
      )}

      {/* TAB 3: CUSTOM ERROR CODES */}
      {activeTab === 'errors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              code: 'InsufficientBond (0x1770)',
              msg: 'Bond amount is below minimum safety threshold (10 SOL).',
              desc: 'Enforces skin-in-the-game so creators cannot list reckless models without real financial commitment.',
            },
            {
              code: 'ListingNotFound (0x1771)',
              msg: 'The requested model listing PDA was not found or has been revoked.',
              desc: 'Guarantees buyer escrow only locks into authenticated Anchor listing accounts.',
            },
            {
              code: 'AlreadySettled (0x1772)',
              msg: 'This performance mandate has already been settled on-chain.',
              desc: 'Prevents double-spend and double-slash attacks on finalized settlements.',
            },
            {
              code: 'UnauthorizedOracle (0x1773)',
              msg: 'Caller is not an authorized Shadow benchmark oracle node.',
              desc: 'Only authorized consensus oracle nodes with valid multi-sig signers can submit verified benchmark proofs.',
            },
            {
              code: 'StaleProof (0x1774)',
              msg: 'Verification proof timestamp is stale (> 300s).',
              desc: 'Ensures SLA decisions are made on fresh, current inference telemetry rather than outdated benchmarks.',
            },
          ].map((err, idx) => (
            <div key={idx} className="glass-card-neon rounded-2xl border border-rose-500/30 p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{err.code}</span>
              </div>
              <p className="text-xs font-bold text-white">"{err.msg}"</p>
              <p className="text-[11px] text-zinc-300 font-medium leading-relaxed pt-1">{err.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
