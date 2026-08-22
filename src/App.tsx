import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ModelMarketplace } from './components/ModelMarketplace';
import { AnchorSmartContractViewer } from './components/AnchorSmartContractViewer';
import { CreatorDashboard } from './components/CreatorDashboard';
import { BondLeaderboard } from './components/BondLeaderboard';
import { TrustFeedView } from './components/TrustFeedView';
import { ModelDetailModal } from './components/ModelDetailModal';
import { ListModelModal } from './components/ListModelModal';
import { DeploymentSnippetModal } from './components/DeploymentSnippetModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { WhitepaperModal } from './components/WhitepaperModal';
import { AuthModal } from './components/AuthModal';
import { TransactionReceiptModal, TxDetailData } from './components/TransactionReceiptModal';
import { ShadowChatbot } from './components/ShadowChatbot';
import { ModelRecommenderModal } from './components/ModelRecommenderModal';
import { authService, UserProfile } from './services/authService';
import { INITIAL_MODELS, INITIAL_LEADERBOARD, INITIAL_SETTLEMENTS } from './data/mockModels';
import { AIModel, LeaderboardEntry, SettlementEvent, WalletState } from './types';
import {
  connectDevnetWallet,
  requestDevnetAirdrop,
  executeSolanaDevnetTransaction,
  getDevnetBalance,
  generateDevnetTxHash,
  getSolanaExplorerUrl,
} from './services/solanaService';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'slash' | 'info';
  title: string;
  message: string;
  txHash?: string;
}

