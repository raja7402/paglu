import pagluConfig from '../config/pagluConfig';

/**
 * Cosmic Audio & Sound Design Engine
 * - Strictly respects browser autoplay policies: never plays audio prior to user interaction.
 * - Plays royalty-free / user-configured audio tracks from pagluConfig.js with smooth fades.
 * - Synthesizes tactile cosmic UI & game sound effects via Web Audio API.
 */
class CosmicSoundEngine {
  constructor() {
    this.ctx = null;
    this.hasInteracted = false;
    this.isPlaying = false;
    this.isMuted = false;
    this.sfxEnabled = pagluConfig.music?.enableSoundEffects ?? true;
    this.volume = pagluConfig.music?.defaultVolume ?? 0.55;
    this.currentTrackKey = 'galaxy';
    this.audioElements = {};
    this.fadeInterval = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getState();
    this.listeners.forEach((fn) => fn(snapshot));
  }

  getState() {
    return {
      hasInteracted: this.hasInteracted,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      sfxEnabled: this.sfxEnabled,
      volume: this.volume,
      currentTrackKey: this.currentTrackKey
    };
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getOrCreateTrack(trackKey) {
    if (typeof window === 'undefined') return null;
    if (this.audioElements[trackKey]) {
      return this.audioElements[trackKey];
    }
    const trackCfg = pagluConfig.music?.tracks?.[trackKey];
    if (!trackCfg?.src) return null;

    const audio = new Audio(trackCfg.src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    this.audioElements[trackKey] = audio;
    return audio;
  }

  /**
   * Called on first explicit user gesture (e.g., clicking "ENTER THE UNKNOWN" or Play button)
   */
  unlockAudioFromGesture(autoStartMusic = true) {
    this.hasInteracted = true;
    this.ensureContext();
    if (autoStartMusic && !this.isPlaying && !this.isMuted) {
      this.playMusic(this.currentTrackKey);
    } else {
      this.notify();
    }
  }

  playMusic(trackKey = this.currentTrackKey) {
    this.hasInteracted = true;
    this.ensureContext();
    this.currentTrackKey = trackKey;

    const targetAudio = this.getOrCreateTrack(trackKey);
    if (!targetAudio) return;

    // Fade out any other track
    Object.entries(this.audioElements).forEach(([key, el]) => {
      if (key !== trackKey && !el.paused) {
        this.smoothVolume(el, 0, 500, () => el.pause());
      }
    });

    const effectiveVol = this.isMuted ? 0 : this.volume;
    targetAudio.play()
      .then(() => {
        this.isPlaying = true;
        this.smoothVolume(targetAudio, effectiveVol, 900);
        this.notify();
      })
      .catch(() => {
        // Autoplay blocked or file missing; remain safely paused without console spam
        this.isPlaying = false;
        this.notify();
      });
  }

  pauseMusic() {
    const current = this.audioElements[this.currentTrackKey];
    if (current && !current.paused) {
      this.smoothVolume(current, 0, 350, () => {
        current.pause();
      });
    }
    this.isPlaying = false;
    this.notify();
  }

  togglePlay() {
    this.hasInteracted = true;
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      if (this.isMuted) {
        this.isMuted = false;
      }
      this.playMusic(this.currentTrackKey);
    }
  }

  switchTrack(trackKey) {
    if (this.currentTrackKey === trackKey) return;
    this.currentTrackKey = trackKey;
    if (this.isPlaying) {
      this.playMusic(trackKey);
    } else {
      this.notify();
    }
  }

  setVolume(newVol) {
    const clamped = Math.max(0, Math.min(1, Number(newVol)));
    this.volume = clamped;
    if (clamped > 0 && this.isMuted) {
      this.isMuted = false;
    }
    const current = this.audioElements[this.currentTrackKey];
    if (current && this.isPlaying) {
      current.volume = this.isMuted ? 0 : clamped;
    }
    this.notify();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const current = this.audioElements[this.currentTrackKey];
    if (current) {
      this.smoothVolume(current, this.isMuted ? 0 : this.volume, 250);
    }
    this.notify();
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.notify();
  }

  smoothVolume(audioEl, targetVol, durationMs = 500, onComplete) {
    if (!audioEl) return;
    if (audioEl._fadeTimer) clearInterval(audioEl._fadeTimer);
    const startVol = audioEl.volume;
    const steps = 16;
    const stepTime = Math.max(16, Math.floor(durationMs / steps));
    let step = 0;

    audioEl._fadeTimer = setInterval(() => {
      step += 1;
      const ratio = step / steps;
      const next = startVol + (targetVol - startVol) * ratio;
      audioEl.volume = Math.max(0, Math.min(1, next));
      if (step >= steps) {
        clearInterval(audioEl._fadeTimer);
        audioEl._fadeTimer = null;
        audioEl.volume = Math.max(0, Math.min(1, targetVol));
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  // --------------------------------------------------------------------------
  // PROCEDURAL COSMIC SOUND EFFECTS (Web Audio API)
  // --------------------------------------------------------------------------
  canPlaySfx() {
    return this.hasInteracted && this.sfxEnabled && !this.isMuted;
  }

  playTone({ freq = 520, endFreq = null, duration = 0.14, type = 'sine', gain = 0.08, delay = 0 }) {
    if (!this.canPlaySfx()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }

    const scaledGain = gain * Math.max(0.25, this.volume);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(scaledGain, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playHover() {
    this.playTone({ freq: 740, endFreq: 920, duration: 0.06, type: 'sine', gain: 0.025 });
  }

  playClick() {
    this.hasInteracted = true;
    this.playTone({ freq: 523.25, endFreq: 659.25, duration: 0.11, type: 'triangle', gain: 0.065 });
  }

  playError() {
    this.hasInteracted = true;
    this.playTone({ freq: 220, endFreq: 145, duration: 0.22, type: 'sawtooth', gain: 0.055 });
    this.playTone({ freq: 175, endFreq: 120, duration: 0.24, type: 'triangle', gain: 0.055, delay: 0.09 });
  }

  playSuccess() {
    this.hasInteracted = true;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone({ freq: n, duration: 0.26, type: 'sine', gain: 0.07, delay: i * 0.07 });
    });
  }

  playUnlock() {
    this.hasInteracted = true;
    const chord = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((n, i) => {
      this.playTone({ freq: n, duration: 0.55, type: 'triangle', gain: 0.065, delay: i * 0.065 });
    });
  }

  playStarCatch(isBonus = false) {
    const scale = [587.33, 659.25, 783.99, 880, 1046.5];
    const base = isBonus ? 1174.66 : scale[Math.floor(Math.random() * scale.length)];
    this.playTone({ freq: base, endFreq: base * 1.25, duration: 0.16, type: 'sine', gain: 0.07 });
    if (isBonus) {
      this.playTone({ freq: base * 1.5, duration: 0.24, type: 'triangle', gain: 0.065, delay: 0.06 });
    }
  }

  playWheelTick() {
    this.playTone({ freq: 920, endFreq: 600, duration: 0.035, type: 'triangle', gain: 0.04 });
  }

  playEnvelopeOpen() {
    this.hasInteracted = true;
    [392.0, 493.88, 587.33, 783.99].forEach((n, i) => {
      this.playTone({ freq: n, duration: 0.34, type: 'sine', gain: 0.055, delay: i * 0.08 });
    });
  }

  playFirework() {
    this.playTone({ freq: 340, endFreq: 880, duration: 0.18, type: 'sine', gain: 0.045 });
    this.playTone({ freq: 1046.5, endFreq: 680, duration: 0.28, type: 'triangle', gain: 0.04, delay: 0.12 });
  }
}

export const soundEngine = new CosmicSoundEngine();
export default soundEngine;
