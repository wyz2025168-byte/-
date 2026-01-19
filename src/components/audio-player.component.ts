import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../services/audio.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed top-6 right-6 z-50 flex items-center gap-3 animate-fade-in">
      
      <!-- Track Info & Settings -->
      <div class="relative group">
        <div class="hidden md:flex flex-col items-end mr-2 transition-all duration-300">
           <span class="text-[10px] text-rose-200 uppercase tracking-wider font-bold">Now Playing</span>
           <span class="text-xs text-white/80 font-serif italic max-w-[150px] truncate">Romantic Melody</span>
        </div>
        
        <!-- Settings Dropdown -->
        <div class="absolute top-10 right-0 w-64 p-4 rounded-xl glass-panel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <h4 class="text-xs text-rose-300 uppercase mb-3 font-bold tracking-widest">Change Atmosphere</h4>
          <div class="flex flex-col gap-2">
            @for (track of tracks; track track.name) {
              <button 
                (click)="changeTrack(track.url)"
                class="text-left text-xs text-white/70 hover:text-white py-2 px-3 rounded hover:bg-white/10 transition-colors flex justify-between items-center"
                [class.text-rose-400]="audioService.currentTrack() === track.url"
              >
                {{ track.name }}
                <span *ngIf="audioService.currentTrack() === track.url" class="block w-1 h-1 bg-rose-400 rounded-full"></span>
              </button>
            }
            <div class="border-t border-white/10 my-1"></div>
            <input 
              type="text" 
              placeholder="Paste MP3 Link..." 
              (change)="onCustomUrl($event)"
              class="w-full bg-black/30 text-white/80 text-[10px] p-2 rounded border border-white/10 focus:border-rose-400 outline-none"
            >
          </div>
        </div>
      </div>

      <!-- Play/Pause Button -->
      <div 
        class="relative w-12 h-12 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-rose-500/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]"
        (click)="audioService.toggleBgm()"
      >
        <!-- Playing visualizer animation -->
        @if (audioService.isPlaying()) {
          <div class="absolute inset-0 rounded-full border border-rose-400/30 animate-ping opacity-30 duration-[3000ms]"></div>
          <div class="absolute inset-0 rounded-full border border-rose-400/10 animate-ping opacity-30 duration-[2000ms] delay-500"></div>
        }
        
        <svg *ngIf="!audioService.isPlaying()" class="w-5 h-5 text-white pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <svg *ngIf="audioService.isPlaying()" class="w-5 h-5 text-rose-200" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(20, 20, 30, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `]
})
export class AudioPlayerComponent {
  audioService = inject(AudioService);

  tracks = [
    { name: 'Piano Moment', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=music-for-videos-piano-moment-111985.mp3' },
    { name: 'Cinematic Emotional', url: 'https://cdn.pixabay.com/download/audio/2024/05/24/audio_985532584d.mp3?filename=cinematic-emotional-piano-206778.mp3' },
    { name: 'Warm Memories', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5152a55959.mp3?filename=warm-memories-emotional-inspiring-piano-124019.mp3' }
  ];

  changeTrack(url: string) {
    this.audioService.changeTrack(url);
  }

  onCustomUrl(event: any) {
    const url = event.target.value;
    if (url) this.audioService.changeTrack(url);
  }
}