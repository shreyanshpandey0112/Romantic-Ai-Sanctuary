import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Gift, ArrowRight, X, Clock, Award, ShieldCheck, Heart, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloomActivity, BloomTier } from '../types';
import { romanticAudio } from '../utils/audioSynth';

export const BLOOM_TIERS: BloomTier[] = [
  {
    name: 'Sakura Bud',
    minPetals: 0,
    description: 'The beginning of your personal digital sanctuary.',
    perk: 'Access to All 4 Sanctuary Games',
    badge: '🌱',
  },
  {
    name: 'Garden Sprout',
    minPetals: 50,
    description: 'Your presence breathes life into these quiet petals.',
    perk: 'Unlocks Ambient Ethereal Harp Soundscape',
    badge: '🌿',
  },
  {
    name: 'Radiant Blossom',
    minPetals: 150,
    description: 'A radiant aura blooming in soft starlight.',
    perk: 'Unlocks Velvet Midnight Dark Mode Theme',
    badge: '🌸',
  },
  {
    name: 'Celestial Rose',
    minPetals: 300,
    description: 'An intimate bond where every moment is cherished.',
    perk: 'Unlocks Private Love Note Whispers Vault',
    badge: '🌹',
  },
  {
    name: 'Eternal Bloom Sovereign',
    minPetals: 500,
    description: 'The highest honor in your bespoke sanctuary.',
    perk: 'Golden Sakura Particle Trail & Secret Dedication',
    badge: '👑',
  },
];

interface BloomRewardsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  petals: number;
  activities: BloomActivity[];
  userName: string;
  onClaimDailyPetals?: () => void;
  hasClaimedDailyToday?: boolean;
}

export const BloomRewardsDashboard: React.FC<BloomRewardsDashboardProps> = ({
  isOpen,
  onClose,
  petals,
  activities,
  userName,
  onClaimDailyPetals,
  hasClaimedDailyToday = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'history'>('overview');

  // Determine current tier
  const currentTier = [...BLOOM_TIERS].reverse().find((t) => petals >= t.minPetals) || BLOOM_TIERS[0];
  const nextTierIndex = BLOOM_TIERS.findIndex((t) => t.name === currentTier.name) + 1;
  const nextTier = nextTierIndex < BLOOM_TIERS.length ? BLOOM_TIERS[nextTierIndex] : null;

  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((petals - currentTier.minPetals) / (nextTier.minPetals - currentTier.minPetals)) * 100
        )
      )
    : 100;

  const handleClaim = () => {
    if (onClaimDailyPetals && !hasClaimedDailyToday) {
      romanticAudio.playVaultUnlock();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fda4af', '#f43f5e', '#fbcfe8', '#fef08a']
      });
      onClaimDailyPetals();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all my-6 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close Bloom Rewards"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-200 to-pink-100 dark:from-rose-950 dark:to-stone-800 flex items-center justify-center text-rose-600 shadow-inner flex-shrink-0">
                <Trophy className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-stone-100">
                    Bloom Rewards Sanctuary
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-medium">
                    {currentTier.badge} {currentTier.name}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Earn digital flower petals through games, daily love notes, and poetry.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl mb-6 text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tiers')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'tiers'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Sanctuary Ranks (5)
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Petal Ledger ({activities.length})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Balance & Progress Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-amber-50/30 dark:from-rose-950/30 dark:via-stone-900 dark:to-stone-900 border border-rose-100 dark:border-stone-800 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">
                        Total Petals Gathered
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
                          {petals}
                        </span>
                        <span className="text-sm font-medium text-rose-500">🌸 Petals</span>
                      </div>
                    </div>

                    {/* Daily Claim Box */}
                    <div className="text-right sm:text-right">
                      {!hasClaimedDailyToday ? (
                        <button
                          onClick={handleClaim}
                          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-medium shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Gift className="w-4 h-4" />
                          <span>Claim Daily +25 Petals</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Daily Blessing Claimed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {nextTier && (
                    <div className="mt-4 pt-3 border-t border-rose-100 dark:border-stone-800">
                      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 mb-2">
                        <span>Current: <strong>{currentTier.name}</strong></span>
                        <span>Next: <strong>{nextTier.name}</strong> ({nextTier.minPetals} 🌸)</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-300 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                        Earn {nextTier.minPetals - petals} more petals to unlock <em>{nextTier.perk}</em>.
                      </p>
                    </div>
                  )}
                </div>

                {/* How to Earn Petals Grid */}
                <div>
                  <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100 mb-3">
                    Ways to Gather Petals for {userName || 'Sophia'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { title: 'Open Daily Love Note', petals: '+30 🌸', desc: 'Read and listen to your fresh daily romantic message.' },
                      { title: 'Play Interactive Games', petals: '+15–25 🌸', desc: 'Pluck sakura petals, memory match, or catch falling stars.' },
                      { title: 'Analyze & Describe Art', petals: '+20 🌸', desc: 'Explore or upload an image to receive poetic lines.' },
                      { title: 'Listen to AI Audio Lines', petals: '+10 🌸', desc: 'Listen to poems recited aloud in soothing female voice.' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="font-medium text-stone-800 dark:text-stone-200">{item.title}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                        <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">
                          {item.petals}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Tiers */}
            {activeTab === 'tiers' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {BLOOM_TIERS.map((tier) => {
                  const isUnlocked = petals >= tier.minPetals;
                  return (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                          : 'bg-stone-50/50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.badge}</span>
                          <span className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                            {tier.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {tier.minPetals} Petals
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-2 font-light">
                        {tier.description}
                      </p>
                      <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Perk: {tier.perk}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: History */}
            {activeTab === 'history' && (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {activities.length === 0 ? (
                  <p className="text-center py-8 text-xs text-stone-400 dark:text-stone-500 font-light">
                    No petals recorded yet. Play a game or open your Daily Love Note to begin!
                  </p>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <div>
                          <p className="font-medium text-stone-800 dark:text-stone-200">{act.title}</p>
                          <span className="text-[10px] text-stone-400">{act.timestamp}</span>
                        </div>
                      </div>
                      <span className="font-bold text-rose-500">+{act.petals} 🌸</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
