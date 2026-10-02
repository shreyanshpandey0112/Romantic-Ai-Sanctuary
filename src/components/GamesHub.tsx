import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Heart, Play, Flower, Gift } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynth';

interface GamesHubProps {
  onOpenVault: () => void;
  onOpenMemoryMatch: () => void;
  onOpenPetalPlucker: () => void;
  onOpenCatchHearts: () => void;
  userName: string;
  onEarnPetals?: (amount: number, reason: string) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  onOpenVault,
  onOpenMemoryMatch,
  onOpenPetalPlucker,
  onOpenCatchHearts,
  userName,
  onEarnPetals,
}) => {
  const games = [
    {
      id: 'vault',
      title: 'The Enchanted Secret Safe',
      subtitle: 'Unlock with secret code 143 to read wax-sealed notes and love letters.',
      badge: 'Secret Vault',
      reward: '+20 🌸',
      icon: Lock,
      color: 'from-rose-400 to-pink-500',
      action: () => {
        if (onEarnPetals) onEarnPetals(20, 'Unlocked Secret Safe');
        onOpenVault();
      },
    },
    {
      id: 'memory',
      title: 'Keepsake Memory Match',
      subtitle: 'Find matching pairs of blooms & romantic tokens with sweet chimes.',
      badge: 'Card Puzzle',
      reward: '+15 🌸',
      icon: Sparkles,
      color: 'from-pink-400 to-purple-500',
      action: () => {
        if (onEarnPetals) onEarnPetals(15, 'Played Memory Match');
        onOpenMemoryMatch();
      },
    },
    {
      id: 'plucker',
      title: 'Loves Me, Loves Me Truly',
      subtitle: 'Pluck petals from an enchanted sakura bloom to reveal hidden feelings.',
      badge: 'Fortune Bloom',
      reward: '+15 🌸',
      icon: Flower,
      color: 'from-amber-400 to-rose-400',
      action: () => {
        if (onEarnPetals) onEarnPetals(15, 'Plucked Sakura Petals');
        onOpenPetalPlucker();
      },
    },
    {
      id: 'catch',
      title: 'Catch Falling Hearts & Stars',
      subtitle: 'A sweet 25-second arcade game to gather starlight blessings in your basket.',
      badge: 'Mini-Arcade',
      reward: '+20 🌸',
      icon: Heart,
      color: 'from-rose-400 to-indigo-500',
      action: () => {
        if (onEarnPetals) onEarnPetals(20, 'Caught Falling Stars & Hearts');
        onOpenCatchHearts();
      },
    },
  ];

  return (
    <section id="games-arcade" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs text-rose-500 font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Keepsakes</span>
          <span aria-hidden="true">·</span>
          <span>Earn Digital Petals</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 dark:text-stone-100 mb-3">
          Interactive Keepsake Games
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light max-w-lg mx-auto">
          Delightful interactive games designed to bring warmth, surprise, and laughter to {userName || 'you'}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                romanticAudio.playPetalTouch();
                game.action();
              }}
              className="cursor-pointer group relative p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {game.reward}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors mb-2">
                  {game.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light">
                  {game.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-rose-500 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Play Now</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
