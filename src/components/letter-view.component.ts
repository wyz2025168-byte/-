import { Component, input, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-letter-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto px-8 py-12 relative min-h-[60vh] flex flex-col justify-center">
      
      <!-- Audio Note Feature (Interactive) -->
      <div class="mb-16 flex justify-center animate-fade-in-slow">
        <button 
          (click)="toggleVoice()"
          class="relative bg-white/5 border border-white/10 rounded-full px-8 py-4 flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer group hover:scale-105 active:scale-95 shadow-lg"
          [class.border-rose-500_50]="audioService.isVoicePlaying()"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
            [class.bg-rose-500]="!audioService.isVoicePlaying()"
            [class.bg-white]="audioService.isVoicePlaying()"
          >
             <svg *ngIf="!audioService.isVoicePlaying()" class="w-5 h-5 text-white pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             <svg *ngIf="audioService.isVoicePlaying()" class="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </div>
          
          <div class="flex flex-col text-left">
             <span class="text-[10px] text-rose-300 uppercase tracking-widest font-bold mb-1">
               {{ audioService.isVoicePlaying() ? 'Listening...' : 'Play Voice Note' }}
             </span>
             <div class="flex gap-[3px] items-end h-4">
               @for (bar of bars; track $index) {
                 <div 
                   class="w-1 bg-white/50 rounded-full transition-all duration-300" 
                   [class.animate-soundwave]="audioService.isVoicePlaying()"
                   [style.height.px]="audioService.isVoicePlaying() ? bar.h : 4"
                   [style.animation-delay]="bar.delay + 'ms'"
                 ></div>
               }
               <span class="text-xs text-white/40 ml-3 font-mono">01:24</span>
             </div>
          </div>
        </button>
      </div>

      <div class="absolute -top-10 -left-4 md:-left-10 text-8xl text-white/5 font-serif leading-none select-none">“</div>
      
      <div class="glass-card p-8 md:p-12 rounded-2xl relative z-10 border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
        <div class="prose prose-invert prose-lg md:prose-xl max-w-none">
          <p class="font-serif text-xl md:text-3xl leading-loose text-gray-100 whitespace-pre-line tracking-wide drop-shadow-sm">
            {{ displayedText() }}<span class="animate-pulse text-rose-400">|</span>
          </p>
        </div>
      </div>

      <div class="absolute -bottom-10 -right-4 md:-right-10 text-8xl text-white/5 font-serif leading-none select-none">”</div>
      
      <div class="mt-12 text-right opacity-0 animate-fade-in-slow" [style.animation-delay]="'3s'">
        <div class="inline-block transform rotate-[-2deg]">
             <span class="font-serif italic text-2xl text-rose-200 mr-2">Yours,</span>
             <span class="font-serif text-lg text-white tracking-widest uppercase">Forever</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInSlow {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes soundwave {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }
    .animate-fade-in-slow {
      animation: fadeInSlow 2s ease-out forwards;
    }
    .animate-soundwave {
      animation: soundwave 1s ease-in-out infinite;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
    }
  `]
})
export class LetterViewComponent {
  content = input.required<string>();
  displayedText = signal('');
  audioService = inject(AudioService);

  // Fake bars for visualization
  bars = Array.from({length: 12}, (_, i) => ({
    h: Math.random() * 12 + 4,
    delay: i * 50
  }));

  // Demo voice URL - ideally this comes from input
  voiceUrl = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=voice-demo.mp3'; // Placeholder speech

  toggleVoice() {
    if (this.audioService.isVoicePlaying()) {
      this.audioService.stopVoiceNote();
    } else {
      this.audioService.playVoiceNote(this.voiceUrl);
    }
  }

  constructor() {
    effect((onCleanup) => {
      const fullText = this.content();
      this.displayedText.set('');
      
      let i = 0;
      let timeoutId: any;
      const speed = 50; 

      const type = () => {
        if (i < fullText.length) {
          this.displayedText.update(c => c + fullText.charAt(i));
          i++;
          timeoutId = setTimeout(type, speed);
        }
      };
      
      type();

      onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId);
        this.audioService.stopVoiceNote(); // Stop audio if component destroyed
      });
    });
  }
}