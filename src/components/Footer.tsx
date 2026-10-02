import React from 'react';
import { Heart, Sparkles, Feather, Lock, Play, MessageCircleHeart } from 'lucide-react';
import { FloralDivider, FloralCorner } from './FloralDecorations';
import { romanticAudio } from '../utils/audioSynth';

interface FooterProps {
  userName: string;
  onOpenVault: () => void;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ userName, onOpenVault, onOpenAssistant }) => {
  return (
    <footer className="relative bg-rose-50/50 dark:bg-stone-950/80 border-t border-rose-200/50 dark:border-stone-800/60 py-16 px-4 sm:px-6 overflow-hidden">
      <FloralCorner className="absolute top-0 left-0" />
      <FloralCorner className="absolute top-0 right-0 -scale-x-100" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-500 mx-auto mb-4 animate-float-gentle">
          <Heart className="w-6 h-6 fill-current text-rose-400" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-800 dark:text-rose-100 mb-2">
          Forever Inspired by You, {userName || 'Sophia'}
        </h3>
        
        <p className="font-serif italic text-stone-500 dark:text-stone-400 max-w-md mx-auto text-xs sm:text-sm mb-6 leading-relaxed">
          “May your life always bloom with soft starlight, <br />
          and joy forever write its sweetest smile upon your face.”
        </p>

        <FloralDivider className="my-4 opacity-50" />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600 dark:text-stone-400 my-6">
          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenAssistant();
            }}
            className="hover:text-rose-500 dark:hover:text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Romantic Poetry</span>
          </button>

          <span aria-hidden="true" className="text-rose-300">·</span>

          <button
            type="button"
            onClick={() => {
              romanticAudio.playPetalTouch();
              onOpenVault();
            }}
            className="hover:text-rose-500 dark:hover:text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>The Secret Safe</span>
          </button>

          <span aria-hidden="true" className="text-rose-300">·</span>

          <a
            href="#ai-image-studio"
            className="hover:text-rose-500 dark:hover:text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Anime Vision</span>
          </a>
        </div>

        <p className="text-[11px] text-stone-400 dark:text-stone-500">
          Created with devotion, gentle code & starlight · For {userName || 'Sophia'}
        </p>
      </div>
    </footer>
  );
};
