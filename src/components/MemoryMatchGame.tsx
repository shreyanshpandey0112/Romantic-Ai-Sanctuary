import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, X, Trophy, Clock, Zap, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MEMORY_CARDS_DATA } from '../data/initialContent';
import { romanticAudio } from '../utils/audioSynth';

interface MemoryCardItem {
  id: number;
  pairId: number;
  symbol: string;
  name: string;
  meaning: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle cards
  const initializeGame = () => {
    const duplicated: MemoryCardItem[] = [];
    let idCounter = 1;

    MEMORY_CARDS_DATA.forEach((item) => {
      // First card of pair
      duplicated.push({
        id: idCounter++,
        pairId: item.pairId,
        symbol: item.symbol,
        name: item.name,
        meaning: item.meaning,
        isFlipped: false,
        isMatched: false,
      });
      // Second card of pair
      duplicated.push({
        id: idCounter++,
        pairId: item.pairId,
        symbol: item.symbol,
        name: item.name,
        meaning: item.meaning,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates shuffle
    for (let i = duplicated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
    }

    setCards(duplicated);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsWon(false);
    setIsGameActive(true);
  };

  useEffect(() => {
    if (isOpen) {
      initializeGame();
    } else {
      setIsGameActive(false);
    }
  }, [isOpen]);

  // Timer
  useEffect(() => {
    let timer: any = null;
    if (isGameActive && !isWon) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, isWon]);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) return;
    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    romanticAudio.playPetalTouch();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.pairId === card2.pairId) {
        // Matched!
        setTimeout(() => {
          romanticAudio.playCardMatch();
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setMatches((prev) => {
            const nextMatches = prev + 1;
            if (nextMatches === MEMORY_CARDS_DATA.length) {
              // Victory!
              setIsWon(true);
              romanticAudio.playVaultUnlock();
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#fda4af', '#f43f5e', '#ec4899', '#fbcfe8', '#a855f7']
              });
            }
            return nextMatches;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-950 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <Sparkles className="w-5 h-5 text-rose-500 dark:text-rose-300" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-rose-100">
                Floral Keepsake Memory Match
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Find matching pairs of blooms and sentimental treasures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between bg-rose-50/70 dark:bg-stone-800/60 border border-rose-100 dark:border-stone-700/60 rounded-2xl px-5 py-3 mb-6 text-xs text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Time: <strong>{formatTime(seconds)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Moves: <strong>{moves}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pink-500" />
            <span>Pairs: <strong>{matches} / {MEMORY_CARDS_DATA.length}</strong></span>
          </div>
          <button
            type="button"
            onClick={initializeGame}
            className="flex items-center gap-1 text-rose-600 dark:text-rose-300 hover:underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-lg mx-auto mb-6">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square cursor-pointer rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all duration-300 transform select-none relative ${
                  card.isMatched
                    ? 'bg-rose-100/80 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-500 text-rose-600 scale-95 shadow-sm'
                    : isRevealed
                    ? 'bg-white dark:bg-stone-800 border-2 border-rose-300 dark:border-rose-700 shadow-md rotate-0'
                    : 'bg-gradient-to-tr from-rose-200 via-pink-100 to-rose-50 dark:from-stone-800 dark:via-rose-950/50 dark:to-stone-900 border border-rose-200/60 dark:border-stone-700 hover:scale-105 hover:shadow-md'
                }`}
              >
                {isRevealed ? (
                  <div className="animate-in fade-in zoom-in duration-200 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1">{card.symbol}</span>
                    <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300 line-clamp-1">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-60">
                    <Heart className="w-5 h-5 text-rose-400 dark:text-rose-300 fill-current animate-pulse" />
                    <span className="text-[9px] text-rose-600/70 dark:text-rose-300/70 font-serif mt-1">Reveal</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Victory Banner */}
        {isWon && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-100/90 via-pink-100/90 to-purple-100/90 dark:from-rose-950/60 dark:via-stone-900 dark:to-purple-950/60 border border-rose-300 dark:border-rose-800 text-center animate-in zoom-in-95 duration-300 shadow-xl">
            <h4 className="font-serif text-2xl font-bold text-rose-700 dark:text-rose-200 mb-2">
              A Match Made in the Stars! ✨
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-200 max-w-md mx-auto mb-4 font-serif italic">
              “Just as each of these gentle blossoms found its twin, {userName || 'you'} bring harmony and unmatched beauty to the world.”
            </p>
            <div className="text-xs text-stone-600 dark:text-stone-400 mb-4">
              Completed in <strong>{formatTime(seconds)}</strong> with <strong>{moves} moves</strong>.
            </div>
            <button
              type="button"
              onClick={initializeGame}
              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none transition-transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
