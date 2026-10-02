import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Volume2, Bookmark, Check, Calendar, ArrowRight, RefreshCw, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyLoveNote as DailyLoveNoteType } from '../types';
import { romanticAudio } from '../utils/audioSynth';
import { AiVoiceSynthesizer } from '../utils/aiVoice';

const DAILY_LOVE_NOTE_PRESETS: Array<{ title: string; content: string; quote: string }> = [
  {
    title: 'The Grace You Bring to Ordinary Hours',
    content: `There is a rare stillness in the way you perceive the world. While everyone rushes past the quiet nuances of the morning, you notice the slant of sunlight through the leaves, the fragile petals resting on the stone, and the unspoken tenderness between people. You remind me that beauty is not something we seek in grand spectacles—it is simply how you exist within this day.`,
    quote: '“You are the stillness where the morning sings.”',
  },
  {
    title: 'In the Quiet Horizon of Your Thoughts',
    content: `Whenever I wonder what grace looks like in its purest form, I think of your patience. The universe has a thousand ways of unfolding, but none quite as miraculous as your quiet laughter when something unexpected delights you. May today greet you with as much kindness as you have so freely given to others.`,
    quote: '“Soft as cherry blossom breath, wild as twilight gold.”',
  },
  {
    title: 'A Constellation of Little Miracles',
    content: `If you could step outside of yourself for just a fleeting second, you would realize the profound comfort your presence creates. You do not have to perform, achieve, or prove anything today; your gentle spirit, your genuine curiosity, and your honest heart are more than enough. You make this world infinitely softer simply by breathing in it.`,
    quote: '“No verse in all the centuries could match the music of your heart.”',
  },
  {
    title: 'Between the Starlight and the Sea',
    content: `Today, take a moment to pause. Look at the sky and remember that the same quiet harmony that guides the constellations is present in you. Whatever dreams you hold in your heart this morning, trust that they are growing in their own time, petal by petal, under a patient sky.`,
    quote: '“Trust the gentle unfolding of your sweetest dawn.”',
  },
];

interface DailyLoveNoteProps {
  userName: string;
  onEarnPetals: (amount: number, reason: string) => void;
  onSaveToKeepsakes?: (note: DailyLoveNoteType) => void;
}

