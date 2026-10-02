import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, Volume2, Heart, Copy, Check, Palette, Feather, RefreshCw, Plus, Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimeImageItem } from '../types';
import { romanticAudio } from '../utils/audioSynth';
import { AiVoiceSynthesizer } from '../utils/aiVoice';

interface AiImageStudioProps {
  images: AnimeImageItem[];
  activeImage: AnimeImageItem;
  onSelectImage: (img: AnimeImageItem) => void;
  onAddImage: (newImg: AnimeImageItem) => void;
  onToggleLike: (id: string) => void;
  userName: string;
  onEarnPetals?: (amount: number, reason: string) => void;
}

export const AiImageStudio: React.FC<AiImageStudioProps> = ({
  images,
  activeImage,
  onSelectImage,
  onAddImage,
  onToggleLike,
  userName,
  onEarnPetals,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Upload/Add state
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadVibe, setUploadVibe] = useState('Ethereal Anime, Warm Sunset, Romantic');
  const [previewSrc, setPreviewSrc] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setPreviewSrc(res);
        setUploadUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSpeak = (textToSpeak: string) => {
    if (isSpeaking) {
      AiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    romanticAudio.playTenderNote(659.25, 0.4, 'sine', 0.25);

    AiVoiceSynthesizer.speak(textToSpeak, {
      volume: 1.0, // Maximum loud female sound
      rate: 0.88,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    if (onEarnPetals) {
      onEarnPetals(5, 'Listened to Poetry Recitation');
    }
  };

  const handleAnalyzeNewImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = uploadUrl || previewSrc;
    if (!finalSrc) return;

    setIsAnalyzing(true);
    romanticAudio.playPetalTouch();

    try {
      const isBase64 = finalSrc.startsWith('data:');
      const response = await fetch('/api/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: isBase64 ? finalSrc : undefined,
          imageUrl: !isBase64 ? finalSrc : undefined,
          title: uploadTitle.trim() || 'Custom Romantic Illustration',
          vibe: uploadVibe.trim(),
          userName: userName || 'Beloved Muse',
        }),
      });

      const data = await response.json();
      if (data && data.poeticDescription) {
        const newArt: AnimeImageItem = {
          id: `art-${Date.now()}`,
          title: uploadTitle.trim() || 'Ethereal Anime Reverie',
          imageUrl: finalSrc,
          poeticDescription: data.poeticDescription,
          animeVibe: data.animeVibe || 'Anime Starlight & Twilight',
          whisper: data.whisper || 'Whispered in celestial colors.',
          colorPalette: data.colorPalette || ['#FECDD3', '#E9D5FF', '#FDE68A', '#93C5FD'],
          englishPoem: data.englishPoem || 'Every shade of twilight bows to your enchanting light,\na thousand galaxies unfold to make your journey bright.',
          likes: 1,
          isLiked: true,
          dateAdded: 'Added by ' + (userName || 'You'),
        };

        onAddImage(newArt);
        onSelectImage(newArt);
        setUploadTitle('');
        setUploadUrl('');
        setPreviewSrc('');
        setIsUploadOpen(false);
        romanticAudio.playVaultUnlock();

        if (onEarnPetals) {
          onEarnPetals(25, 'Analyzed Custom Visual Art');
        }
      }
    } catch (err) {
      console.error('Image analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshCurrentCaption = async () => {
    setIsAnalyzing(true);
    romanticAudio.playPetalTouch();
    try {
      const response = await fetch('/api/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeImage.title,
          vibe: activeImage.animeVibe,
          userName: userName || 'Beloved Muse',
        }),
      });
      const data = await response.json();
      if (data && data.poeticDescription) {
        activeImage.poeticDescription = data.poeticDescription;
        activeImage.englishPoem = data.englishPoem || activeImage.englishPoem;
        activeImage.whisper = data.whisper || activeImage.whisper;
        activeImage.animeVibe = data.animeVibe || activeImage.animeVibe;
        romanticAudio.playCardMatch();
      }
    } catch {
      // fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="ai-image-studio" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs text-rose-500 font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Visual Poetry & Image Vision</span>
          <span aria-hidden="true">·</span>
          <span>Fine Art Studio</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 mb-3">
          Where Art Whispers in Poetry
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light max-w-xl mx-auto">
          Our romantic AI analyzes visual emotions, atmospheres, and anime aesthetics, translating every frame into lyrical English poetry and audio for {userName || 'you'}.
        </p>
      </div>

      {/* Main Exhibition Stage */}
      <div className="bg-white/95 dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden backdrop-blur-xl mb-12 flex flex-col lg:flex-row">
        
        {/* Left: Active Anime Image Showcase */}
        <div className="lg:w-1/2 p-6 sm:p-8 bg-stone-950/95 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden group">
          <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Top Badge: Anime Vibe */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-medium border border-white/20">
              {activeImage.animeVibe}
            </div>

            {/* Expand Fullscreen Button */}
            <button
              onClick={() => setIsFullscreenOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
              title="Expand fullscreen"
              aria-label="Expand image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Bottom Whisper Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
              <p className="font-serif text-sm italic drop-shadow">
                “{activeImage.whisper}”
              </p>
            </div>
          </div>

          {/* Action Row below image */}
          <div className="flex items-center justify-between w-full max-w-md mt-4 text-stone-300 text-xs">
            <span className="truncate max-w-[200px] font-serif">{activeImage.title}</span>
            <button
              onClick={() => onToggleLike(activeImage.id)}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors p-1"
            >
              <Heart className={`w-4 h-4 ${activeImage.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{activeImage.likes} Loves</span>
            </button>
          </div>
        </div>

        {/* Right: AI Poetic Analysis, English Poetry & Female Audio Reciter */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Title & Vibe */}
            <div className="flex items-center justify-between text-xs text-rose-500 font-medium mb-1">
              <span>{activeImage.animeVibe}</span>
              <button
                onClick={handleRefreshCurrentCaption}
                disabled={isAnalyzing}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>New AI Inspiration</span>
              </button>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 dark:text-stone-100 mb-3">
              {activeImage.title}
            </h3>

            {/* AI Poetic Description */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif italic mb-4">
              “{activeImage.poeticDescription}”
            </div>

            {/* Color Palette Detected */}
            {activeImage.colorPalette && activeImage.colorPalette.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-xs text-stone-500 dark:text-stone-400">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-medium">Palette:</span>
                <div className="flex items-center gap-1.5">
                  {activeImage.colorPalette.map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Romantic English Poetry Section with Female Audio Reciter */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-purple-50/90 dark:from-rose-950/40 dark:via-stone-800 dark:to-purple-950/40 border border-rose-200/80 dark:border-rose-900/60 mb-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" /> Romantic English Poetry
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(activeImage.englishPoem)}
                    className="px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                    title="Listen to poetry in gentle female voice at maximum volume"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
                    <span>{isSpeaking ? 'Pause' : 'Listen Loud 🔊'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(activeImage.englishPoem, 'english')}
                    className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1"
                  >
                    {copiedText === 'english' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="font-serif text-sm sm:text-base text-stone-800 dark:text-stone-100 whitespace-pre-line leading-relaxed font-normal italic">
                “{activeImage.englishPoem}”
              </p>
            </div>
          </div>

          {/* Footer of card */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>{activeImage.dateAdded}</span>
            <span className="text-rose-500 font-serif italic">Dedicated to {userName || 'Sophia'}</span>
          </div>
        </div>
      </div>

      {/* Gallery Selector of Anime & Custom Images with Framer Motion Entrance */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-stone-100">
              Sanctuary Visual Gallery ({images.length})
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Swipe or tap any scene to experience its poetic story and audio.
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(!isUploadOpen)}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add & Describe Your Image (+25 🌸)</span>
          </button>
        </div>

        {/* Gallery Grid / Mobile Swipe Row with Framer Motion */}
        <motion.div
          className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          <AnimatePresence mode="popLayout">
            {images.map((img) => (
              <motion.div
                key={img.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  romanticAudio.playPetalTouch();
                  onSelectImage(img);
                }}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1.5 bg-white dark:bg-stone-900 shrink-0 w-[240px] sm:w-auto snap-start ${
                  activeImage.id === img.id
                    ? 'border-rose-400 dark:border-rose-500 shadow-md ring-2 ring-rose-200/50 dark:ring-rose-950'
                    : 'border-transparent hover:border-stone-200 dark:hover:border-stone-700 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative group">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <p className="font-serif text-xs font-medium text-stone-800 dark:text-stone-200 truncate mt-2 px-1">
                  {img.title}
                </p>
                <p className="text-[10px] text-rose-500 dark:text-rose-400 px-1 truncate">
                  {img.animeVibe}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            >
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/20"
              />
              <div className="mt-4 text-center text-white">
                <h4 className="font-serif text-lg font-medium">{activeImage.title}</h4>
                <p className="font-serif italic text-xs text-white/70 mt-1">“{activeImage.whisper}”</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add & Describe New Image Form / Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-lg overflow-hidden"
          >
            <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-500" /> Have AI Describe an Image for You
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 font-light">
              Upload an anime art piece, personal photo, or wallpaper. Our AI will compose custom English romantic poetry with audio.
            </p>

            <form onSubmit={handleAnalyzeNewImage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File upload */}
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-rose-300 dark:border-stone-700 hover:border-rose-500 rounded-2xl cursor-pointer bg-white dark:bg-stone-800 p-4 text-center transition-colors">
                  <Upload className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="font-medium text-stone-700 dark:text-stone-200">
                    Choose image file from device
                  </span>
                  <span className="text-[10px] text-stone-400">JPG, PNG, WEBP, GIF</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* URL or preview */}
                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Or paste Image URL:
                    </label>
                    <input
                      type="url"
                      value={uploadUrl}
                      onChange={(e) => {
                        setUploadUrl(e.target.value);
                        setPreviewSrc(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  {previewSrc && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
                      <img src={previewSrc} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
                      <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">Ready for AI Vision!</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Title / Scene Name
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Balcony at Midnight"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Vibe / Atmosphere
                  </label>
                  <input
                    type="text"
                    value={uploadVibe}
                    onChange={(e) => setUploadVibe(e.target.value)}
                    placeholder="e.g. Romantic Anime, Rain, Twilight"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || (!uploadUrl && !previewSrc)}
                  className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-rose-200 dark:shadow-none flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'AI Vision in Progress...' : 'Describe Image (+25 🌸)'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
