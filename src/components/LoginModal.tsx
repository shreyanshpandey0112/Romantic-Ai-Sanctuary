import React, { useState } from 'react';
import { Heart, Sparkles, Feather, ArrowRight, X, Cake, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audioSynth';
import { FloralCorner, FloralDivider } from './FloralDecorations';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentName: string;
  currentBirthday?: string;
  currentVibeTitle: string;
  onSave: (name: string, birthday: string, vibeTitle: string) => void;
  canDismiss?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentBirthday = '',
  currentVibeTitle,
  onSave,
  canDismiss = true,
}) => {
  const [name, setName] = useState(currentName || '');
  const [birthday, setBirthday] = useState(currentBirthday || '');
  const [vibeTitle, setVibeTitle] = useState(currentVibeTitle || 'Ethereal Anime Muse & Dreamer');

  if (!isOpen) return null;

  const presetNames = ['Sophia', 'Maya', 'Elena', 'Lily', 'Aria', 'Chloe'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    romanticAudio.playVaultUnlock();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#f43f5e', '#fbcfe8', '#e9d5ff']
    });

    onSave(name.trim(), birthday, vibeTitle.trim());
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-stone-900/95 border border-rose-200/90 dark:border-rose-900/70 rounded-3xl shadow-2xl p-6 sm:p-9 backdrop-blur-xl transition-all my-8 overflow-hidden">
        
        {/* Floral Ornamental Corners */}
        <FloralCorner className="absolute -top-3 -left-3 rotate-0" />
        <FloralCorner className="absolute -bottom-3 -right-3 rotate-180" />

        {/* Dismiss Button */}
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center relative z-10">
          {/* Emblem */}
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rose-200 to-pink-100 dark:from-rose-950 dark:to-stone-800 flex items-center justify-center text-rose-500 shadow-inner mb-4 animate-float-gentle">
            <Heart className="w-8 h-8 fill-rose-400 text-rose-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-rose-100 mb-2">
            Welcome, Beautiful Soul
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto font-serif italic mb-4">
            “A celestial space created just for you—featuring anime aesthetics, romantic poetry, and an AI companion waiting to greet you.”
          </p>

          <FloralDivider className="my-2 opacity-60" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left mt-5">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-rose-500" /> What is your name, lovely? *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (e.g. Sophia)..."
                className="w-full px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-stone-700 bg-rose-50/40 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              />

              {/* Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] text-stone-400 dark:text-stone-500 mr-1">Suggestions:</span>
                {presetNames.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setName(p)}
                    className="px-2.5 py-0.5 rounded-full text-[11px] bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Birthday Input Section */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5 text-rose-500" /> When is your special Birthday? 🎂
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                We will count down every second until your birthday with a live celebration clock and blessings!
              </p>
            </div>

            {/* Vibe / Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-1">
                Your Anime / Creative Vibe
              </label>
              <input
                type="text"
                value={vibeTitle}
                onChange={(e) => setVibeTitle(e.target.value)}
                placeholder="e.g. Ethereal Anime Muse & Dreamer"
                className="w-full px-4 py-2 rounded-xl border border-rose-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 px-6 rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium shadow-lg shadow-rose-200 dark:shadow-none hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group text-sm"
            >
              <span>Enter Your Sanctuary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-4 text-[11px] text-stone-400 dark:text-stone-500 italic">
            You can modify your birthday & name anytime from the profile menu.
          </p>
        </div>
      </div>
    </div>
  );
};
