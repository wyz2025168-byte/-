import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-timeline-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative py-10 max-w-4xl mx-auto px-4">
      <!-- Vertical Line (Dashed for more style) -->
      <div class="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 h-full w-px border-l border-dashed border-white/20 top-0"></div>

      @for (item of items(); track item.id; let i = $index) {
        <div 
          class="relative mb-20 flex flex-col md:flex-row items-center w-full opacity-0 translate-y-8 animate-reveal group"
          [class.md:flex-row-reverse]="i % 2 !== 0"
          [style.animation-delay]="(i * 0.2) + 's'"
        >
          
          <!-- Content Card side -->
          <div class="w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0" [class.md:pr-12]="i % 2 === 0" [class.md:pl-12]="i % 2 !== 0">
            <div 
              (click)="expand(item.id)"
              class="glass-card p-6 rounded-2xl border border-white/10 hover:border-rose-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.1)] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
              <!-- Hover shine effect -->
              <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

              <!-- Date Badge -->
              <div class="inline-flex items-center gap-2 mb-3 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <svg class="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-rose-200 font-serif text-sm tracking-widest">{{ item.date }}</span>
              </div>

              <h3 class="text-white text-2xl font-serif mb-2 group-hover:text-rose-200 transition-colors">{{ item.title }}</h3>
              
              <!-- Location/Tag if exists -->
              @if (item.location) {
                <div class="flex items-center gap-1 text-xs text-white/40 mb-4 uppercase tracking-wider">
                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   {{ item.location }}
                </div>
              }

              @if (item.type === 'text') {
                <p class="text-gray-300 text-sm leading-relaxed font-light opacity-90 line-clamp-3">{{ item.content }}</p>
                <div class="mt-2 text-rose-400 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read more</div>
              }
              
              @if (item.type === 'photo') {
                 <div class="rounded-lg overflow-hidden relative aspect-video group-hover:shadow-2xl transition-all">
                    <img [src]="item.content" class="absolute inset-0 w-full h-full object-cover transform duration-700 group-hover:scale-105" alt="Memory">
                 </div>
                 @if (item.description) {
                   <p class="mt-3 text-gray-400 text-xs italic line-clamp-2">{{ item.description }}</p>
                 }
              }
            </div>
          </div>

          <!-- Center Dot -->
          <div class="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rounded-full border-2 border-rose-500 z-10 shadow-[0_0_10px_rgba(244,63,94,0.8)] top-8 md:top-8 group-hover:scale-150 transition-transform duration-300"></div>

          <!-- Empty space for the other side -->
          <div class="hidden md:block w-[calc(50%-3rem)]"></div>

        </div>
      }
      
      <div class="h-32 flex items-center justify-center">
         <div class="w-1 h-16 bg-gradient-to-b from-white/20 to-transparent"></div>
      </div>
    </div>

    <!-- Expanded Modal Overlay -->
    @if (expandedItem(); as item) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-modal-in">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" (click)="close()"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-5xl bg-[#1a1a2e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-scale-in">
          
          <button class="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white transition-colors" (click)="close()">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <!-- Media Section -->
          <div class="w-full md:w-1/2 bg-black/20 relative min-h-[300px] md:min-h-full animate-content-fade">
             @if (item.type === 'photo') {
                <img [src]="item.content" class="absolute inset-0 w-full h-full object-cover" alt="Full Memory">
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent md:bg-gradient-to-r"></div>
             } @else {
                <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-900/20 to-slate-900">
                   <span class="text-8xl opacity-20">📜</span>
                </div>
             }

             <!-- Audio Floating Action Button inside Image area if available -->
             @if (item.audioUrl) {
                <button 
                  (click)="toggleAudio(item.audioUrl)"
                  class="absolute bottom-6 left-6 flex items-center gap-3 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 group"
                >
                  <div class="w-2 h-2 bg-white rounded-full" [class.animate-pulse]="audioService.isVoicePlaying()"></div>
                  <span class="text-xs font-bold tracking-widest uppercase">
                    {{ audioService.isVoicePlaying() ? 'Playing...' : 'Play Audio' }}
                  </span>
                </button>
             }
          </div>

          <!-- Info Section -->
          <div class="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center animate-content-fade" style="animation-delay: 0.1s">
             <div class="mb-6">
                <span class="inline-block py-1 px-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs tracking-widest uppercase mb-4">
                  {{ item.date }}
                </span>
                <h2 class="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">{{ item.title }}</h2>
                @if (item.location) {
                   <div class="flex items-center gap-2 text-white/40 text-sm uppercase tracking-wide">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                      {{ item.location }}
                   </div>
                }
             </div>

             <div class="prose prose-invert prose-lg">
                <p class="text-gray-300 font-light leading-loose whitespace-pre-line">
                  {{ item.description || item.content }}
                </p>
                <p *ngIf="item.type === 'photo' && item.content" class="text-sm text-gray-500 italic mt-8 border-t border-white/5 pt-4">
                   Captured moment from our journey together.
                </p>
             </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .glass-card {
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    @keyframes reveal {
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-reveal {
      animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    
    @keyframes modalIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-modal-in {
      animation: modalIn 0.3s ease-out forwards;
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in {
      animation: scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    @keyframes contentFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-content-fade {
      opacity: 0;
      animation: contentFade 0.6s ease-out forwards;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.02);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
    }
  `]
})
export class TimelineViewComponent {
  items = input.required<any[]>();
  expandedId = signal<number | null>(null);
  
  audioService = inject(AudioService);

  expandedItem = computed(() => {
    const id = this.expandedId();
    return id ? this.items().find(i => i.id === id) : null;
  });

  expand(id: number) {
    this.expandedId.set(id);
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
  }

  close() {
    this.expandedId.set(null);
    document.body.style.overflow = '';
    // Stop specific item audio if playing when closed
    if (this.audioService.isVoicePlaying()) {
      this.audioService.stopVoiceNote();
    }
  }

  toggleAudio(url: string) {
    if (this.audioService.isVoicePlaying()) {
      this.audioService.stopVoiceNote();
    } else {
      this.audioService.playVoiceNote(url);
    }
  }
}