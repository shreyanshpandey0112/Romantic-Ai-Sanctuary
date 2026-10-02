import { romanticAudio } from './audioSynth';

export class AiVoiceSynthesizer {
  private static isSpeaking = false;

  public static isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Find the most soothing, expressive female English voice
  private static getBestFemaleVoice(): SpeechSynthesisVoice | null {
    if (!this.isSpeechSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const maleNames = ['david', 'mark', 'george', 'daniel', 'james', 'richard', 'alex', 'fred', 'oliver', 'thomas', 'guy', 'male'];

    // 1. Look for known high-quality female voices
    const preferredFemaleNames = [
      'google uk english female',
      'samantha',
      'victoria',
      'karen',
      'microsoft zira',
      'zira',
      'moira',
      'tessa',
      'fiona',
      'serena',
      'ava',
      'allison',
      'jenny',
      'aria',
      'susan',
      'catherine',
      'female'
    ];

    for (const name of preferredFemaleNames) {
      const match = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          v.name.toLowerCase().includes(name) &&
          !maleNames.some((m) => v.name.toLowerCase().includes(m))
      );
      if (match) return match;
    }

    // 2. Look for any English voice not explicitly male
    const anyFemaleEnglish = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        !maleNames.some((m) => v.name.toLowerCase().includes(m))
    );
    if (anyFemaleEnglish) return anyFemaleEnglish;

    // 3. Fallback to first English voice
    return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  public static speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      volume?: number; // 0.0 to 1.0
      pitch?: number;
      rate?: number;
    }
  ): void {
    if (!this.isSpeechSupported()) {
      romanticAudio.playCardMatch();
      options?.onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean formatting for crystal-clear female narration
      const cleanText = text
        .replace(/[*_#~`]/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Maximum clear audio loudness
      const volumeLevel = options?.volume !== undefined ? Math.max(0.1, Math.min(1.0, options.volume)) : 1.0;
      utterance.volume = volumeLevel;
      utterance.rate = options?.rate || 0.88; // Poetic cadence
      utterance.pitch = options?.pitch || 1.1; // Warm, sweet female tone

      const femaleVoice = this.getBestFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-US';
      }

      // Duck background music for clarity
      romanticAudio.duckForVoice(true);

      utterance.onstart = () => {
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        romanticAudio.duckForVoice(false);
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        romanticAudio.duckForVoice(false);
        options?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      romanticAudio.duckForVoice(false);
      options?.onEnd?.();
    }
  }

  public static stop(): void {
    if (this.isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    romanticAudio.duckForVoice(false);
  }

  public static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
