import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Terminal,
  Shield,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Trash2,
  RefreshCw,
  Award,
  Layers,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIModel } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'shadow';
  text: string;
  timestamp: number;
  suggestedQuestions?: string[];
  actionType?: 'open_recommender' | 'open_marketplace' | 'claim_faucet' | 'open_contract' | 'test_model';
  actionData?: any;
}

interface ShadowChatbotProps {
  onOpenRecommender: () => void;
  onOpenMarketplace: () => void;
  onOpenContract: () => void;
  onRequestAirdrop: () => void;
  onSelectModel: (modelId: string) => void;
  models: AIModel[];
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export const ShadowChatbot: React.FC<ShadowChatbotProps> = ({
  onOpenRecommender,
  onOpenMarketplace,
  onOpenContract,
  onRequestAirdrop,
  onSelectModel,
  models,
  walletConnected,
  onConnectWallet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialWelcomeMessage: Message = {
    id: 'welcome-msg',
    sender: 'shadow',
    text: `### 🛡️ **Shadow is speaking**
Welcome to the **Shadow Protocol** — where AI model performance is backed by **on-chain crypto collateral bonds** on Solana.

How can I assist you today? Feel free to ask:
- **"How should I start?"** for a step-by-step onboarding walkthrough.
- **"Recommend a model for my use case"** to find the perfect bonded AI.
- **"How does the bond slashing & refund mechanism work?"**
- **"Explain the Anchor Smart Contract & PDAs"**`,
    timestamp: Date.now(),
    suggestedQuestions: [
      'How should I start?',
      'Recommend the best model for my budget',
      'How does bond slashing protect buyers?',
      'Show me the Anchor smart contract code',
      'Claim +1 SOL Devnet Faucet',
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setHasInteracted(true);
    setInputMessage('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format history
      const history = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Shadow oracle response generated.';

      // Determine smart contextual actions
      let actionType: Message['actionType'];
      let actionData: any;
      const lower = text.toLowerCase();

      if (lower.includes('recommend') || lower.includes('which model') || lower.includes('best model')) {
        actionType = 'open_recommender';
      } else if (lower.includes('contract') || lower.includes('rust') || lower.includes('anchor')) {
        actionType = 'open_contract';
      } else if (lower.includes('faucet') || lower.includes('airdrop') || lower.includes('free sol')) {
        actionType = 'claim_faucet';
      } else if (lower.includes('market') || lower.includes('models') || lower.includes('catalog')) {
        actionType = 'open_marketplace';
      }

      const shadowReply: Message = {
        id: `shadow-${Date.now()}`,
        sender: 'shadow',
        text: reply,
        timestamp: Date.now(),
        suggestedQuestions: data.suggestedQuestions || [
          'How should I start?',
          'Recommend a model for trading',
          'How do 3-Persona oracles verify accuracy?',
        ],
        actionType,
        actionData,
      };

      setMessages((prev) => [...prev, shadowReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply: Message = {
        id: `shadow-err-${Date.now()}`,
        sender: 'shadow',
        text: `**Shadow Oracle online.** You can start by connecting your Phantom wallet to **Solana Devnet**, claiming **+1 SOL** from our faucet, and testing models with collateralized bonds in the Interactive Sandbox.`,
        timestamp: Date.now(),
        suggestedQuestions: [
          'How should I start?',
          'Recommend a model for my use case',
          'How does bond slashing work?',
        ],
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType?: Message['actionType']) => {
    if (!actionType) return;
    if (actionType === 'open_recommender') {
      onOpenRecommender();
    } else if (actionType === 'open_marketplace') {
      onOpenMarketplace();
    } else if (actionType === 'open_contract') {
      onOpenContract();
    } else if (actionType === 'claim_faucet') {
      onRequestAirdrop();
    }
  };

  const handleClearChat = () => {
    setMessages([initialWelcomeMessage]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            id="shadow-chat-pill-preview"
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0d051f]/95 border-2 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-xl text-left hover:border-purple-400 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" />
              <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5 font-heading">
                <span>Shadow is speaking</span>
                <Sparkles className="w-3 h-3 text-amber-300 group-hover:rotate-12 transition-transform" />
              </p>
              <p className="text-[10px] text-zinc-400 font-medium">Ask "How should I start?"</p>
            </div>
          </button>
        )}

        <button
          id="shadow-chat-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Shadow AI Chat"
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 p-0.5 shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group"
        >
          <div className="w-full h-full rounded-[14px] bg-[#0c051a] flex items-center justify-center relative overflow-hidden">
            {/* Ambient pulse background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-indigo-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {isOpen ? (
              <X className="w-6 h-6 text-purple-200 relative z-10" />
            ) : (
              <div className="relative z-10 flex items-center justify-center">
                <Bot className="w-7 h-7 text-purple-300 group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c051a]" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div
          id="shadow-chat-window"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#0b041a]/95 border-2 border-purple-500/60 shadow-[0_15px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl rounded-3xl overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-22 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[460px] h-[640px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-[#0b041a] border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center border border-purple-300/40 shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-base text-white tracking-wider">
                    Shadow is speaking
                  </h3>
                  <span className="text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Oracle Online
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80 font-medium">
                  Solana Devnet AI Guide & Performance Bonding
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Bar (Top) */}
          <div className="px-4 py-2 bg-black/40 border-b border-purple-500/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={onOpenRecommender}
              className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Model Recommender
            </button>
            <button
              onClick={onRequestAirdrop}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              +1 SOL Faucet
            </button>
            <button
              onClick={onOpenContract}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Anchor Contract
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'shadow' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 border border-purple-400/50 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)] rounded-br-none'
                      : 'bg-zinc-900/90 border border-purple-500/30 text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-bl-none'
                  }`}
                >
                  {/* Markdown formatted message */}
                  <div className="prose prose-invert prose-sm max-w-none text-zinc-100 space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>h3]:text-purple-300 [&>h3]:font-bold [&>h3]:text-base [&>h3]:mb-1 [&>strong]:text-purple-200">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* Contextual Action Button */}
                  {msg.actionType && (
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <button
                        onClick={() => handleActionClick(msg.actionType)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all cursor-pointer"
                      >
                        {msg.actionType === 'open_recommender' && (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Open AI Model Recommender
                          </>
                        )}
                        {msg.actionType === 'open_contract' && (
                          <>
                            <Terminal className="w-3.5 h-3.5 text-emerald-300" />
                            Inspect Anchor Rust Smart Contract
                          </>
                        )}
                        {msg.actionType === 'claim_faucet' && (
                          <>
                            <Zap className="w-3.5 h-3.5 text-emerald-300" />
                            Claim +1 SOL Devnet Airdrop
                          </>
                        )}
                        {msg.actionType === 'open_marketplace' && (
                          <>
                            <Layers className="w-3.5 h-3.5 text-purple-200" />
                            Browse Bonded Models Catalog
                          </>
                        )}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Contextual Suggested Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && msg.sender === 'shadow' && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                      <p className="text-[11px] font-bold text-purple-300/90 uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                        Suggested questions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="text-left text-xs px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 group/btn"
                          >
                            <span className="text-[10px] text-purple-400 group-hover/btn:text-white">▸</span>
                            <span>{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[9px] text-zinc-500 block text-right mt-1 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-purple-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 animate-pulse border border-purple-400/50">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-900/90 border border-purple-500/40 rounded-2xl px-4 py-3 text-xs text-purple-300 flex items-center gap-2 shadow-lg">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span>Shadow is thinking & querying Gemini oracle...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-black/60 border-t border-purple-500/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Shadow (e.g. 'How should I start?')..."
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950/90 border border-purple-500/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 px-1">
              <span>Powered by Gemini 2.5 & Solana Devnet</span>
              <span>"Don't rate the model. Bet on it."</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
