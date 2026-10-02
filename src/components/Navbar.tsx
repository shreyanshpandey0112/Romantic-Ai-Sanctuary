import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Lock, Sparkles, Heart, Menu, X, Play, MessageCircleHeart, Cake, BookOpen, Trophy } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

interface NavbarProps {
  userName: string;
  birthday?: string;
  isDark: boolean;
  petals: number;
  onToggleTheme: () => void;
  onOpenAssistant: () => void;
  onOpenVault: () => void;
  onOpenLogin: () => void;
  onOpenRewards: () => void;
  onOpenDailyNote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  birthday,
  isDark,
  petals,
  onToggleTheme,
  onOpenAssistant,
  onOpenVault,
  onOpenLogin,
  onOpenRewards,
  onOpenDailyNote,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Intelligent scroll hiding for desktop & tablet
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY && !isMobileMenuOpen) {
          // Scrolling down -> hide navbar
          setIsVisible(false);
        } else {
          // Scrolling up -> show navbar
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const firstLetter = (userName || 'S').charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/85 dark:bg-stone-900/85 backdrop-blur-md shadow-xs py-2.5 sm:py-3 border-b border-stone-200/60 dark:border-stone-800/80'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Text Wordmark (Anti-Slop Top Bar Contract) */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            romanticAudio.playPetalTouch();
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-rose-300 to-pink-200 dark:from-rose-950 dark:to-stone-800 flex items-center justify-center text-rose-800 dark:text-rose-200 font-serif font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            {firstLetter}
          </div>
          <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
            {userName || 'Sophia'}
          </span>
        </div>

        {/* Zone 2: Clean Text Nav Links with Hover Underline (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-stone-600 dark:text-stone-300">
          <a
            href="#daily-love-note"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1"
          >
            Daily Note
          </a>

          <a
            href="#ai-image-studio"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1"
          >
            Visual Gallery
          </a>

          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenAssistant();
            }}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1"
          >
            Poetry Lounge
          </button>

          <a
            href="#games-arcade"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1"
          >
            Games Arcade
          </a>

          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenVault();
            }}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-1"
          >
            The Secret Safe
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Rewards / Dark Mode / Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Bloom Rewards Pill */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenRewards();
            }}
            className="min-h-[38px] px-3 py-1.5 rounded-full border border-amber-200 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-900/80 text-xs font-medium text-amber-900 dark:text-amber-300 hover:border-amber-400 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
            title="Bloom Rewards Dashboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">{petals}</span>
            <span className="hidden sm:inline text-[11px] text-amber-700/80 dark:text-amber-400">🌸</span>
          </button>

          {/* Birthday / Profile Button */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenLogin();
            }}
            className="hidden sm:flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-rose-300 transition-all active:scale-95"
            title="Profile & Birthday Settings"
          >
            <Cake className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate max-w-[90px]">{userName || 'Profile'}</span>
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onToggleTheme();
            }}
            className="min-h-[38px] min-w-[38px] p-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-300 transition-all shadow-xs active:scale-95 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-rose-500" />
            )}
          </button>

          {/* Mobile Menu Button: 44px+ touch target */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-200 hover:text-rose-500 flex items-center justify-center transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu: Bottom-Sheet / Full-Screen Styled with 44px+ Touch Targets */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white/98 dark:bg-stone-950/98 border-b border-stone-200 dark:border-stone-800 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-2xl"
          >
            {/* Top Muse Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 text-xs">
              <span className="text-stone-500">Sanctuary for: <strong>{userName}</strong></span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="min-h-[44px] text-rose-500 font-medium hover:underline flex items-center gap-1.5"
              >
                <Cake className="w-4 h-4" />
                <span>Edit Birthday</span>
              </button>
            </div>

            {/* Nav Items (Each with 44px+ Touch Height) */}
            <div className="flex flex-col space-y-1 text-sm font-medium text-stone-800 dark:text-stone-200">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDailyNote();
                }}
                className="min-h-[44px] w-full text-left py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3"
              >
                <BookOpen className="w-4 h-4 text-rose-500" />
                <span>Daily Love Note (+30 🌸)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRewards();
                }}
                className="min-h-[44px] w-full text-left py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3 text-amber-700 dark:text-amber-400"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Bloom Rewards Dashboard ({petals} 🌸)</span>
              </button>

              <a
                href="#ai-image-studio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[44px] py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>AI Visual Gallery</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="min-h-[44px] w-full text-left py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3"
              >
                <MessageCircleHeart className="w-4 h-4 text-rose-500" />
                <span>AI Poetry Lounge (Female Audio)</span>
              </button>

              <a
                href="#games-arcade"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[44px] py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3"
              >
                <Play className="w-4 h-4 text-rose-500 fill-current" />
                <span>Keepsake Games Arcade (4)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenVault();
                }}
                className="min-h-[44px] w-full text-left py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors flex items-center gap-3"
              >
                <Lock className="w-4 h-4 text-rose-500" />
                <span>The Secret Safe (Code 143)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