export const DailyLoveNote: React.FC<DailyLoveNoteProps> = ({
  userName,
  onEarnPetals,
  onSaveToKeepsakes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAwardedPetals, setHasAwardedPetals] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  // Load or initialize today's note
  const [currentNote, setCurrentNote] = useState<DailyLoveNoteType>(() => {
    const saved = localStorage.getItem(`daily_love_note_${todayStr}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const seed = new Date().getDate();
    const preset = DAILY_LOVE_NOTE_PRESETS[seed % DAILY_LOVE_NOTE_PRESETS.length];
    return {
      id: `daily-note-${todayStr}`,
      date: todayStr,
      title: preset.title,
      content: preset.content,
      whisperQuote: preset.quote,
      waxSealColor: '#FDA4AF',
      isRead: false,
      savedToKeepsakes: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(`daily_love_note_${todayStr}`, JSON.stringify(currentNote));
  }, [currentNote, todayStr]);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      romanticAudio.playVaultUnlock();
      setIsOpen(true);
      if (!hasAwardedPetals) {
        onEarnPetals(30, 'Opened Daily Love Note');
        setHasAwardedPetals(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#fda4af', '#fbcfe8', '#fef08a']
        });
      }
      setCurrentNote((prev) => ({ ...prev, isRead: true }));
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      AiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    romanticAudio.playTenderNote(659.25, 0.4, 'sine', 0.25);
    const speechText = `${currentNote.title}. ${currentNote.content} ${currentNote.whisperQuote}`;

    AiVoiceSynthesizer.speak(speechText, {
      volume: 1.0,
      rate: 0.88,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSave = () => {
    setIsSaved(true);
    romanticAudio.playPetalTouch();
    setCurrentNote((prev) => ({ ...prev, savedToKeepsakes: true }));
    if (onSaveToKeepsakes) {
      onSaveToKeepsakes(currentNote);
    }
    onEarnPetals(10, 'Saved Love Note to Keepsakes');
  };

  const handleGenerateFreshNote = async () => {
    setIsGenerating(true);
    romanticAudio.playPetalTouch();

    try {
      const response = await fetch('/api/generate-shayari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || 'Beloved Muse',
          mood: 'intimate romantic daily reflection and peace',
        }),
      });

      const data = await response.json();
      if (data && (data.poetryLines || data.meaning)) {
        const newNote: DailyLoveNoteType = {
          id: `daily-note-${Date.now()}`,
          date: todayStr,
          title: data.title || `Morning Whispers for ${userName || 'You'}`,
          content: `${data.meaning || 'A tender daily reminder of how much light you bring.'}\n\n${data.poetryLines || ''}`,
          whisperQuote: '“You are the calm after the storm, the sunlight on the sea.”',
          waxSealColor: '#FDA4AF',
          isRead: true,
          savedToKeepsakes: false,
        };
        setCurrentNote(newNote);
        setIsOpen(true);
        setIsSaved(false);
      }
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section id="daily-love-note" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Editorial Section Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-xs text-rose-500 font-medium mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span>Daily Love Note</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100">
          A Fresh Note for {userName || 'Sophia'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light mt-1">
          An intimate thought penned each day exclusively for your spirit.
        </p>
      </div>

      {/* Main Interactive Letter Container */}
      <div className="relative mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Envelope State */
            <motion.div
              key="sealed-envelope"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleOpenEnvelope}
              className="cursor-pointer group relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FBF7F0] dark:from-stone-900 dark:to-stone-950 border border-stone-200/90 dark:border-stone-800 shadow-xl hover:shadow-2xl hover:border-rose-300 dark:hover:border-rose-900 transition-all duration-500 text-center select-none"
            >
              {/* Envelope Flap Accent */}
              <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-300 dark:fill-rose-900" />
              </div>

              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-widest block mb-2">
                Handwritten with Devotion
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-800 dark:text-stone-100 mb-2">
                “{currentNote.title}”
              </h3>

              <p className="font-serif italic text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
                Tap to break the wax seal, reveal today’s message, and gather +30 digital flower petals.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-md shadow-rose-200 dark:shadow-none group-hover:scale-105 active:scale-95 transition-all">
                <span>Break Wax Seal & Read</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ) : (
            /* Unfolded Linen Letter State */
            <motion.div
              key="unfolded-letter"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 sm:p-10 rounded-3xl bg-[#FFFDFB] dark:bg-[#15121B] border border-rose-200/80 dark:border-stone-800 shadow-2xl backdrop-blur-xl"
            >
              {/* Header inside letter */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-100 dark:border-stone-800/80 text-xs">
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                  <Feather className="w-4 h-4 text-rose-500" />
                  <span className="font-serif italic">{formattedDate}</span>
                </div>

                {/* Actions: Listen Audio / Save */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    className="px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                    title="Listen aloud in gentle female voice"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
                    <span>{isSpeaking ? 'Pause' : 'Listen Aloud 🔊'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className="px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium hover:border-rose-300 transition-colors flex items-center gap-1"
                    title="Save to sanctuary keepsakes"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-rose-500" />
                        <span>Save Note</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateFreshNote}
                    disabled={isGenerating}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                    title="Generate a fresh note with AI"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mb-4 leading-tight">
                {currentNote.title}
              </h3>

              {/* Body Prose */}
              <div className="font-serif text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 font-light">
                <p className="whitespace-pre-line">{currentNote.content}</p>
              </div>

              {/* Handwritten Quote Highlight */}
              <div className="mt-6 pt-5 border-t border-rose-100 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <p className="font-serif italic text-rose-600 dark:text-rose-300 font-medium">
                  {currentNote.whisperQuote}
                </p>
                <span className="text-[11px] text-stone-400 font-serif">
                  Yours always · Dedicated to {userName || 'Sophia'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
