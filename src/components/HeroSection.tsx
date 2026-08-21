import React, { useState, useEffect } from 'react';
import {
  Rocket,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  Scale,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Play,
  Layers,
} from 'lucide-react';
import { SettlementEvent } from '../types';
import { getSolanaExplorerUrl } from '../services/solanaService';

interface HeroSectionProps {
  onExploreMarketplace: () => void;
  onOpenListModel: () => void;
  onOpenHowItWorks: () => void;
  onSelectModel: (modelId: string) => void;
  recentSettlements: SettlementEvent[];
  totalBondedSol: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMarketplace,
  onOpenListModel,
  onOpenHowItWorks,
  onSelectModel,
  recentSettlements,
  totalBondedSol,
}) => {
  const [activeStep, setActiveStep] = useState<'stake' | 'test' | 'settle'>('stake');
  const [liveVolume, setLiveVolume] = useState<number>(4820000);

  // Subtle real-time fluctuation in protected volume
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVolume((prev) => prev + Math.floor(Math.random() * 250 - 50));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-4 pb-16">
      {/* Hero Visual Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand, Tagline, & CTAs (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Brand Logo Box & Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-950 flex items-center justify-center border-2 border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.8)] relative group">
                <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-md animate-pulse-slow" />
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white fill-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                >
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14.1c-3.13-1-5.75-4.28-5.97-8.1 1.7-.8 3.75-1.25 5.97-1.25s4.27.45 5.97 1.25c-.22 3.82-2.84 7.1-5.97 8.1z" />
                </svg>
              </div>
              <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                SHADOW
              </h1>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Don’t rate the model.
              </h2>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                Bet on it.
              </h2>
            </div>

            {/* Micro 3-Step Indicator Bar (STAKE • TEST • SETTLE) */}
            <div className="w-full max-w-sm pt-1">
              <div className="h-1.5 w-full bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-300 transition-all duration-700 shadow-[0_0_12px_#a855f7]"
                  style={{
                    width: activeStep === 'stake' ? '33%' : activeStep === 'test' ? '66%' : '100%',
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-extrabold uppercase tracking-widest text-purple-300 mt-2.5">
                <button
                  onClick={() => setActiveStep('stake')}
                  className={`hover:text-white transition flex items-center gap-1.5 ${
                    activeStep === 'stake' ? 'text-white font-black drop-shadow-[0_0_8px_#c084fc]' : 'text-purple-400/70'
                  }`}
                >
                  <span>STAKE</span>
                </button>
                <span className="text-purple-400 text-base leading-none">&bull;</span>
                <button
                  onClick={() => setActiveStep('test')}
                  className={`hover:text-white transition flex items-center gap-1.5 ${
                    activeStep === 'test' ? 'text-white font-black drop-shadow-[0_0_8px_#c084fc]' : 'text-purple-400/70'
                  }`}
                >
                  <span>TEST</span>
                </button>
                <span className="text-purple-400 text-base leading-none">&bull;</span>
                <button
                  onClick={() => setActiveStep('settle')}
                  className={`hover:text-white transition flex items-center gap-1.5 ${
                    activeStep === 'settle' ? 'text-white font-black drop-shadow-[0_0_8px_#c084fc]' : 'text-purple-400/70'
                  }`}
                >
                  <span>SETTLE</span>
                </button>
              </div>
            </div>

            {/* Hero CTA Button: Get Started & How It Works */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-get-started-btn"
                onClick={() => {
                  const el = document.getElementById('marketplace-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onExploreMarketplace();
                  }
                }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-bold text-base border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:shadow-[0_0_50px_rgba(168,85,247,0.9)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="w-4 h-4 text-purple-200" />
                </div>
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-purple-200" />
              </button>

              <button
                id="hero-view-protocol-btn"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 hover:text-white text-sm font-bold backdrop-blur-md transition-all shadow-[0_0_15px_rgba(147,51,234,0.2)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Protocol Spec</span>
              </button>
            </div>

            {/* Pill Features List */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-purple-200">
              <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 backdrop-blur-md">
                On-Chain Performance Bonds
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 backdrop-blur-md">
                Real-Time Settlements
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 backdrop-blur-md">
                Trustless. Transparent. Verifiable.
              </span>
            </div>
          </div>

          {/* Right Column: Mysterious Hooded Shadow Character (Cols 8-12) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-80 sm:w-96 h-[420px] flex items-center justify-center">
              {/* Ambient purple backlight aura */}
              <div className="absolute inset-0 rounded-full bg-purple-600/35 blur-3xl animate-pulse-slow pointer-events-none" />
              <div className="absolute inset-x-8 top-16 bottom-8 bg-fuchsia-600/20 blur-2xl pointer-events-none" />

              {/* Shadow Figure Hooded Robe Graphic Container */}
              <div className="relative w-full h-full flex flex-col items-center justify-center animate-float">
                {/* SVG Silhouette of the Shadow Character matching Cosmic Robed Figure */}
                <svg
                  viewBox="0 0 340 420"
                  className="w-full h-full drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                >
                  <defs>
                    <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="35%" stopColor="#cbd5e1" />
                      <stop offset="70%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="innerVoidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#020105" />
                      <stop offset="40%" stopColor="#0a0418" />
                      <stop offset="85%" stopColor="#2e0854" />
                      <stop offset="100%" stopColor="#4c1d95" />
                    </linearGradient>
                    <radialGradient id="nebulaBurst" cx="50%" cy="60%" r="55%">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
                      <stop offset="30%" stopColor="#c084fc" stopOpacity="0.75" />
                      <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#05020c" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="50%" stopColor="#e9d5ff" stopOpacity="0.9" />
                      <stop offset="80%" stopColor="#c084fc" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="chromeHandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e1b4b" />
                      <stop offset="40%" stopColor="#0f172a" />
                      <stop offset="70%" stopColor="#312e81" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                  </defs>

                  {/* Outer Draped Robe Cowl and Body */}
                  <path
                    d="M170 25 C120 25 78 70 65 145 C52 225 35 330 25 395 L315 395 C305 330 288 225 275 145 C262 70 220 25 170 25 Z"
                    fill="url(#robeGrad)"
                    stroke="rgba(241, 245, 249, 0.6)"
                    strokeWidth="2.5"
                  />

                  {/* Deep Cosmic Void Face / Hood Cavity */}
                  <path
                    d="M170 50 C125 50 102 85 96 142 C90 205 95 260 170 272 C245 260 250 205 244 142 C238 85 215 50 170 50 Z"
                    fill="url(#innerVoidGrad)"
                    stroke="#f3e8ff"
                    strokeWidth="3.5"
                    className="drop-shadow-[0_0_20px_#c084fc]"
                  />

                  {/* Swirling Nebula Light inside the Hood Cavity */}
                  <ellipse cx="170" cy="180" rx="60" ry="70" fill="url(#nebulaBurst)" />

                  {/* Stardust Cluster inside Void */}
                  <circle cx="145" cy="85" r="1.8" fill="#ffffff" />
                  <circle cx="195" cy="80" r="1.5" fill="#ffffff" />
                  <circle cx="170" cy="110" r="2.4" fill="#ffffff" className="animate-pulse" />
                  <circle cx="132" cy="140" r="1.6" fill="#fbcfe8" />
                  <circle cx="208" cy="145" r="2" fill="#e9d5ff" />
                  <circle cx="155" cy="165" r="1.4" fill="#ffffff" />
                  <circle cx="185" cy="185" r="1.8" fill="#ffffff" />
                  <circle cx="138" cy="205" r="1.2" fill="#f472b6" />
                  <circle cx="200" cy="215" r="1.5" fill="#e9d5ff" />

                  {/* Constellation lines */}
                  <line x1="145" y1="85" x2="170" y2="110" stroke="rgba(244, 114, 182, 0.6)" strokeWidth="1" />
                  <line x1="195" y1="80" x2="170" y2="110" stroke="rgba(244, 114, 182, 0.6)" strokeWidth="1" />
                  <line x1="170" y1="110" x2="208" y2="145" stroke="rgba(192, 132, 252, 0.6)" strokeWidth="1" />
                  <line x1="170" y1="110" x2="132" y2="140" stroke="rgba(192, 132, 252, 0.6)" strokeWidth="1" />
                  <line x1="132" y1="140" x2="155" y2="165" stroke="rgba(233, 213, 255, 0.5)" strokeWidth="0.8" />
                  <line x1="208" y1="145" x2="185" y2="185" stroke="rgba(233, 213, 255, 0.5)" strokeWidth="0.8" />

                  {/* Radiant Nexus Star at Core of the Void */}
                  <circle cx="170" cy="235" r="16" fill="url(#starGlow)" />
                  <path
                    d="M170 220 L173 232 L185 235 L173 238 L170 250 L167 238 L155 235 L167 232 Z"
                    fill="#ffffff"
                    className="drop-shadow-[0_0_10px_#ffffff]"
                  />

                  {/* Left Celestial Raised Hand (Obsidian / Chrome with violet rim light) */}
                  <g transform="translate(100, 240) rotate(-15)">
                    {/* Palm & Fingers */}
                    <path
                      d="M10 60 C15 40 22 25 28 8 C30 2 35 4 33 12 C30 28 26 45 22 62 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M18 62 C26 42 36 22 44 2 C47 -2 52 0 49 8 C43 26 35 48 29 65 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#e9d5ff"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M26 65 C36 46 48 28 58 10 C61 5 66 8 63 15 C55 32 44 52 36 68 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M34 68 C45 52 56 38 66 22 C69 18 73 21 70 27 C61 42 50 60 41 72 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#a855f7"
                      strokeWidth="1"
                    />
                    {/* Palm base */}
                    <path
                      d="M8 65 C12 85 24 95 38 90 C48 82 44 68 36 65 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                  </g>

                  {/* Right Celestial Raised Hand (Obsidian / Chrome with violet rim light) */}
                  <g transform="translate(180, 215) rotate(15)">
                    {/* Fingers & Palm */}
                    <path
                      d="M50 60 C45 40 38 25 32 8 C30 2 25 4 27 12 C30 28 34 45 38 62 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M42 62 C34 42 24 22 16 2 C13 -2 8 0 11 8 C17 26 25 48 31 65 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#e9d5ff"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M34 65 C24 46 12 28 2 10 C-1 5 -6 8 -3 15 C5 32 16 52 24 68 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M26 68 C15 52 4 38 -6 22 C-9 18 -13 21 -10 27 C-1 42 10 60 19 72 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#a855f7"
                      strokeWidth="1"
                    />
                    {/* Palm base */}
                    <path
                      d="M52 65 C48 85 36 95 22 90 C12 82 16 68 24 65 Z"
                      fill="url(#chromeHandGrad)"
                      stroke="#c084fc"
                      strokeWidth="1.2"
                    />
                  </g>

                  {/* Mantle Folds & Flowing Fabric */}
                  <path
                    d="M170 280 L162 410"
                    stroke="rgba(148, 163, 184, 0.4)"
                    strokeWidth="2"
                  />
                  <path
                    d="M170 280 L180 410"
                    stroke="rgba(148, 163, 184, 0.3)"
                    strokeWidth="2"
                  />
                  <path
                    d="M110 320 Q140 340 170 345 Q200 340 230 320"
                    fill="none"
                    stroke="rgba(203, 213, 225, 0.3)"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Micro Verified Badge at base */}
                <div className="absolute bottom-2 px-3.5 py-1 rounded-full bg-black/85 border border-purple-400/50 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="text-[11px] font-mono font-black text-purple-200 tracking-wider">
                    SHADOW PROTOCOL PDA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Trust Feed Ticker Bar */}
      <section className="w-full bg-black/70 border-y border-purple-500/30 py-3 backdrop-blur-xl mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold shrink-0">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>LIVE TRUST FEED</span>
          </div>

          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar py-1">
            {recentSettlements.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectModel(item.modelId)}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/25 text-xs text-zinc-200 cursor-pointer transition shrink-0 group"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === 'HONOR' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  }`}
                />
                <span className="font-bold text-white group-hover:text-purple-300 transition">
                  {item.modelName}
                </span>
                <span
                  className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    item.type === 'HONOR'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {item.type === 'HONOR' ? `Honored: +${item.bondAmount} SOL` : `Slashed: Refunded ${item.refundAmount} SOL`}
                </span>
                <span className="text-zinc-400 text-[11px] font-mono">
                  {item.actualAccuracy}% acc
                </span>
                <a
                  href={getSolanaExplorerUrl(item.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-purple-400 hover:text-purple-200 p-0.5"
                  title="View on Solana Devnet Explorer"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Metrics Dashboard Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Metric 1 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              PROTECTED VOLUME
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                ${(liveVolume / 1000000).toFixed(2)}M+
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>&uarr; 24% this week</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">On-chain bonded collateral</span>
          </div>

          {/* Metric 2 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              ACTIVE MANDATES
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                1,842
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>100% Escrow Backed</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">On-chain devnet rules</span>
          </div>

          {/* Metric 3 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              AI AUDIT SPEED
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                1.2s
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold mt-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Sub-second proof verification</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Streaming score latency</span>
          </div>

          {/* Metric 4 */}
          <div className="glass-card-neon p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300/80 font-bold">
              JURY ACCURACY
            </span>
            <div className="my-2">
              <div className="font-heading text-2xl sm:text-4xl font-black text-white text-shadow-hero">
                99.4%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3-Persona Consensus</span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Zero false slashing events</span>
          </div>
        </div>
      </section>

      {/* 4 Step Architecture Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold mb-3">
            <span>ON-CHAIN AGENT ACCOUNTABILITY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white text-shadow-hero">
            How Shadow Guarantees AI Model Accountability
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-2 font-semibold text-shadow-sm">
            Autonomous inference needs programmable boundaries, live AI audits, and real-time claim settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                01
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Collateral Escrow Lock
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Founders and AI operators deposit native SOL into an escrow mandate on Solana Devnet before opening agent access.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-purple-300 font-bold">
              <span>Anchor PDA Lock</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                02
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Live AI Risk Audit & Proof
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Gemini & Groq streaming oracles evaluate agent transaction velocity, accuracy thresholds, and policy parameters to flag violations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-emerald-300 font-bold">
              <span>Automated Verification</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                03
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Milestone Vault Release
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                Transacted SOL is verified against active spending caps. Funds release in tranches only when payments pass AI compliance checks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-cyan-300 font-bold">
              <span>Programmatic Release</span>
            </div>
          </div>

          {/* Card 04 */}
          <div className="glass-card-neon p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between group hover:border-purple-400/60 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center font-mono font-black text-white mb-4 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                04
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                Community & Slash Governance
              </h3>
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                A 3-Persona AI Jury votes on ambiguous claim submissions. Flagged transactions trigger automatic refunds to mandate owners.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center text-[11px] font-mono text-rose-300 font-bold">
              <span>Instant Slash & Refund</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

