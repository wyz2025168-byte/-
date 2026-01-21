import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // State
  isPlaying = signal(false);
  currentTrack = signal('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=music-for-videos-piano-moment-111985.mp3');
  isVoicePlaying = signal(false);

  private bgmAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  private defaultVolume = 0.4;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.bgmAudio = new Audio();
      this.bgmAudio.loop = true;
      this.voiceAudio = new Audio();

      // Listen to voice end to restore BGM
      this.voiceAudio.onended = () => {
        this.isVoicePlaying.set(false);
        this.fadeBgmVolume(this.defaultVolume);
      };
    }
  }

  init(startUrl?: string) {
    if (startUrl && this.bgmAudio) {
      this.currentTrack.set(startUrl);
      this.bgmAudio.src = startUrl;
    }
  }

  async playBgm() {
    if (!this.bgmAudio) return;
    
    // Don't reset src if it's the same, avoids reloading/interruption
    if (this.bgmAudio.src !== this.currentTrack()) {
      this.bgmAudio.src = this.currentTrack();
    }
    
    this.bgmAudio.volume = this.defaultVolume;
    
    try {
      await this.bgmAudio.play();
      this.isPlaying.set(true);
    } catch (e: any) {
      // Ignore abort/interrupted errors which are common with rapid toggling
      if (e.name !== 'AbortError' && e.message?.indexOf('interrupted') === -1) {
         console.warn('Autoplay blocked or BGM error:', e);
      }
      // If play failed, ensure state reflects that
      if (this.bgmAudio.paused) {
        this.isPlaying.set(false);
      }
    }
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isPlaying.set(false);
    }
  }

  toggleBgm() {
    if (this.isPlaying()) this.pauseBgm();
    else this.playBgm();
  }

  changeTrack(url: string) {
    const wasPlaying = this.isPlaying();
    this.currentTrack.set(url);
    if (this.bgmAudio) {
      this.bgmAudio.src = url;
      if (wasPlaying) this.playBgm();
    }
  }

  // Smart Ducking Logic
  async playVoiceNote(url: string) {
    if (!this.voiceAudio) return;

    // 1. Reset state
    // We pause synchronously. If a previous play() is pending, it will reject with AbortError.
    this.voiceAudio.pause();
    this.voiceAudio.currentTime = 0;
    
    // 2. Duck BGM
    this.fadeBgmVolume(0.1); 
    this.isVoicePlaying.set(true);

    // 3. Play Voice
    this.voiceAudio.src = url;
    try {
      await this.voiceAudio.play();
    } catch (e: any) {
      // Ignore specific race-condition errors
      if (e.name !== 'AbortError' && e.message?.indexOf('interrupted') === -1) {
        console.error('Voice play failed', e);
      }

      // Cleanup if actual playback isn't happening
      // We check if we are still "supposed" to be playing according to our signal
      // If the user clicked stop, isVoicePlaying is false.
      // If play failed due to error, voiceAudio.paused is true.
      if (this.voiceAudio.paused) {
         // Only reset global state if we aren't legitimately paused by user interaction logic elsewhere
         // But here, failure to play means we should revert to BGM
         this.isVoicePlaying.set(false);
         this.fadeBgmVolume(this.defaultVolume);
      }
    }
  }

  stopVoiceNote() {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.isVoicePlaying.set(false);
      this.fadeBgmVolume(this.defaultVolume);
    }
  }

  private fadeBgmVolume(target: number) {
    if (!this.bgmAudio) return;
    
    // Simple linear interpolation could go here, but setting directly is snappy enough for web
    // For smoother effect:
    const step = 0.05;
    const current = this.bgmAudio.volume;
    
    if (Math.abs(current - target) < 0.01) {
      this.bgmAudio.volume = target;
      return;
    }

    if (current > target) {
      this.bgmAudio.volume = Math.max(0, current - step);
    } else {
      this.bgmAudio.volume = Math.min(1, current + step);
    }

    // Continue fading if not reached
    if (Math.abs(this.bgmAudio.volume - target) > 0.01) {
      setTimeout(() => this.fadeBgmVolume(target), 50);
    }
  }
}