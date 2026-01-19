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
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.voiceAudio = new Audio();

    // Listen to voice end to restore BGM
    this.voiceAudio.onended = () => {
      this.isVoicePlaying.set(false);
      this.fadeBgmVolume(this.defaultVolume);
    };
  }

  init(startUrl?: string) {
    if (startUrl && this.bgmAudio) {
      this.currentTrack.set(startUrl);
      this.bgmAudio.src = startUrl;
    }
  }

  async playBgm() {
    if (!this.bgmAudio) return;
    try {
      this.bgmAudio.src = this.currentTrack();
      this.bgmAudio.volume = this.defaultVolume;
      await this.bgmAudio.play();
      this.isPlaying.set(true);
    } catch (e) {
      console.warn('Autoplay blocked', e);
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

    // 1. Stop previous voice if any
    this.voiceAudio.pause();
    
    // 2. Duck BGM
    this.fadeBgmVolume(0.1); 
    this.isVoicePlaying.set(true);

    // 3. Play Voice
    this.voiceAudio.src = url;
    try {
      await this.voiceAudio.play();
    } catch (e) {
      console.error('Voice play failed', e);
      this.isVoicePlaying.set(false);
      this.fadeBgmVolume(this.defaultVolume);
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