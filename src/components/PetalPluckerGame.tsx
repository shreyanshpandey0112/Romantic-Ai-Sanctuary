import React, { useState } from 'react';
import { Sparkles, Heart, RotateCcw, X, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audioSynth';

interface PetalPluckerGameProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const AFFIRMATIONS = [
  "He loves how your eyes sparkle when you smile.",
  "Your kindness touches everyone fortunate enough to know you.",
  "He treasures every late-night conversation with you.",
  "You are the peace in the middle of a chaotic world.",
  "Your creative taste is breathtaking and one of a kind.",
  "He admires your gentle strength and honesty.",
  "Every song about love reminds him of you.",
  "Loves you beyond words, beyond stars, forever and truly! 💖",
];

export const PetalPluckerGame: React.FC<PetalPluckerGameProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  const [petalsLeft, setPetalsLeft] = useState(8);
  const [currentAffirmation, setCurrentAffirmation] = useState<string>(
    `Pluck a petal to reveal a secret truth meant for ${userName || 'you'}...`
  );
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const handlePluck = () => {
    if (petalsLeft <= 0) return;

    romanticAudio.playPetalTouch();
    const nextLeft = petalsLeft - 1;
    setPetalsLeft(nextLeft);

    const affIndex = 8 - petalsLeft;
    setCurrentAffirmation(AFFIRMATIONS[affIndex]);

    if (nextLeft === 0) {
      setIsFinished(true);
      romanticAudio.playVaultUnlock();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#f43f5e', '#fbcfe8', '#fef08a']
      });
    }
  };

  const handleReset = () => {
    setPetalsLeft(8);
    setCurrentAffirmation(`Pluck a petal to reveal a secret truth meant for ${userName || 'you'}...`);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all my-8 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/60 text-xs text-rose-600 dark:text-rose-300 font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Loves Me, Loves Me Truly</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-rose-100 mb-2">
          The Enchanted Sakura Flower
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
          Touch the blooming flower to pluck a petal and unveil a hidden feeling.
        </p>

        {/* Flower Interactive Graphic */}
        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center select-none">
          {/* Petals */}
          {[...Array(8)].map((_, i) => {
            const angle = i * 45;
            const isPlucked = i >= petalsLeft;
            return (
              <div
                key={i}
                onClick={handlePluck}
                className={`absolute w-12 h-20 rounded-full cursor-pointer transition-all duration-500 origin-bottom transform ${
                  isPlucked
                    ? 'opacity-0 scale-50 pointer-events-none translate-y-10'
                    : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'
                }`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-32px)`,
                  background: 'radial-gradient(circle at 50% 20%, #fbcfe8, #fda4af, #f43f5e)',
                  boxShadow: '0 4px 10px rgba(244, 63, 94, 0.25)',
                }}
              />
            );
          })}

          {/* Golden Center Core */}
          <div
            onClick={handlePluck}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 shadow-md flex items-center justify-center relative z-20 cursor-pointer active:scale-90 transition-transform"
          >
            <Heart className="w-7 h-7 text-rose-500 fill-current animate-pulse" />
          </div>
        </div>

        {/* Affirmation Box */}
        <div className="min-h-[70px] flex items-center justify-center p-4 rounded-2xl bg-rose-50/70 dark:bg-stone-800/60 border border-rose-100 dark:border-stone-700/60 text-xs sm:text-sm text-stone-800 dark:text-rose-100 font-serif italic mb-6">
          “{currentAffirmation}”
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isFinished ? (
            <button
              onClick={handlePluck}
              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
            >
              Pluck Petal ({petalsLeft} left)
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Pluck Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
