import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_ANIME_IMAGES, INITIAL_SHAYARIS, INITIAL_SECRET_NOTES } from './data/initialContent';
import { AnimeImageItem, PoetryItem, SecretNote, BloomActivity, DailyLoveNote as DailyLoveNoteType } from './types';
import { PetalCanvas } from './components/PetalCanvas';
import { Navbar } from './components/Navbar';
import { ParallaxHero } from './components/ParallaxHero';
import { DailyLoveNote } from './components/DailyLoveNote';
import { BirthdayCountdownBanner } from './components/BirthdayCountdownBanner';
import { AiImageStudio } from './components/AiImageStudio';
import { AiShayariAssistant } from './components/AiShayariAssistant';
import { GamesHub } from './components/GamesHub';
import { FinalCinematicSection } from './components/FinalCinematicSection';
import { BloomRewardsDashboard } from './components/BloomRewardsDashboard';
import { SecretVaultModal } from './components/SecretVaultModal';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { PetalPluckerGame } from './components/PetalPluckerGame';
import { FallingHeartsGame } from './components/FallingHeartsGame';
import { LoginModal } from './components/LoginModal';
import { MusicPlayerOverlay } from './components/MusicPlayerOverlay';
import { Footer } from './components/Footer';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('muse_theme') === 'dark';
  });

  // User profile state
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('muse_name') || 'Sophia';
  });
  const [birthday, setBirthday] = useState<string>(() => {
    return localStorage.getItem('muse_bday') || '';
  });
  const [vibeTitle, setVibeTitle] = useState<string>(() => {
    return localStorage.getItem('muse_title') || 'Ethereal Anime Muse & Dreamer';
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Bloom Rewards state
  const [petals, setPetals] = useState<number>(() => {
    const saved = localStorage.getItem('muse_petals');
    return saved ? parseInt(saved, 10) : 65; // Starting balance
  });

  const [activities, setActivities] = useState<BloomActivity[]>(() => {
    const saved = localStorage.getItem('muse_bloom_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'act-init',
        title: 'Entered Digital Sanctuary',
        petals: 65,
        timestamp: 'Today',
        category: 'note',
      },
    ];
  });

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [petalToast, setPetalToast] = useState<{ amount: number; reason: string } | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [hasClaimedDailyToday, setHasClaimedDailyToday] = useState<boolean>(() => {
    return localStorage.getItem(`daily_claimed_${todayStr}`) === 'true';
  });

  // AI Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(() => {
    return !localStorage.getItem('muse_visited_before');
  });

  // Anime images state
  const [animeImages, setAnimeImages] = useState<AnimeImageItem[]>(() => {
    const saved = localStorage.getItem('muse_anime_images');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ANIME_IMAGES;
      }
    }
    return DEFAULT_ANIME_IMAGES;
  });
  const [activeImage, setActiveImage] = useState<AnimeImageItem>(animeImages[0] || DEFAULT_ANIME_IMAGES[0]);

  // Poetry collection
  const [shayaris, setShayaris] = useState<PoetryItem[]>(() => {
    const saved = localStorage.getItem('muse_shayaris');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SHAYARIS;
      }
    }
    return INITIAL_SHAYARIS;
  });

  // Secret vault state
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultNotes, setVaultNotes] = useState<SecretNote[]>(() => {
    const saved = localStorage.getItem('muse_vault_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SECRET_NOTES;
      }
    }
    return INITIAL_SECRET_NOTES;
  });

  // Games state
  const [isMemoryGameOpen, setIsMemoryGameOpen] = useState(false);
  const [isPetalPluckerOpen, setIsPetalPluckerOpen] = useState(false);
  const [isCatchHeartsOpen, setIsCatchHeartsOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('muse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('muse_theme', 'light');
    }
  }, [isDark]);

  // Persist visited
  useEffect(() => {
    localStorage.setItem('muse_visited_before', 'true');
  }, []);

  // Persist petals & activities
  useEffect(() => {
    localStorage.setItem('muse_petals', petals.toString());
  }, [petals]);

  useEffect(() => {
    localStorage.setItem('muse_bloom_activities', JSON.stringify(activities));
  }, [activities]);

  // Persist anime images
  useEffect(() => {
    localStorage.setItem('muse_anime_images', JSON.stringify(animeImages));
  }, [animeImages]);

  // Persist poetry
  useEffect(() => {
    localStorage.setItem('muse_shayaris', JSON.stringify(shayaris));
  }, [shayaris]);

  // Persist vault notes
  useEffect(() => {
    localStorage.setItem('muse_vault_notes', JSON.stringify(vaultNotes));
  }, [vaultNotes]);

  // Earn Bloom Petals Handler
  const earnPetals = (amount: number, reason: string, category: 'game' | 'note' | 'poetry' | 'vision' | 'sound' = 'note') => {
    setPetals((prev) => prev + amount);
    const newAct: BloomActivity = {
      id: `act-${Date.now()}`,
      title: reason,
      petals: amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Show floating toast
    setPetalToast({ amount, reason });
    setTimeout(() => {
      setPetalToast(null);
    }, 2800);
  };

  const handleClaimDailyPetals = () => {
    if (!hasClaimedDailyToday) {
      earnPetals(25, 'Claimed Daily Blessing', 'note');
      setHasClaimedDailyToday(true);
      localStorage.setItem(`daily_claimed_${todayStr}`, 'true');
    }
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSaveProfile = (newName: string, newBirthday: string, newVibe: string) => {
    setUserName(newName);
    setBirthday(newBirthday);
    setVibeTitle(newVibe);
    localStorage.setItem('muse_name', newName);
    localStorage.setItem('muse_bday', newBirthday);
    localStorage.setItem('muse_title', newVibe);
    earnPetals(15, 'Updated Profile Vibe');
  };

  const handleAddAnimeImage = (newImg: AnimeImageItem) => {
    setAnimeImages((prev) => [newImg, ...prev]);
    setActiveImage(newImg);
  };

  const handleToggleLikeImage = (id: string) => {
    setAnimeImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const isLiked = !img.isLiked;
          const updated = {
            ...img,
            isLiked,
            likes: isLiked ? img.likes + 1 : Math.max(0, img.likes - 1),
          };
          if (activeImage.id === id) setActiveImage(updated);
          if (isLiked) {
            earnPetals(5, 'Liked Fine Art Piece', 'vision');
          }
          return updated;
        }
        return img;
      })
    );
  };

  const handleAddShayari = (item: PoetryItem) => {
    setShayaris((prev) => [item, ...prev]);
    earnPetals(20, 'Composed AI Poem', 'poetry');
  };

  const handleAddVaultNote = (newNote: SecretNote) => {
    setVaultNotes((prev) => [newNote, ...prev]);
    earnPetals(25, 'Sealed Note in Safe', 'note');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] dark:bg-[#0B0910] text-stone-800 dark:text-stone-100 transition-colors duration-500 font-sans selection:bg-rose-200 selection:text-rose-900 relative overflow-x-hidden">
      {/* Living Botanical Petal Canvas */}
      <PetalCanvas />

      {/* Floating Petals Toast Notification */}
      <AnimatePresence>
        {petalToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none px-4 py-2.5 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-900/20 text-xs font-medium flex items-center gap-2 backdrop-blur-md"
          >
            <span>+{petalToast.amount} 🌸 Bloom Petals</span>
            <span className="text-white/70">· {petalToast.reason}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Navigation Header */}
      <Navbar
        userName={userName}
        birthday={birthday}
        isDark={isDark}
        petals={petals}
        onToggleTheme={handleToggleTheme}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenDailyNote={() => {
          const el = document.getElementById('daily-love-note');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Sanctuary Stage */}
      <main className="relative z-20">
        {/* Responsive Parallax Hero */}
        <ParallaxHero
          userName={userName}
          vibeTitle={vibeTitle}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenGames={() => {
            const el = document.getElementById('games-arcade');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenDailyNote={() => {
            const el = document.getElementById('daily-love-note');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenRewards={() => setIsRewardsOpen(true)}
          petals={petals}
          totalImages={animeImages.length}
          totalPoems={shayaris.length}
        />

        {/* Daily Love Note Experience */}
        <DailyLoveNote
          userName={userName}
          onEarnPetals={earnPetals}
          onSaveToKeepsakes={(note) => {
            handleAddVaultNote({
              id: note.id,
              title: note.title,
              content: note.content,
              date: note.date,
              author: 'Daily Sanctuary Whispers',
              waxSealColor: note.waxSealColor,
            });
          }}
        />

        {/* Birthday Countdown & Celebration Banner */}
        <BirthdayCountdownBanner
          birthdayStr={birthday}
          userName={userName}
          onOpenBirthdayPicker={() => setIsLoginOpen(true)}
        />

        {/* AI Anime Image Vision & Fine Art Gallery (with Framer Motion Entrance) */}
        <AiImageStudio
          images={animeImages}
          activeImage={activeImage}
          onSelectImage={(img) => setActiveImage(img)}
          onAddImage={handleAddAnimeImage}
          onToggleLike={handleToggleLikeImage}
          userName={userName}
          onEarnPetals={earnPetals}
        />

        {/* Games Arcade Section (4 Games with Petal Rewards) */}
        <GamesHub
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenMemoryMatch={() => setIsMemoryGameOpen(true)}
          onOpenPetalPlucker={() => setIsPetalPluckerOpen(true)}
          onOpenCatchHearts={() => setIsCatchHeartsOpen(true)}
          userName={userName}
          onEarnPetals={earnPetals}
        />

        {/* Final Cinematic Scene */}
        <FinalCinematicSection
          userName={userName}
          petals={petals}
          onRestartExperience={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onOpenRewards={() => setIsRewardsOpen(true)}
        />
      </main>

      {/* Romantic Editorial Footer */}
      <Footer
        userName={userName}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Floating Ambient Music Player (Explicit opt-in, never autoplay) */}
      <MusicPlayerOverlay />

      {/* Bloom Rewards Dashboard Modal */}
      <BloomRewardsDashboard
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        petals={petals}
        activities={activities}
        userName={userName}
        onClaimDailyPetals={handleClaimDailyPetals}
        hasClaimedDailyToday={hasClaimedDailyToday}
      />

      {/* AI Romantic Poetry Lounge (Female Audio Reciter) */}
      <AiShayariAssistant
        userName={userName}
        shayaris={shayaris}
        onAddShayari={handleAddShayari}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Game 1: Secret Safe Modal (Code 143) */}
      <SecretVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        userName={userName}
        notes={vaultNotes}
        onAddNote={handleAddVaultNote}
      />

      {/* Game 2: Keepsake Memory Match */}
      <MemoryMatchGame
        isOpen={isMemoryGameOpen}
        onClose={() => setIsMemoryGameOpen(false)}
        userName={userName}
      />

      {/* Game 3: Loves Me Truly Petal Plucker */}
      <PetalPluckerGame
        isOpen={isPetalPluckerOpen}
        onClose={() => setIsPetalPluckerOpen(false)}
        userName={userName}
      />

      {/* Game 4: Catch Falling Hearts & Starlight Petals */}
      <FallingHeartsGame
        isOpen={isCatchHeartsOpen}
        onClose={() => setIsCatchHeartsOpen(false)}
        userName={userName}
      />

      {/* Personalized Welcome / Login & Birthday Settings Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentName={userName}
        currentBirthday={birthday}
        currentVibeTitle={vibeTitle}
        onSave={handleSaveProfile}
        canDismiss={true}
      />
    </div>
  );
}
