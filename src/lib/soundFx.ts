// Web Audio API procedural luxury sound effects engine + custom audio support

export type SoundCategory =
  | 'BUTTON_HOVER'
  | 'BUTTON_CLICK'
  | 'PAGE_TRANSITION'
  | 'VIDEO_OPEN'
  | 'REGISTER_CLICK'
  | 'MENU_OPEN'
  | 'SUCCESS'
  | 'ERROR'
  | 'RUNWAY_START'
  | 'RUNWAY_END'
  | 'LOGO_REVEAL';

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.2; // 20% default volume (within 10-25% range)
  private hasInteracted: boolean = false;
  private customSoundFiles: Partial<Record<SoundCategory, string>> = {};

  constructor() {
    try {
      const savedMute = localStorage.getItem('css_sound_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('css_sound_vol');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.2;
      }
      const savedFiles = localStorage.getItem('css_custom_sounds');
      if (savedFiles) {
        this.customSoundFiles = JSON.parse(savedFiles);
      }
    } catch {}

    // Unlock Web Audio on first user interaction
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.hasInteracted = true;
        this.initContext();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isUnlocked(): boolean {
    return this.hasInteracted && this.ctx !== null;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('css_sound_muted', String(this.muted));
    } catch {}
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    try {
      localStorage.setItem('css_sound_muted', String(this.muted));
    } catch {}
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0.05, Math.min(0.5, vol));
    try {
      localStorage.setItem('css_sound_vol', String(this.volume));
    } catch {}
  }

  public setCustomSoundFile(category: SoundCategory, url: string) {
    this.customSoundFiles[category] = url;
    try {
      localStorage.setItem('css_custom_sounds', JSON.stringify(this.customSoundFiles));
    } catch {}
  }

  public getCustomSoundFiles(): Partial<Record<SoundCategory, string>> {
    return { ...this.customSoundFiles };
  }

  // Play category-specific sound
  public play(category: SoundCategory) {
    if (this.muted) return;

    // Check if custom audio file is provided
    const customUrl = this.customSoundFiles[category];
    if (customUrl && customUrl.trim().length > 0) {
      try {
        const audio = new Audio(customUrl);
        audio.volume = this.volume;
        audio.play().catch(() => {});
        return;
      } catch {}
    }

    // High-fidelity procedural Web Audio synthesis fallback
    this.initContext();
    if (!this.ctx) return;

    switch (category) {
      case 'BUTTON_HOVER':
        this.playHoverSound();
        break;
      case 'BUTTON_CLICK':
        this.playClickSound();
        break;
      case 'PAGE_TRANSITION':
        this.playWhooshSound();
        break;
      case 'VIDEO_OPEN':
        this.playVideoOpenSound();
        break;
      case 'REGISTER_CLICK':
        this.playRegisterClickSound();
        break;
      case 'MENU_OPEN':
        this.playMenuOpenSound();
        break;
      case 'SUCCESS':
        this.playChimeSound();
        break;
      case 'ERROR':
        this.playErrorSound();
        break;
      case 'RUNWAY_START':
        this.playRunwayStartSound();
        break;
      case 'RUNWAY_END':
        this.playRunwayEndSound();
        break;
      case 'LOGO_REVEAL':
        this.playLogoRevealSound();
        break;
    }
  }

  // 1. Tactile 3D Gold Button Click
  public playClickSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  // 2. Soft Gold Shimmer Hover
  public playHoverSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1540, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // 3. Runway Cushioned Step Sound
  public playRunwayStepSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  // 4. Haute Couture Whoosh / Page Transition
  public playWhooshSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.16);
      filter.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.35, this.ctx.currentTime + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // 5. Celestial Gold Success Chime
  public playChimeSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.45);
      });
    } catch {}
  }

  // 6. Video Open Cinema Sound
  public playVideoOpenSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {}
  }

  // 7. Register Click Resonant Bell
  public playRegisterClickSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      [659.25, 987.77].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.03);
        gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.03);
        osc.stop(this.ctx.currentTime + 0.35);
      });
    } catch {}
  }

  // 8. Menu Open Soft Swell
  public playMenuOpenSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  // 9. Error Soft Low Tone
  public playErrorSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.setValueAtTime(150, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // 10. Runway Start Cinematic Low Bass & Rise
  public playRunwayStartSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Deep cinematic sub-bass heartbeat
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(65, this.ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.6);
      subGain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start();
      sub.stop(this.ctx.currentTime + 0.7);

      // Warm shimmering atmosphere
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(440, this.ctx.currentTime);
      shimmer.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);
      sGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      sGain.gain.linearRampToValueAtTime(this.volume * 0.2, this.ctx.currentTime + 0.3);
      sGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      shimmer.connect(sGain);
      sGain.connect(this.ctx.destination);
      shimmer.start();
      shimmer.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }

  // 11. Runway End Orchestral Impact
  public playRunwayEndSound() {
    this.playChimeSound();
    this.playWhooshSound();
  }

  // 12. Logo Reveal Celestial Sparkle
  public playLogoRevealSound() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      [880, 1174.66, 1318.51, 1760].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch {}
  }
}

export const soundFx = new SoundEffectsEngine();
