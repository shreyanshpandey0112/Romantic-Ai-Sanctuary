export interface UserProfile {
  name: string;
  birthday: string; // ISO date 'YYYY-MM-DD' or 'MM-DD'
  vibeTitle: string;
}

export interface AnimeImageItem {
  id: string;
  title: string;
  imageUrl: string;
  poeticDescription: string;
  animeVibe: string;
  whisper: string;
  colorPalette: string[];
  englishPoem: string;
  likes: number;
  isLiked?: boolean;
  dateAdded: string;
}

export interface PoetryItem {
  id: string;
  title: string;
  poetryLines: string;
  meaning: string;
  mood: 'romantic' | 'deep' | 'sweet' | 'birthday' | 'stars';
  author: string;
  isFavorite?: boolean;
}

export type ShayariItem = PoetryItem;

export interface DailyLoveNote {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  whisperQuote: string;
  waxSealColor: string;
  isRead: boolean;
  savedToKeepsakes: boolean;
}

export interface BloomActivity {
  id: string;
  title: string;
  petals: number;
  timestamp: string;
  category: 'game' | 'note' | 'poetry' | 'vision' | 'sound';
}

export interface BloomTier {
  name: string;
  minPetals: number;
  description: string;
  perk: string;
  badge: string;
}

export interface SecretNote {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  waxSealColor: string;
}

export interface MemoryCard {
  id: number;
  pairId: number;
  symbol: string;
  name: string;
  meaning: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  vibe: string;
  audioKey: 'piano' | 'acoustic' | 'ambient' | 'harp';
}
