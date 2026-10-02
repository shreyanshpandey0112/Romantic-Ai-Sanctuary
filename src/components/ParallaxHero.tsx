import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Lock, Play, ArrowDown, Feather, BookOpen, Trophy } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

interface ParallaxHeroProps {
  userName: string;
  vibeTitle: string;
  onOpenAssistant: () => void;
  onOpenVault: () => void;
  onOpenGames: () => void;
  onOpenDailyNote: () => void;
  onOpenRewards: () => void;
  petals: number;
  totalImages: number;
  totalPoems: number;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  userName,
  vibeTitle,
  onOpenAssistant,
  onOpenVault,
  onOpenGames,
  onOpenDailyNote,
  onOpenRewards,
  petals,
  totalImages,
  totalPoems,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMouseOffset({
          x: (e.clientX - centerX) / 45,
          y: (e.clientY - centerY) / 45,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 pb-16">
      {/* Desktop Cinematic Layered Backdrop */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20 transition-transform duration-700 ease-out hidden md:block"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(253, 164, 175, 0.18), transparent 70%)',
          transform: `translate(${mouseOffset.x * -0.5}px, ${scrollY * 0.15 + mouseOffset.y * -0.5}px)`,
        }}
      />

      {/* Floating Botanical Glows */}
      <div
        className="absolute -top-24 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-rose-200/40 dark:bg-rose-950/30 blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: !isMobile ? `translate(${mouseOffset.x * -1}px, ${scrollY * 0.2 + mouseOffset.y * -1}px)` : 'none',
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-purple-200/30 dark:bg-purple-950/25 blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: !isMobile ? `translate(${mouseOffset.x * 1.2}px, ${scrollY * 0.3 + mouseOffset.y * 1.2}px)` : 'none',
        }}
      />

      {/* Main Sanctuary Hero Content */}
      <div
        className="relative z-10 max-w-4xl mx-auto text-center transition-transform duration-500 ease-out"
        style={{
          transform: !isMobile ? `translateY(${scrollY * 0.08}px)` : 'none',
        }}
      >
        {/* Subtle Kicker & Bloom Petals Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenDailyNote();
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50/90 dark:bg-stone-900/90 border border-rose-200/80 dark:border-stone-800 text-xs text-stone-700 dark:text-rose-200 font-medium shadow-xs cursor-pointer hover:border-rose-400 transition-all active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span>{getGreeting()}, dear {userName || 'Sophia'}</span>
            <span aria-hidden="true" className="text-rose-300">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-serif italic">Today’s Note Ready</span>
          </div>

          <button
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenRewards();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 dark:bg-stone-900/80 border border-amber-200/80 dark:border-stone-800 text-xs text-amber-800 dark:text-amber-300 font-medium hover:border-amber-400 transition-all active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{petals} 🌸 Petals</span>
          </button>
        </div>

        {/* Hero Headline with clamp() Fluid Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2.4rem,6vw,4.8rem)] font-normal text-stone-900 dark:text-stone-100 tracking-tight leading-[1.12] mb-5 text-balance"
        >
          Dedicated With Love to <br className="hidden sm:inline" />
          <span className="italic font-normal bg-gradient-to-r from-rose-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            {userName || 'Sophia'}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-lg sm:text-2xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-light leading-relaxed mb-3"
        >
          {vibeTitle || 'Anime Visual Poetry, Romantic Verses & Secret Vaults'}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto mb-8 font-light leading-relaxed"
        >
          A private digital sanctuary where images whisper lyrical poetry, our AI companion recites in a soothing female voice, and secret games await your discovery.
        </motion.p>

        {/* Action Buttons: 44px+ Touch Targets on Mobile, Cinematic on Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1"
        >
          {/* Daily Love Note CTA */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenDailyNote();
            }}
            className="min-h-[44px] px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs sm:text-sm font-medium shadow-md shadow-rose-200 dark:shadow-none hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Today's Love Note (+30 🌸)</span>
          </button>

          {/* AI Poetry Assistant */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenAssistant();
            }}
            className="min-h-[44px] px-5 py-3 rounded-full bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 hover:border-rose-300 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium shadow-xs hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Feather className="w-4 h-4 text-rose-500" />
            <span>AI Poetry Lounge (Audio)</span>
          </button>

          {/* Secret Safe */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenVault();
            }}
            className="min-h-[44px] px-4 py-3 rounded-full bg-rose-50/70 dark:bg-stone-900/80 border border-rose-200/80 dark:border-stone-800 hover:bg-rose-100/70 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span>The Secret Safe</span>
          </button>
        </motion.div>

        {/* Quick Stats: Clean Editorial Typography (No Pills) */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mt-12 pt-6 border-t border-stone-200/60 dark:border-stone-800/80 text-stone-500 dark:text-stone-400 text-xs">
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {totalImages}
            </span>
            <span className="text-[11px] tracking-wider uppercase font-light">Fine Art Pieces</span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {totalPoems}+
            </span>
            <span className="text-[11px] tracking-wider uppercase font-light">Lyrical Poems</span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-semibold text-rose-600 dark:text-rose-400">
              4
            </span>
            <span className="text-[11px] tracking-wider uppercase font-light">Keepsake Games</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 flex justify-center">
          <a
            href="#daily-love-note"
            className="p-2 rounded-full text-rose-400 hover:text-rose-600 transition-colors animate-bounce"
            aria-label="Scroll down to daily love note"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
