import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

interface FinalCinematicSectionProps {
  userName: string;
  petals: number;
  onRestartExperience: () => void;
  onOpenRewards: () => void;
}

export const FinalCinematicSection: React.FC<FinalCinematicSectionProps> = ({
  userName,
  petals,
  onRestartExperience,
  onOpenRewards,
}) => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden text-center bg-gradient-to-b from-transparent via-rose-50/20 to-rose-100/30 dark:via-stone-900/40 dark:to-stone-950/80 border-t border-stone-200/60 dark:border-stone-800/60">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-rose-200/20 dark:bg-rose-950/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Subtle emblem */}
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
          <Heart className="w-6 h-6 fill-current text-rose-400" />
        </div>

        {/* Final Meaningful Sentence */}
        <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-[1.2] mb-6 text-balance">
          “May every petal in this sanctuary remind you that you are deeply cherished, today and for all days to come.”
        </h2>

        <p className="font-serif italic text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
          Crafted with care, gentle stillness, and celestial starlight · Dedicated to {userName || 'Sophia'}
        </p>

        {/* Petals gathered & Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenRewards();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-rose-300 text-stone-700 dark:text-stone-300 text-xs font-medium shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>You hold {petals} 🌸 Bloom Petals</span>
          </button>

          <button
            onClick={() => {
              romanticAudio.playPetalTouch();
              onRestartExperience();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-medium shadow-md shadow-rose-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Return to Sanctuary Peak</span>
          </button>
        </div>
      </div>
    </section>
  );
};
