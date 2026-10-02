import React, { useState, useEffect } from 'react';
import { Cake, Sparkles, Heart, Clock, Calendar, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audioSynth';

interface BirthdayCountdownBannerProps {
  birthdayStr?: string; // YYYY-MM-DD or MM-DD
  userName: string;
  onOpenBirthdayPicker: () => void;
}

export const BirthdayCountdownBanner: React.FC<BirthdayCountdownBannerProps> = ({
  birthdayStr,
  userName,
  onOpenBirthdayPicker,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isToday: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });

  // Calculate zodiac sign
  const getZodiac = (month: number, day: number) => {
    const signs = [
      { name: 'Capricorn ♑', start: [1, 1], end: [1, 19] },
      { name: 'Aquarius ♒', start: [1, 20], end: [2, 18] },
      { name: 'Pisces ♓', start: [2, 19], end: [3, 20] },
      { name: 'Aries ♈', start: [3, 21], end: [4, 19] },
      { name: 'Taurus ♉', start: [4, 20], end: [5, 20] },
      { name: 'Gemini ♊', start: [5, 21], end: [6, 20] },
      { name: 'Cancer ♋', start: [6, 21], end: [7, 22] },
      { name: 'Leo ♌', start: [7, 23], end: [8, 22] },
      { name: 'Virgo ♍', start: [8, 23], end: [9, 22] },
      { name: 'Libra ♎', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio ♏', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius ♐', start: [11, 22], end: [12, 21] },
      { name: 'Capricorn ♑', start: [12, 22], end: [12, 31] },
    ];
    for (const z of signs) {
      if (
        (month === z.start[0] && day >= z.start[1]) ||
        (month === z.end[0] && day <= z.end[1])
      ) {
        return z.name;
      }
    }
    return 'Starlit Celestial 🌟';
  };

  useEffect(() => {
    if (!birthdayStr) return;

    const parts = birthdayStr.split('-');
    let bMonth = 1;
    let bDay = 1;
    if (parts.length === 3) {
      bMonth = parseInt(parts[1], 10);
      bDay = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      bMonth = parseInt(parts[0], 10);
      bDay = parseInt(parts[1], 10);
    }

    const calculateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Next birthday date
      let targetDate = new Date(currentYear, bMonth - 1, bDay, 0, 0, 0);

      // Check if birthday is today
      const isToday =
        now.getMonth() === bMonth - 1 && now.getDate() === bDay;

      if (isToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      if (now > targetDate) {
        // If already passed this year, set for next year
        targetDate = new Date(currentYear + 1, bMonth - 1, bDay, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isToday: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [birthdayStr]);

  if (!birthdayStr) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4">
        <div
          onClick={onOpenBirthdayPicker}
          className="cursor-pointer p-4 rounded-3xl bg-rose-50/70 dark:bg-stone-900/70 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left hover:border-rose-400 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Cake className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-stone-800 dark:text-rose-100">
                When is your birthday, {userName || 'lovely'}?
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Set your special day so we can count down every second and celebrate you properly!
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-xs"
          >
            Add Birthday Date ✨
          </button>
        </div>
      </div>
    );
  }

  // Parse for zodiac
  const bParts = birthdayStr.split('-');
  const m = bParts.length === 3 ? parseInt(bParts[1], 10) : parseInt(bParts[0], 10);
  const d = bParts.length === 3 ? parseInt(bParts[2], 10) : parseInt(bParts[1], 10);
  const zodiac = getZodiac(m, d);

  const triggerBirthdayShower = () => {
    romanticAudio.playVaultUnlock();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#fbcfe8', '#fef08a', '#e9d5ff']
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
      {timeLeft.isToday ? (
        /* Birthday Is Today! Celebratory Mode */
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-200 via-pink-100 to-amber-100 dark:from-rose-950/80 dark:via-stone-900 dark:to-amber-950/50 border-2 border-rose-300 dark:border-rose-700 shadow-xl text-center relative overflow-hidden animate-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-rose-700 dark:text-rose-200">
              Happy Birthday, {userName}! 🎂✨
            </h3>
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          </div>

          <p className="font-serif text-base sm:text-lg text-stone-700 dark:text-rose-100 italic max-w-xl mx-auto mb-4">
            “Today the whole world celebrates the day you brought your radiant smile and gentle heart into our lives.”
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={triggerBirthdayShower}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs shadow-md shadow-rose-300 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" /> Shower Birthday Love!
            </button>
            <button
              onClick={onOpenBirthdayPicker}
              className="text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 underline underline-offset-4"
            >
              Edit Date
            </button>
          </div>
        </div>
      ) : (
        /* Countdown Mode */
        <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-rose-200/80 dark:border-rose-900/60 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Left title & zodiac */}
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-200 to-pink-100 dark:from-rose-950 dark:to-stone-800 flex items-center justify-center text-rose-500 shadow-inner flex-shrink-0 animate-float-gentle">
                <Cake className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h4 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-rose-100">
                    {userName}'s Birthday Countdown
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-medium">
                    {zodiac}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Every second brings us closer to celebrating your most radiant day.
                </p>
              </div>
            </div>

            {/* Right: Live countdown timer boxes */}
            <div className="flex items-center gap-2 sm:gap-3 text-center">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="w-14 sm:w-16 py-2 rounded-2xl bg-rose-50/80 dark:bg-stone-800/80 border border-rose-100 dark:border-stone-700/60 shadow-xs"
                >
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-300">
                    {item.val < 10 ? `0${item.val}` : item.val}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
