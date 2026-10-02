import React, { useState } from 'react';
import { Lock, Unlock, Key, Heart, Sparkles, X, Plus, Eye, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SecretNote } from '../types';
import { romanticAudio } from '../utils/audioSynth';
import { FloralDivider } from './FloralDecorations';

interface SecretVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  notes: SecretNote[];
  onAddNote: (newNote: SecretNote) => void;
}

export const SecretVaultModal: React.FC<SecretVaultModalProps> = ({
  isOpen,
  onClose,
  userName,
  notes,
  onAddNote,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SecretNote | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  
  // New note form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState(userName || 'Forever Yours');

  if (!isOpen) return null;

  const validCodes = ['143', 'LOVE', '2026', 'SWEET'];

  const handleKeypadPress = (val: string) => {
    romanticAudio.playTenderNote(440 + val.charCodeAt(0) * 2, 0.1, 'sine', 0.05);
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + val);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const handleUnlock = () => {
    const trimmed = pinInput.trim().toUpperCase();
    if (validCodes.includes(trimmed) || trimmed === userName.toUpperCase()) {
      setIsUnlocked(true);
      setErrorMsg('');
      romanticAudio.playVaultUnlock();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#f43f5e', '#fbcfe8', '#fef08a', '#e9d5ff']
      });
    } else {
      setErrorMsg('The lock remains still... listen to your heart and try again.');
      romanticAudio.playTenderNote(220, 0.4, 'sine', 0.1);
    }
  };

  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const waxColors = ['#FDA4AF', '#DDD6FE', '#FDE68A', '#FBCFE8', '#BAE6FD'];
    const randomColor = waxColors[Math.floor(Math.random() * waxColors.length)];

    const note: SecretNote = {
      id: `secret-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      date: 'Just now',
      author: newAuthor.trim() || userName || 'Beloved',
      waxSealColor: randomColor,
    };

    onAddNote(note);
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
    setSelectedNote(note);
    romanticAudio.playPetalTouch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close Vault"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* Safe Lock Interface */
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-200 to-rose-100 dark:from-rose-950 dark:to-stone-800 flex items-center justify-center text-rose-500 shadow-inner mb-4 animate-float-gentle">
              <Lock className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>

            <h3 className="font-serif text-3xl font-medium text-stone-800 dark:text-rose-100 mb-2">
              The Enchanted Secret Vault
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto mb-6">
              A private digital sanctuary created for {userName || 'you'}. Enter the secret passkey to unveil hidden letters, sweet truths, and memories.
            </p>

            {/* Display Screen */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="h-14 bg-rose-50/80 dark:bg-stone-950/70 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center justify-center tracking-[0.3em] font-serif text-2xl font-bold text-rose-600 dark:text-rose-300 shadow-inner px-4">
                {pinInput ? pinInput.replace(/./g, '♥ ') : <span className="text-stone-300 dark:text-stone-600 text-sm tracking-normal font-sans">Enter passcode...</span>}
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-500 mt-2 font-medium animate-pulse">{errorMsg}</p>
              )}
            </div>

            {/* Keypad */}
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2.5 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') handleClear();
                    else if (k === '⌫') handleBackspace();
                    else handleKeypadPress(k);
                  }}
                  className="h-12 rounded-xl bg-stone-50 dark:bg-stone-800 border border-rose-100 dark:border-stone-700 hover:bg-rose-100/70 dark:hover:bg-rose-900/30 text-stone-700 dark:text-stone-200 font-medium text-lg transition-all active:scale-95 shadow-sm"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleUnlock}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium shadow-md shadow-rose-200 dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unlock Safe
              </button>

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 underline underline-offset-4 py-2 px-3"
              >
                {showHint ? 'Hide Hint' : 'Need a Clue? ✨'}
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto text-left">
                <p className="font-semibold text-rose-600 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Whisper from the Keeper:
                </p>
                <p className="italic">
                  “Try typing <strong>143</strong> — the timeless romantic number representing the letters in: <br />
                  <span className="font-medium text-rose-600 dark:text-rose-300">1</span> (I) · <span className="font-medium text-rose-600 dark:text-rose-300">4</span> (Love) · <span className="font-medium text-rose-600 dark:text-rose-300">3</span> (You).”
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Unlocked Vault Sanctuary */
          <div>
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-950 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-500">
                  <Sparkles className="w-5 h-5 text-rose-500 dark:text-rose-300" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-rose-100">
                    Chamber of Secrets Unlocked
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Reserved exclusively for {userName || 'My Dearest Muse'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsComposing(!isComposing)}
                className="px-4 py-2 rounded-full text-xs font-medium bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-200 transition-colors flex items-center gap-1.5"
              >
                {isComposing ? <Eye className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {isComposing ? 'View Letters' : 'Write a Wish'}
              </button>
            </div>

            {isComposing ? (
              /* Write new secret note */
              <form onSubmit={handleSaveNewNote} className="space-y-4">
                <h4 className="text-sm font-serif font-semibold text-rose-600 dark:text-rose-300 flex items-center gap-1.5">
                  <Feather className="w-4 h-4" /> Pen a New Secret Thought or Memory
                </h4>
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., A midnight wish under the balcony..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                    Your Secret Note or Letter
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Pour your heart out here. It will be safely kept inside this vault..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                    Signed by
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-5 py-2 text-xs rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md shadow-rose-200 dark:shadow-none"
                  >
                    Seal in Vault
                  </button>
                </div>
              </form>
            ) : selectedNote ? (
              /* Reading single letter */
              <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-stone-800/80 border border-amber-200/50 dark:border-amber-900/30 relative">
                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="mb-4 text-xs font-medium text-rose-500 hover:underline flex items-center gap-1"
                >
                  ← Back to all letters
                </button>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif text-2xl font-bold text-stone-800 dark:text-rose-100">
                    {selectedNote.title}
                  </h4>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: selectedNote.waxSealColor }}
                  >
                    ♥
                  </div>
                </div>
                <FloralDivider className="my-3 opacity-60" />
                <p className="font-serif text-stone-700 dark:text-stone-200 text-base leading-relaxed whitespace-pre-line my-4 italic">
                  “{selectedNote.content}”
                </p>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-amber-200/30">
                  <span>Date: {selectedNote.date}</span>
                  <span className="font-medium text-rose-500 dark:text-rose-300">Signed: {selectedNote.author}</span>
                </div>
              </div>
            ) : (
              /* List of secret letters & reasons */
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-3">
                    Wax-Sealed Letters ({notes.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          romanticAudio.playPetalTouch();
                          setSelectedNote(note);
                        }}
                        className="cursor-pointer p-4 rounded-2xl bg-rose-50/60 dark:bg-stone-800/60 border border-rose-100 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                            {note.title}
                          </h5>
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm flex-shrink-0 ml-2"
                            style={{ backgroundColor: note.waxSealColor }}
                          >
                            ♥
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-2 font-serif italic">
                          {note.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
                          <span>{note.date}</span>
                          <span className="text-rose-400 group-hover:translate-x-1 transition-transform">Read note →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 Little Truths About You */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 to-pink-50/80 dark:from-stone-800/80 dark:to-rose-950/40 border border-rose-200/60 dark:border-rose-900/40">
                  <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500" /> Five Little Truths About You
                  </h4>
                  <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-2 list-disc list-inside">
                    <li>Your eye for photography turns ordinary light into unforgettable memories.</li>
                    <li>Your smile has an effortless way of changing the energy of an entire room.</li>
                    <li>The dedication and heart you pour into your art is genuinely breathtaking.</li>
                    <li>You are worthy of all the love, gentle days, and warm coffee you could ever desire.</li>
                    <li>This website was made with pure admiration for everything that makes you, you.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
