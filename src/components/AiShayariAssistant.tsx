import React, { useState } from 'react';
import { Sparkles, Volume2, Copy, Check, Heart, Feather, Send, MessageCircleHeart, X } from 'lucide-react';
import { PoetryItem } from '../types';
import { romanticAudio } from '../utils/audioSynth';
import { AiVoiceSynthesizer } from '../utils/aiVoice';
import { FloralDivider } from './FloralDecorations';

interface AiShayariAssistantProps {
  userName: string;
  shayaris: PoetryItem[];
  onAddShayari: (item: PoetryItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AiShayariAssistant: React.FC<AiShayariAssistantProps> = ({
  userName,
  shayaris,
  onAddShayari,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'romantic' | 'deep' | 'sweet' | 'birthday'>('all');
  const [selectedPoem, setSelectedPoem] = useState<PoetryItem>(shayaris[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiVolume, setAiVolume] = useState<number>(1.0); // Maximum Loudness

  const filteredPoems = shayaris.filter((s) => {
    if (activeTab === 'all') return true;
    return s.mood === activeTab;
  });

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      AiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    // Play subtle chime
    romanticAudio.playTenderNote(659.25, 0.4, 'sine', 0.25);

    AiVoiceSynthesizer.speak(text, {
      volume: aiVolume, // Full 100% volume
      rate: 0.88,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCustomPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    romanticAudio.playPetalTouch();

    try {
      const response = await fetch('/api/generate-shayari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || 'Beloved Muse',
          mood: customPrompt.trim(),
        }),
      });

      const data = await response.json();
      if (data && (data.poetryLines || data.shayariText)) {
        const text = data.poetryLines || data.shayariText;
        const newPoem: PoetryItem = {
          id: `custom-poem-${Date.now()}`,
          title: data.title || `For ${userName || 'You'}`,
          poetryLines: text,
          meaning: data.meaning || data.translation || 'Composed exclusively for your heart.',
          mood: 'romantic',
          author: `AI Poet for ${userName || 'You'}`,
          isFavorite: true,
        };

        onAddShayari(newPoem);
        setSelectedPoem(newPoem);
        setCustomPrompt('');
        romanticAudio.playVaultUnlock();
      }
    } catch (err) {
      console.error('Poem gen error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/70 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Romantic AI Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-rose-100 dark:border-stone-800">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-purple-200 dark:from-rose-950 dark:to-purple-900 flex items-center justify-center text-rose-600 shadow-md relative flex-shrink-0 animate-pulse-glow">
            <MessageCircleHeart className="w-7 h-7 text-rose-500 fill-current" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 dark:text-rose-100">
                Aura — Your Romantic Poetry Companion
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 font-medium">
                Audio Ready for {userName || 'You'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              “Welcome, beautiful {userName}. I am here to recite tender English romantic lines and verses whenever you wish to listen.”
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Categories & List (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-rose-50 dark:bg-stone-800/80 rounded-2xl border border-rose-100 dark:border-stone-700/60 overflow-x-auto text-xs font-medium">
              {[
                { id: 'all', label: 'All Poems' },
                { id: 'romantic', label: 'Romantic' },
                { id: 'deep', label: 'Deep' },
                { id: 'sweet', label: 'Sweet' },
                { id: 'birthday', label: 'Birthday 🎂' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-300 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-rose-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredPoems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    romanticAudio.playPetalTouch();
                    setSelectedPoem(item);
                  }}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
                    selectedPoem.id === item.id
                      ? 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 shadow-xs'
                      : 'bg-white/80 dark:bg-stone-800/60 border-rose-100 dark:border-stone-700/60 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-rose-600 dark:text-rose-300 truncate max-w-[170px]">
                      {item.title || 'Romantic Lines'}
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">{item.mood}</span>
                  </div>
                  <p className="font-serif text-xs text-stone-800 dark:text-stone-200 line-clamp-2 italic leading-relaxed">
                    “{(item.poetryLines || (item as any).shayariText).replace(/\n/g, ' ')}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Reciter Card & Custom Prompt (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            {/* Active Recital Showcase */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/40 dark:via-stone-800 dark:to-purple-950/40 border border-rose-200/80 dark:border-rose-900/60 relative shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Feather className="w-4 h-4" /> Recitation with Audio
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold tracking-wider">
                    LOUD 🔊 100%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Volume Booster Slider */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 dark:bg-stone-800 rounded-full border border-rose-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 shadow-xs">
                    <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-medium">{Math.round(aiVolume * 100)}%</span>
                    <input
                      type="range"
                      min="0.4"
                      max="1.0"
                      step="0.1"
                      value={aiVolume}
                      onChange={(e) => setAiVolume(parseFloat(e.target.value))}
                      className="w-14 accent-rose-500 h-1 bg-rose-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                      title="AI Voice Volume Boost"
                    />
                  </div>

                  <button
                    onClick={() => handleSpeak(selectedPoem.poetryLines || (selectedPoem as any).shayariText)}
                    className="p-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-medium px-3.5"
                    title="Speak poem aloud at maximum volume"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
                    <span>{isSpeaking ? 'Pause' : 'Listen Loud 🔊'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(selectedPoem.poetryLines || (selectedPoem as any).shayariText, selectedPoem.id)}
                    className="p-2 rounded-full bg-white dark:bg-stone-800 border border-rose-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-rose-500 transition-colors"
                    title="Copy Poem"
                  >
                    {copiedId === selectedPoem.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-serif text-xl sm:text-2xl font-medium text-stone-900 dark:text-rose-100 mb-2">
                {selectedPoem.title}
              </h4>

              {/* Main English Poetry Lines Display */}
              <p className="font-serif text-base sm:text-lg text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed italic font-normal my-4">
                {selectedPoem.poetryLines || (selectedPoem as any).shayariText}
              </p>

              {/* Meaning / Sentiment */}
              {(selectedPoem.meaning || (selectedPoem as any).translation) && (
                <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  <span className="font-semibold text-rose-500">Poetic Sentiment: </span>
                  {selectedPoem.meaning || (selectedPoem as any).translation}
                </div>
              )}

              <div className="mt-4 text-[11px] text-stone-400 dark:text-stone-500 italic text-right">
                {selectedPoem.author}
              </div>
            </div>

            {/* Custom AI English Poetry Prompt Box */}
            <form onSubmit={handleGenerateCustomPoem} className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-rose-200/70 dark:border-stone-700/60 shadow-xs space-y-3">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Ask AI to write romantic English poetry for you:
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Her radiant smile, starlight night, eternal love, or gentle eyes..."
                  className="flex-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-stone-700 bg-rose-50/40 dark:bg-stone-900 text-stone-800 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !customPrompt.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white text-xs font-medium shadow-xs flex items-center gap-1.5"
                >
                  <Send className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Writing...' : 'Compose'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