export function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'contract' | 'creator' | 'leaderboard' | 'feed'>('overview');

  // Wallet state
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balanceSol: 0,
    network: 'devnet',
    isPhantom: false,
    transactions: [],
  });
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Data collections
  const [models, setModels] = useState<AIModel[]>(INITIAL_MODELS);
  const [settlements, setSettlements] = useState<SettlementEvent[]>(INITIAL_SETTLEMENTS);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Modals
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isListModelOpen, setIsListModelOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState<boolean>(false);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState<boolean>(false);
  const [deploymentModalState, setDeploymentModalState] = useState<{ model: AIModel; txHash: string } | null>(null);
  const [inspectedTx, setInspectedTx] = useState<TxDetailData | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Connect Wallet
  const handleConnectWallet = async () => {
    try {
      const state = await connectDevnetWallet();
      setWallet(state);
      addToast({
        type: 'success',
        title: state.isPhantom ? 'Phantom Wallet Connected (Devnet)' : 'Solana Devnet Wallet Active',
        message: `Connected ${state.publicKey?.slice(0, 4)}...${state.publicKey?.slice(-4)} with ${state.balanceSol.toFixed(2)} SOL`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Wallet Connection Failed',
        message: err.message || 'Could not connect to Solana wallet.',
      });
    }
  };

  // Sync real on-chain balance periodically when connected
  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey || !wallet.isPhantom) return;

    const interval = setInterval(async () => {
      try {
        const liveBalance = await getDevnetBalance(wallet.publicKey!);
        setWallet((prev) => {
          if (prev.balanceSol !== liveBalance) {
            return { ...prev, balanceSol: liveBalance };
          }
          return prev;
        });
      } catch (err) {
        // quiet fallback
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [wallet.connected, wallet.publicKey, wallet.isPhantom]);

  // Disconnect Wallet
  const handleDisconnectWallet = () => {
    setWallet({
      connected: false,
      publicKey: null,
      balanceSol: 0,
      network: 'devnet',
      isPhantom: false,
      transactions: [],
    });
    addToast({
      type: 'info',
      title: 'Wallet Disconnected',
      message: 'Your Solana wallet session was cleared.',
    });
  };

  // Faucet Airdrop
  const handleRequestAirdrop = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      handleConnectWallet();
      return;
    }
    setIsAirdropping(true);
    try {
      const result = await requestDevnetAirdrop(wallet.publicKey, 1);
      setWallet((prev) => ({
        ...prev,
        balanceSol: result.newBalance !== undefined ? result.newBalance : prev.balanceSol + 1,
        transactions: [
          {
            signature: result.txHash,
            timestamp: Date.now(),
            description: 'Devnet Faucet Airdrop (+1 SOL)',
            type: 'AIRDROP',
            amountSol: 1,
            status: 'confirmed',
            explorerUrl: result.explorerUrl,
          },
          ...prev.transactions,
        ],
      }));
      addToast({
        type: 'success',
        title: 'Airdrop Confirmed on Devnet (+1 SOL)',
        message: '1 SOL has been credited to your Devnet wallet address.',
        txHash: result.txHash,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Airdrop Error',
        message: err.message || 'Faucet temporarily rate-limited on Devnet.',
      });
    } finally {
      setIsAirdropping(false);
    }
  };

  // Buy Access Flow (Escrow Locking)
  const handleBuyAccess = async (model: AIModel) => {
    if (!wallet.connected || !wallet.publicKey) {
      await handleConnectWallet();
      return;
    }

    if (wallet.balanceSol < model.pricePerCallSol) {
      addToast({
        type: 'error',
        title: 'Insufficient Devnet SOL',
        message: `You need at least ${model.pricePerCallSol} SOL. Use the Faucet button to get +1 SOL.`,
      });
      return;
    }

    setIsPurchasing(true);

    try {
      // Real or Simulated Solana Devnet Transaction
      const txResult = await executeSolanaDevnetTransaction({
        amountSol: model.pricePerCallSol,
        recipientAddress: model.contractPda || 'ShdwBond11111111111111111111111111111111111',
      });

      const txHash = txResult.signature;

      setWallet((prev) => ({
        ...prev,
        balanceSol: txResult.updatedBalance !== -1 ? txResult.updatedBalance : Math.max(0, prev.balanceSol - model.pricePerCallSol),
        transactions: [
          {
            signature: txHash,
            timestamp: Date.now(),
            description: `Locked Escrow: Access ${model.name}`,
            type: 'PURCHASE',
            amountSol: -model.pricePerCallSol,
            status: 'confirmed',
            explorerUrl: txResult.explorerUrl,
          },
          ...prev.transactions,
        ],
      }));

      setIsPurchasing(false);
      setSelectedModelId(null);
      setDeploymentModalState({ model, txHash });

      addToast({
        type: 'success',
        title: txResult.isRealOnChain ? 'On-Chain Devnet Escrow Confirmed' : 'Bond-Backed Access Granted',
        message: `${model.pricePerCallSol} SOL locked in Escrow PDA for ${model.name}.`,
        txHash,
      });
    } catch (err: any) {
      console.error('Purchase / Escrow failed:', err);
      setIsPurchasing(false);
      addToast({
        type: 'error',
        title: 'Transaction Cancelled or Failed',
        message: err.message || 'Could not complete Devnet transaction.',
      });
    }
  };

  // Model Created / Listed
  const handleModelCreated = (newModel: AIModel, txHash: string, updatedBalance?: number) => {
    setModels((prev) => [newModel, ...prev]);
    setWallet((prev) => ({
      ...prev,
      balanceSol: updatedBalance !== undefined && updatedBalance !== -1 ? updatedBalance : Math.max(0, prev.balanceSol - newModel.bondAmountSol),
      transactions: [
        {
          signature: txHash,
          timestamp: Date.now(),
          description: `Staked Bond: ${newModel.name}`,
          type: 'BOND_STAKE',
          amountSol: -newModel.bondAmountSol,
          status: 'confirmed',
          explorerUrl: getSolanaExplorerUrl(txHash),
        },
        ...prev.transactions,
      ],
    }));

    setIsListModelOpen(false);
    setSelectedModelId(newModel.id);

    addToast({
      type: 'success',
      title: 'Model Bond Staked on Devnet',
      message: `${newModel.name} is now listed with ${newModel.bondAmountSol} SOL bonded collateral!`,
      txHash,
    });
  };

  // Trigger Contract Instruction from Anchor Viewer
  const handleTriggerContractInstruction = async (
    instructionName: string,
    params: Record<string, any>
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    if (!wallet.connected) {
      return { success: false, error: 'Please connect your Solana wallet first.' };
    }

    const cost = instructionName === 'create_listing' ? parseFloat(params.bondAmount) || 10 : 0.05;

    try {
      const txResult = await executeSolanaDevnetTransaction({
        amountSol: cost,
        recipientAddress: 'ShdwBond11111111111111111111111111111111111',
      });

      const txHash = txResult.signature;

      setWallet((prev) => ({
        ...prev,
        balanceSol: txResult.updatedBalance !== -1 ? txResult.updatedBalance : Math.max(0, prev.balanceSol - cost),
        transactions: [
          {
            signature: txHash,
            timestamp: Date.now(),
            description: `Anchor: ${instructionName}`,
            type: instructionName === 'create_listing' ? 'BOND_STAKE' : 'SETTLE',
            amountSol: -cost,
            status: 'confirmed',
            explorerUrl: txResult.explorerUrl,
          },
          ...prev.transactions,
        ],
      }));

      addToast({
        type: 'success',
        title: `Anchor Instruction Executed`,
        message: `Signed and confirmed instruction '${instructionName}' on Devnet.`,
        txHash,
      });

      return { success: true, txHash };
    } catch (err: any) {
      return { success: false, error: err.message || 'Transaction failed or rejected.' };
    }
  };

  // Simulated Live Settlement Stream (Demo Mode)
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      if (models.length === 0) return;
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const isHonored = Math.random() > 0.25; // 75% honored, 25% slash
      const txHash = generateDevnetTxHash();

      const newEvent: SettlementEvent = {
        id: `settle-${Date.now()}`,
        timestamp: Date.now(),
        modelId: randomModel.id,
        modelName: randomModel.name,
        type: isHonored ? 'HONOR' : 'SLASH',
        bondAmount: randomModel.bondAmountSol,
        claimedAccuracy: randomModel.claimedAccuracy,
        actualAccuracy: isHonored
          ? Number((randomModel.claimedAccuracy + (Math.random() * 0.4 - 0.2)).toFixed(1))
          : Number((randomModel.claimedAccuracy - (Math.random() * 8 + 3)).toFixed(1)),
        refundAmount: isHonored ? undefined : randomModel.pricePerCallSol,
        reason: isHonored
          ? 'Passed oracle benchmark suite SLA'
          : 'Observed accuracy dropped below minimum SLA threshold',
        txHash,
      };

      setSettlements((prev) => [newEvent, ...prev.slice(0, 4)]);

      // Update model stats
      setModels((prev) =>
        prev.map((m) => {
          if (m.id === randomModel.id) {
            return {
              ...m,
              settlementsCount: m.settlementsCount + 1,
              slashesCount: isHonored ? m.slashesCount : m.slashesCount + 1,
              settlementHistory: [newEvent, ...m.settlementHistory.slice(0, 19)],
            };
          }
          return m;
        })
      );

      // Only toast slashes occasionally in demo mode for dramatic effect
      if (!isHonored && Math.random() > 0.5) {
        addToast({
          type: 'slash',
          title: `Bond Slashed: ${randomModel.name}`,
          message: `Oracle detected accuracy violation (${newEvent.actualAccuracy}% vs claimed ${newEvent.claimedAccuracy}%). Buyer refunded instantly.`,
          txHash,
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [demoMode, models, addToast]);

  const selectedModel = useMemo(() => {
    return models.find((m) => m.id === selectedModelId) || null;
  }, [models, selectedModelId]);

  const totalBondedSol = useMemo(() => {
    return models.reduce((acc, m) => acc + m.bondAmountSol, 0);
  }, [models]);

  const leaderboardEntries = useMemo(() => {
    return models.map((m, index) => {
      const honoredCount = m.settlementsCount - m.slashesCount;
      return {
        rank: index + 1,
        modelId: m.id,
        modelName: m.name,
        creatorName: m.creator.name,
        creatorAddress: m.creator.address,
        totalBondStakedSol: m.bondAmountSol,
        trustScore: m.currentTrustScore ?? 80,
        honoredCount: Math.max(0, honoredCount),
        slashedCount: m.slashesCount,
        totalSettlements: m.settlementsCount,
        consecutiveStreak: m.creator.honoredStreak,
      };
    });
  }, [models]);

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      {/* Background Video */}
      <BackgroundVideo />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setViewMode('app');
            setActiveTab(tab);
          }}
          wallet={wallet}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          onRequestAirdrop={handleRequestAirdrop}
          isAirdropping={isAirdropping}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
          onOpenListModel={() => setIsListModelOpen(true)}
          onOpenRecommender={() => setIsRecommenderOpen(true)}
          showNavTabs={viewMode === 'app'}
          onGoToLanding={() => setViewMode('landing')}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={() => {
            authService.clearUser();
            setCurrentUser(null);
            addToast({
              type: 'info',
              title: 'Signed Out',
              message: 'You have been signed out of Shadow Protocol.',
            });
          }}
        />

        {/* View Router */}
        <main className="flex-1">
          {viewMode === 'landing' ? (
            <LandingHero
              currentUser={currentUser}
              onGetStarted={() => {
                setViewMode('app');
                setActiveTab('overview');
              }}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenProtocolSpec={() => setIsHowItWorksOpen(true)}
              onOpenRecommender={() => setIsRecommenderOpen(true)}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewDashboard
                  onExploreMarketplace={() => setActiveTab('marketplace')}
                  onOpenContract={() => setActiveTab('contract')}
                  onOpenCreatorHub={() => setActiveTab('creator')}
                  onOpenLeaderboard={() => setActiveTab('leaderboard')}
                  onOpenTrustFeed={() => setActiveTab('feed')}
                  onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                  onOpenListModel={() => setIsListModelOpen(true)}
                  onOpenRecommender={() => setIsRecommenderOpen(true)}
                  onSelectModel={(id) => setSelectedModelId(id)}
                  recentSettlements={settlements.slice(0, 10)}
                  totalBondedSol={totalBondedSol}
                  models={models}
                />
              )}

              {activeTab === 'marketplace' && (
                <ModelMarketplace
                  models={models}
                  onSelectModel={(id) => setSelectedModelId(id)}
                  onOpenSandbox={(id) => {
                    setSelectedModelId(id);
                  }}
                  onOpenListModel={() => setIsListModelOpen(true)}
                />
              )}

              {activeTab === 'contract' && (
                <AnchorSmartContractViewer
                  wallet={wallet}
                  onTriggerContractInstruction={handleTriggerContractInstruction}
                  onConnectWallet={handleConnectWallet}
                  onInspectTx={(data) => setInspectedTx(data)}
                />
              )}

              {activeTab === 'creator' && (
                <CreatorDashboard
                  wallet={wallet}
                  models={models}
                  onOpenListModel={() => setIsListModelOpen(true)}
                  onConnectWallet={handleConnectWallet}
                  onRequestAirdrop={handleRequestAirdrop}
                  onSelectModel={(id) => setSelectedModelId(id)}
                />
              )}

              {activeTab === 'leaderboard' && (
                <BondLeaderboard
                  entries={leaderboardEntries}
                  onSelectModel={(id) => setSelectedModelId(id)}
                />
              )}

              {activeTab === 'feed' && (
                <TrustFeedView
                  settlements={settlements}
                  onSelectModel={(id) => setSelectedModelId(id)}
                  demoMode={demoMode}
                  setDemoMode={setDemoMode}
                  onInspectTx={(data) => setInspectedTx(data)}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-purple-500/25 bg-black/70 backdrop-blur-xl py-6 text-xs">
          <div className="main-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-[0_0_10px_#a855f7]">
                S
              </div>
              <span className="font-heading font-black text-white text-sm tracking-wider">SHADOW PROTOCOL</span>
              <span className="text-zinc-400">&bull;</span>
              <span className="text-zinc-400 font-medium">"Don’t rate the model. Bet on it."</span>
            </div>

            <div className="flex items-center gap-4 text-purple-300 font-mono text-[11px]">
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="hover:text-white transition"
              >
                How It Works
              </button>
              <span>&bull;</span>
              <button
                onClick={() => setIsWhitepaperOpen(true)}
                className="hover:text-white transition"
              >
                Whitepaper
              </button>
              <span>&bull;</span>
              <a
                href="https://explorer.solana.com/?cluster=devnet"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <span>Solana Devnet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      {/* 1. Model Detail & Sandbox Modal */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModelId(null)}
          wallet={wallet}
          onBuyAccess={handleBuyAccess}
          onConnectWallet={handleConnectWallet}
          onRequestAirdrop={handleRequestAirdrop}
          isPurchasing={isPurchasing}
          onInspectTx={(data) => setInspectedTx(data)}
        />
      )}

      {/* 2. List Model & Stake Bond Modal */}
      {isListModelOpen && (
        <ListModelModal
          onClose={() => setIsListModelOpen(false)}
          wallet={wallet}
          onConnectWallet={handleConnectWallet}
          onRequestAirdrop={handleRequestAirdrop}
          isAirdropping={isAirdropping}
          onModelCreated={handleModelCreated}
        />
      )}

      {/* 3. Deployment Code Snippet Modal */}
      {deploymentModalState && (
        <DeploymentSnippetModal
          model={deploymentModalState.model}
          txHash={deploymentModalState.txHash}
          onClose={() => setDeploymentModalState(null)}
        />
      )}

      {/* 4. How It Works Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onExploreMarketplace={() => {
            setIsHowItWorksOpen(false);
            setActiveTab('marketplace');
          }}
        />
      )}

      {/* 5. Whitepaper Modal */}
      {isWhitepaperOpen && (
        <WhitepaperModal onClose={() => setIsWhitepaperOpen(false)} />
      )}

      {/* 6. Secure User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userEmailDefault="pbendre542@gmail.com"
        onSuccess={(user) => {
          setCurrentUser(user);
          setViewMode('app');
          setActiveTab('overview');
          addToast({
            type: 'success',
            title: `Welcome, ${user.name}!`,
            message: `Authenticated successfully with ${user.authProvider === 'google' ? 'Google Account' : 'Email'}.`,
          });
        }}
      />

      {/* 7. In-App Solana On-Chain Transaction Inspector */}
      {inspectedTx && (
        <TransactionReceiptModal
          isOpen={Boolean(inspectedTx)}
          onClose={() => setInspectedTx(null)}
          txData={inspectedTx}
        />
      )}

      {/* 8. Intelligent AI Model Recommender Modal */}
      <ModelRecommenderModal
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        models={models}
        onSelectModel={(model, initialPrompt) => {
          setViewMode('app');
          setSelectedModelId(model.id);
        }}
        onBuyAccess={(model) => {
          setViewMode('app');
          handleBuyAccess(model);
        }}
      />

      {/* 9. AI Assistant: "Shadow is speaking" */}
      <ShadowChatbot
        onOpenRecommender={() => setIsRecommenderOpen(true)}
        onOpenMarketplace={() => {
          setViewMode('app');
          setActiveTab('marketplace');
        }}
        onOpenContract={() => {
          setViewMode('app');
          setActiveTab('contract');
        }}
        onRequestAirdrop={handleRequestAirdrop}
        onSelectModel={(id) => {
          setViewMode('app');
          setSelectedModelId(id);
        }}
        models={models}
        walletConnected={wallet.connected}
        onConnectWallet={handleConnectWallet}
      />

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-start justify-between gap-3 text-xs transition-all animate-bounce-short ${
              toast.type === 'slash'
                ? 'bg-rose-950/90 border-rose-500/70 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                : toast.type === 'success'
                ? 'bg-purple-950/90 border-purple-400/70 text-purple-100 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/70 text-red-100'
                : 'bg-zinc-950/90 border-zinc-700 text-zinc-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'slash' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : toast.type === 'success' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1">
                <p className="font-heading font-extrabold text-white text-sm">{toast.title}</p>
                <p className="text-xs leading-relaxed opacity-90">{toast.message}</p>
                {toast.txHash && (
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedTx({
                        signature: toast.txHash!,
                        status: 'finalized',
                        timestamp: Date.now(),
                        type: toast.type === 'slash' ? 'SLASH_REFUND' : 'GENERIC',
                        blockSlot: 284910243 + Math.floor(Math.random() * 500),
                      });
                    }}
                    className="text-[10px] font-mono text-purple-300 hover:text-white flex items-center gap-1 font-bold pt-1 cursor-pointer"
                  >
                    <span>Inspect On-Chain Receipt: {toast.txHash.slice(0, 10)}...</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
