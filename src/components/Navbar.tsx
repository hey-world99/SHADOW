import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Award,
  Radio,
  ExternalLink,
  ChevronDown,
  Droplets,
  CheckCircle2,
  Copy,
  Terminal,
  FileCode2,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react';
import { WalletState } from '../types';
import { UserProfile } from '../services/authService';
import { getAccountExplorerUrl } from '../services/solanaService';

interface NavbarProps {
  activeTab: 'overview' | 'marketplace' | 'contract' | 'creator' | 'leaderboard' | 'feed';
  setActiveTab: (tab: 'overview' | 'marketplace' | 'contract' | 'creator' | 'leaderboard' | 'feed') => void;
  wallet: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onRequestAirdrop: () => void;
  isAirdropping: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  onOpenHowItWorks: () => void;
  onOpenWhitepaper: () => void;
  onOpenListModel: () => void;
  onOpenRecommender?: () => void;
  onOpenChatbot?: () => void;
  showNavTabs?: boolean;
  onGoToLanding?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onConnectWallet,
  onDisconnectWallet,
  onRequestAirdrop,
  isAirdropping,
  demoMode,
  setDemoMode,
  onOpenHowItWorks,
  onOpenWhitepaper,
  onOpenListModel,
  onOpenRecommender,
  onOpenChatbot,
  showNavTabs = true,
  onGoToLanding,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const truncatedAddress = wallet.publicKey
    ? `${wallet.publicKey.slice(0, 4)}...${wallet.publicKey.slice(-4)}`
    : '';

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: Shield },
    { id: 'marketplace', label: 'MARKETPLACE', icon: Layers },
    { id: 'contract', label: 'ANCHOR CONTRACT', icon: Terminal },
    { id: 'creator', label: 'CREATOR HUB', icon: FileCode2 },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Award },
    { id: 'feed', label: 'TRUST FEED', icon: Radio },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-purple-500/30 bg-[#080314]/95 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      <div className="main-container py-3 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="nav-logo-btn"
            onClick={() => {
              if (onGoToLanding) {
                onGoToLanding();
              } else {
                setActiveTab('overview');
              }
            }}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center border-2 border-purple-400/70 shadow-[0_0_25px_rgba(168,85,247,0.7)] group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-white drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
                  SHADOW
                </span>
                <span className="text-[10px] font-black uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                  DEVNET
                </span>
              </div>
              <p className="text-[11px] font-bold tracking-tight text-purple-200 hidden sm:block leading-none mt-0.5">
                AI Performance Bonds
              </p>
            </div>
          </button>
        </div>

        {/* Center: High-Contrast Bold Navigation Bar */}
        {showNavTabs && (
          <nav className="hidden xl:flex items-center gap-1 bg-black/85 p-1 rounded-2xl border-2 border-purple-500/35 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] border border-purple-300/50 scale-[1.02]'
                      : 'text-zinc-200 hover:text-white hover:bg-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.id === 'contract' ? 'text-emerald-400' : item.id === 'leaderboard' ? 'text-amber-400' : item.id === 'feed' ? 'text-rose-400 animate-pulse' : 'text-purple-400'}`} />
                  <span className="font-extrabold">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Actions, User Profile & Wallet */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* User Auth Profile Pill / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border-2 border-purple-500/40 text-white shadow-md">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full border border-purple-300 object-cover"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-black leading-tight text-white max-w-[100px] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-mono font-bold text-purple-300">
                  {currentUser.email.split('@')[0]}
                </div>
              </div>
              <button
                id="nav-user-signout-btn"
                onClick={onSignOut}
                title="Sign out"
                className="p-1 rounded-md text-zinc-300 hover:text-rose-300 hover:bg-white/10 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-700" />
              <span>LOGIN</span>
            </button>
          )}

          {/* Model Recommender CTA Button */}
          {onOpenRecommender && (
            <button
              id="nav-model-recommender-btn"
              onClick={onOpenRecommender}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-950 hover:border-amber-400/80 text-amber-300 border-2 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition cursor-pointer whitespace-nowrap group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>AI RECOMMENDER</span>
            </button>
          )}

          {/* List Model CTA Button */}
          <button
            id="nav-list-model-btn"
            onClick={onOpenListModel}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white border-2 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition cursor-pointer whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>STAKE & LIST</span>
          </button>

          {/* Solana Wallet Pill */}
          <div className="relative">
            {!wallet.connected ? (
              <button
                id="connect-solana-wallet-btn"
                onClick={onConnectWallet}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.6)] border-2 border-purple-400/60 transition cursor-pointer whitespace-nowrap"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>CONNECT WALLET</span>
              </button>
            ) : (
              <button
                id="wallet-profile-dropdown-btn"
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950 via-indigo-950 to-black hover:border-purple-300 border-2 border-purple-500/50 text-white font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer whitespace-nowrap"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span className="font-extrabold text-white">{truncatedAddress}</span>
                <span className="bg-purple-900/90 text-emerald-300 px-1.5 py-0.5 rounded-md font-black border border-purple-400/50 text-[11px]">
                  {wallet.balanceSol.toFixed(2)} SOL
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-purple-300" />
              </button>
            )}

            {/* Wallet Dropdown Modal */}
            {wallet.connected && walletDropdownOpen && (
              <div
                id="wallet-dropdown-menu"
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-950/95 border-2 border-purple-500/50 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 text-white"
              >
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-purple-400 font-black tracking-wider">Connected Account</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-xs font-black text-white">{truncatedAddress}</span>
                      <button
                        onClick={handleCopyAddress}
                        className="p-1 hover:bg-white/10 rounded text-zinc-300 hover:text-white transition"
                        title="Copy full public key"
                      >
                        {copiedAddress ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <a
                    href={getAccountExplorerUrl(wallet.publicKey || '')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-300 hover:text-purple-100 flex items-center gap-1 font-bold"
                  >
                    Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Balance & Airdrop */}
                <div className="my-3 p-3 rounded-xl bg-purple-900/30 border border-purple-500/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-300 font-bold">Devnet Balance</span>
                      <div className="text-xl font-mono font-black text-white text-shadow-sm">
                        {wallet.balanceSol.toFixed(4)} <span className="text-xs text-purple-300">SOL</span>
                      </div>
                    </div>
                    <button
                      id="faucet-airdrop-btn"
                      onClick={onRequestAirdrop}
                      disabled={isAirdropping}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition"
                    >
                      <Droplets className={`w-4 h-4 ${isAirdropping ? 'animate-spin' : ''}`} />
                      {isAirdropping ? 'Airdropping...' : '+1 SOL Faucet'}
                    </button>
                  </div>
                </div>

                {/* Disconnect */}
                <button
                  id="disconnect-wallet-btn"
                  onClick={() => {
                    onDisconnectWallet();
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Nav Row with Bold Typography */}
      {showNavTabs && (
        <div className="xl:hidden flex items-center justify-around px-2 pt-2 border-t border-purple-500/25 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-[11px] font-black tracking-wider uppercase rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md border border-purple-400/50'
                    : 'text-zinc-300 hover:text-white bg-black/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
