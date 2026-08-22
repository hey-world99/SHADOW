import React from 'react';
import { ArrowRight, Sparkles, Shield, Rocket, LogIn } from 'lucide-react';
import { UserProfile } from '../services/authService';

interface LandingHeroProps {
  onGetStarted: () => void;
  onOpenProtocolSpec: () => void;
  onOpenAuth: () => void;
  onOpenRecommender?: () => void;
  currentUser?: UserProfile | null;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  onOpenProtocolSpec,
  onOpenAuth,
  onOpenRecommender,
  currentUser,
}) => {
  return (
    <div className="relative w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-16 min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Brand, Tagline, & CTAs (Cols 1-7) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Brand Logo Box & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-950 flex items-center justify-center border-2 border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.8)] relative group">
              <Shield className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-wider text-white text-shadow-hero font-serif">
                  SHADOW
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-300 border border-purple-500/50">
                  DEVNET
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-purple-200/90 font-semibold tracking-wide text-shadow-sm">
                On-Chain AI Performance Bonds & Real-Time Settlements
              </p>
            </div>
          </div>

          {/* Tagline Heading */}
          <div className="space-y-1">
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-shadow-hero">
              Don’t rate the model.
            </h2>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-200 text-shadow-hero">
              Bet on it.
            </h2>
          </div>

          {/* Micro-steps Indicator */}
          <div className="w-full max-w-md pt-1">
            {/* Step Progress Line */}
            <div className="relative w-full h-1.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
              <div className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 shadow-[0_0_12px_#c084fc]" />
            </div>
            {/* Step labels */}
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono font-bold">
              <span className="text-white tracking-widest">STAKE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
              <span className="text-purple-300/80 tracking-widest">TEST</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
              <span className="text-purple-400/60 tracking-widest">SETTLE</span>
            </div>
          </div>

          {/* Hero CTA Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              id="hero-get-started-btn"
              onClick={currentUser ? onGetStarted : onOpenAuth}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-bold text-base border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:shadow-[0_0_55px_rgba(168,85,247,0.95)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              {currentUser ? (
                <>
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-purple-400/40">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <span>Enter Workspace</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Rocket className="w-4 h-4 text-purple-200" />
                  </div>
                  <span>Get Started to Login</span>
                </>
              )}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-purple-200" />
            </button>

            {/* Google Authentication Direct One-Tap Button */}
            {!currentUser && (
              <button
                id="hero-google-login-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-bold shadow-[0_0_30px_rgba(255,255,255,0.35)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}

            <button
              id="hero-view-protocol-btn"
              onClick={onOpenProtocolSpec}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold backdrop-blur-md transition-all shadow-[0_0_15px_rgba(147,51,234,0.2)] cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Protocol Spec</span>
            </button>

            {onOpenRecommender && (
              <button
                id="hero-recommender-btn"
                onClick={onOpenRecommender}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-950 hover:border-amber-400 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>AI Model Recommender</span>
              </button>
            )}
          </div>

          {/* Pill Features List */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200/90 text-xs font-semibold backdrop-blur-sm">
              On-Chain Performance Bonds
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200/90 text-xs font-semibold backdrop-blur-sm">
              Real-Time Settlements
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200/90 text-xs font-semibold backdrop-blur-sm">
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

                {/* Left Celestial Raised Hand */}
                <g transform="translate(100, 240) rotate(-15)">
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
                  <path
                    d="M8 65 C12 85 24 95 38 90 C48 82 44 68 36 65 Z"
                    fill="url(#chromeHandGrad)"
                    stroke="#c084fc"
                    strokeWidth="1.2"
                  />
                </g>

                {/* Right Celestial Raised Hand */}
                <g transform="translate(180, 215) rotate(15)">
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
                  <path
                    d="M52 65 C48 85 36 95 22 90 C12 82 16 68 24 65 Z"
                    fill="url(#chromeHandGrad)"
                    stroke="#c084fc"
                    strokeWidth="1.2"
                  />
                </g>

                {/* Mantle Folds */}
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
    </div>
  );
};
