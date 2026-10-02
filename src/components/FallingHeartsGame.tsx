import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, X, Trophy, RotateCcw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audioSynth';

interface FallingHeartsGameProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  symbol: string;
  points: number;
}

export const FallingHeartsGame: React.FC<FallingHeartsGameProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [basketX, setBasketX] = useState(150);
  const [isGameOver, setIsGameOver] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<FallingItem[]>([]);
  const animationRef = useRef<number | null>(null);

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(25);
    setIsGameOver(false);
    setIsPlaying(true);
    itemsRef.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
  }, [isOpen]);

  // Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsGameOver(true);
            romanticAudio.playVaultUnlock();
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#fda4af', '#f43f5e', '#ec4899', '#fbcfe8']
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const symbols = [
      { sym: '💖', pts: 10 },
      { sym: '🌸', pts: 5 },
      { sym: '✨', pts: 15 },
      { sym: '🌹', pts: 10 },
      { sym: '🍓', pts: 20 },
    ];

    let lastSpawn = Date.now();

    const loop = () => {
      const now = Date.now();
      // Spawn items
      if (now - lastSpawn > 500) {
        lastSpawn = now;
        const picked = symbols[Math.floor(Math.random() * symbols.length)];
        itemsRef.current.push({
          id: Math.random(),
          x: Math.random() * 280 + 10,
          y: -20,
          speed: Math.random() * 1.5 + 2,
          symbol: picked.sym,
          points: picked.pts,
        });
      }

      // Update positions & check collisions
      const basketWidth = 60;
      const basketY = 320;

      itemsRef.current = itemsRef.current
        .map((item) => ({ ...item, y: item.y + item.speed }))
        .filter((item) => {
          // Check collision with basket
          if (
            item.y >= basketY - 15 &&
            item.y <= basketY + 25 &&
            item.x >= basketX - basketWidth / 2 &&
            item.x <= basketX + basketWidth / 2
          ) {
            setScore((prev) => prev + item.points);
            romanticAudio.playPetalTouch();
            return false;
          }
          return item.y < 360;
        });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, basketX]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setBasketX(Math.max(30, Math.min(290, x)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    setBasketX(Math.max(30, Math.min(290, x)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl shadow-2xl p-6 backdrop-blur-xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-rose-100 mb-1">
          Catch the Starlight Petals
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Move your basket to catch falling love petals & stars for {userName || 'you'}!
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between px-4 py-2 bg-rose-50/80 dark:bg-stone-800/80 rounded-2xl border border-rose-100 dark:border-stone-700 text-xs font-semibold text-rose-600 dark:text-rose-300 mb-4">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score} ✨</span>
        </div>

        {/* Game Stage Area */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-[320px] h-[360px] mx-auto bg-gradient-to-b from-rose-100/40 to-pink-50/80 dark:from-stone-950 dark:to-stone-900/90 rounded-2xl border border-rose-200/60 dark:border-stone-800 overflow-hidden select-none cursor-ew-resize shadow-inner"
        >
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-stone-900/60 backdrop-blur-xs z-20">
              <Sparkles className="w-10 h-10 text-rose-500 mb-3 animate-bounce" />
              <p className="font-serif text-sm text-stone-800 dark:text-stone-200 mb-4">
                Ready to catch all the sweet blessings falling from the sky?
              </p>
              <button
                onClick={startNewGame}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Game
              </button>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xs z-20 animate-in zoom-in-95">
              <Trophy className="w-10 h-10 text-amber-500 mb-2" />
              <h4 className="font-serif text-xl font-bold text-rose-600 dark:text-rose-300 mb-1">
                A Basket Full of Love!
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-3">
                You gathered <strong className="text-rose-500">{score} starlight points</strong>!
              </p>
              <p className="font-serif italic text-xs text-stone-500 dark:text-stone-400 mb-4">
                “May your life always be filled with as many blessings as you caught today.”
              </p>
              <button
                onClick={startNewGame}
                className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Catch Again
              </button>
            </div>
          )}

          {/* Falling Items */}
          {itemsRef.current.map((item) => (
            <div
              key={item.id}
              className="absolute text-xl transform -translate-x-1/2 pointer-events-none transition-transform"
              style={{ left: `${item.x}px`, top: `${item.y}px` }}
            >
              {item.symbol}
            </div>
          ))}

          {/* Basket / Teacup */}
          <div
            className="absolute bottom-4 h-9 w-14 rounded-b-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md transform -translate-x-1/2 transition-all duration-75 pointer-events-none border-t-2 border-white/50"
            style={{ left: `${basketX}px` }}
          >
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
