import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { MusicTrack } from '../types';
import { romanticAudio } from '../utils/audioSynth';

const TRACKS: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Clair de Lune & Soft Petals',
    artist: 'Sanctuary Atelier',
    duration: '3:45',
    vibe: 'Dreamy Grand Piano',
    audioKey: 'piano',
  },
  {
    id: 'track-2',
    title: 'Golden Sunset Reverie',
    artist: 'Acoustic Whispers',
    duration: '4:12',
    vibe: 'Warm Romantic Acoustic',
    audioKey: 'acoustic',
  },
  {
    id: 'track-3',
    title: 'Midnight Starlight Waltz',
    artist: 'Velvet Lo-Fi Romance',
    duration: '3:20',
    vibe: 'Atmospheric Ambient Chords',
    audioKey: 'ambient',
  },
  {
    id: 'track-4',
    title: 'Sakura Petals & Ethereal Harp',
    artist: 'Celestial Garden Ensemble',
    duration: '3:50',
    vibe: 'Celestial Gentle Harp',
    audioKey: 'harp',
  },
];

export const MusicPlayerOverlay: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      romanticAudio.startBackgroundMusic(currentTrack.audioKey);
    } else {
      romanticAudio.stopBackgroundMusic();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      romanticAudio.stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      romanticAudio.startBackgroundMusic(currentTrack.audioKey);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    romanticAudio.playPetalTouch();
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    romanticAudio.playPetalTouch();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    romanticAudio.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      romanticAudio.setVolume(volume);
    } else {
      setIsMuted(true);
      romanticAudio.setVolume(0);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Expanded Player Window */}
      {isExpanded ? (
        <div className="w-80 bg-white/95 dark:bg-stone-900/95 border border-rose-200/80 dark:border-rose-900/60 rounded-3xl shadow-2xl p-5 backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-950 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 text-rose-500 ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-xs font-serif font-semibold text-rose-600 dark:text-rose-300">
                Romantic Melody Player
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
              aria-label="Minimize player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Track Info */}
          <div className="text-center my-3">
            <h4 className="font-serif text-base font-medium text-stone-900 dark:text-rose-100 truncate">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {currentTrack.artist} · <span className="text-rose-500">{currentTrack.vibe}</span>
            </p>
          </div>

          {/* Visualizer Waves */}
          <div className="flex items-center justify-center gap-1.5 h-8 my-3">
            {[40, 70, 95, 60, 85, 45, 90, 65, 35].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-rose-400/80 dark:bg-rose-400 rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (volume > 0 ? volume : 0.1)))}%` : '20%',
                  animation: isPlaying ? `pulseGlow ${0.6 + i * 0.15}s ease-in-out infinite alternate` : 'none',
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 my-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-stone-800 transition-colors active:scale-95"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-stone-800 transition-colors active:scale-95"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-rose-100 dark:border-stone-800">
            <button
              onClick={toggleMute}
              className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full accent-rose-400 h-1.5 bg-rose-100 dark:bg-stone-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      ) : (
        /* Minimized Floating Pill */
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 border border-rose-200 dark:border-rose-900/70 shadow-lg hover:shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-stone-700 dark:text-rose-200"
        >
          <div className="relative flex items-center justify-center">
            <Disc className={`w-4 h-4 text-rose-500 ${isPlaying ? 'animate-spin' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </div>
          <span className="text-xs font-serif font-medium truncate max-w-[130px]">
            {isPlaying ? currentTrack.title : 'Play Melodies'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-500 transition-colors" />
        </button>
      )}
    </div>
  );
};
