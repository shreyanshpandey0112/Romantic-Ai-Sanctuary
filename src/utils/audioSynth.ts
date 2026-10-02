// Web Audio API generative romantic soundscapes and sound effects

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private loopTimer: any = null;
  private currentVibe: 'piano' | 'acoustic' | 'ambient' | 'harp' = 'piano';
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Temporarily reduce background music when AI speaks so speech is loud and clear
  public duckForVoice(isVoiceActive: boolean) {
    if (!this.masterGain || !this.ctx) return;
    if (isVoiceActive) {
      // Lower background music gently
      this.masterGain.gain.setTargetAtTime(this.volume * 0.2, this.ctx.currentTime, 0.1);
    } else {
      // Restore background music
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.3);
    }
  }

  // Play a single soft dreamy chime note
  public playTenderNote(freq: number, duration: number = 1.2, type: OscillatorType = 'sine', gainLevel = 0.25) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Warm frequency shaping
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Soft envelope (gentle attack, romantic slow decay)
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy guard
    }
  }

  // Play interactive UI feedback sounds
  public playPetalTouch() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    this.playTenderNote(randomNote, 0.8, 'sine', 0.08);
  }

  public playCardMatch() {
    this.playTenderNote(587.33, 0.5, 'sine', 0.12); // D5
    setTimeout(() => {
      this.playTenderNote(880.00, 0.9, 'triangle', 0.15); // A5
    }, 120);
  }

  public playVaultUnlock() {
    const melody = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    melody.forEach((f, idx) => {
      setTimeout(() => {
        this.playTenderNote(f, 1.4, 'triangle', 0.12);
      }, idx * 140);
    });
  }

  // Start background romantic progression
  public startBackgroundMusic(vibe: 'piano' | 'acoustic' | 'ambient' | 'harp' = 'piano') {
    this.currentVibe = vibe;
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.initContext();

    // Harmonic chord progressions (frequencies in Hz)
    // Fmaj7 (F3, A3, C4, E4) -> G (G3, B3, D4, G4) -> Em7 (E3, G3, B3, D4) -> Am7 (A3, C4, E4, G4)
    const chordProgressions = [
      [174.61, 220.00, 261.63, 329.63, 523.25], // Fmaj7
      [196.00, 246.94, 293.66, 392.00, 587.33], // G
      [164.81, 196.00, 246.94, 293.66, 659.25], // Em7
      [220.00, 261.63, 329.63, 392.00, 523.25], // Am7
      [146.83, 220.00, 261.63, 349.23, 698.46], // Dm7
      [196.00, 246.94, 293.66, 349.23, 587.33], // G7
      [261.63, 329.63, 392.00, 493.88, 523.25], // Cmaj7
    ];

    let chordIndex = 0;

    const playNextBar = () => {
      if (!this.isPlaying) return;

      const chord = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      // Arpeggiate notes in the chord gently
      chord.forEach((freq, noteIdx) => {
        setTimeout(() => {
          if (!this.isPlaying) return;
          const oscType = this.currentVibe === 'ambient' ? 'sine' : this.currentVibe === 'harp' ? 'triangle' : 'sine';
          this.playTenderNote(freq, 2.5, oscType, 0.06);
        }, noteIdx * 350);
      });

      // Subtle decorative high chime
      setTimeout(() => {
        if (!this.isPlaying) return;
        const decorativeNotes = [659.25, 783.99, 880.00, 1046.50];
        const randomHigh = decorativeNotes[Math.floor(Math.random() * decorativeNotes.length)];
        this.playTenderNote(randomHigh, 1.8, 'sine', 0.04);
      }, 1800);

      this.loopTimer = setTimeout(playNextBar, 3200);
    };

    playNextBar();
  }

  public stopBackgroundMusic() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  public toggle(vibe: 'piano' | 'acoustic' | 'ambient' | 'harp' = 'piano') {
    if (this.isPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic(vibe);
      return true;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticAudioEngine();
