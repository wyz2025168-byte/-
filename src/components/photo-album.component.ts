import { Component, input, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-album',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 pb-24">
      <!-- Controls / Filter Header (Optional future expansion) -->
      
      <!-- Grid Layout -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        @for (photo of photoItems(); track photo.id; let i = $index) {
          <div 
            class="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-white/5 border border-white/10 transition-all duration-500 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] hover:-translate-y-1 animate-fade-in-up"
            [style.animation-delay]="(i * 0.1) + 's'"
            (click)="openLightbox(i)"
          >
            <!-- Image -->
            <img 
              [src]="photo.content" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
              alt="{{ photo.title }}"
            >
            
            <!-- Overlay Info -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span class="text-rose-400 text-[10px] font-bold tracking-widest uppercase mb-1">{{ photo.date }}</span>
              <span class="text-white text-lg font-serif italic leading-none">{{ photo.title }}</span>
            </div>
            
            <!-- Zoom Icon -->
            <div class="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
               <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            </div>
          </div>
        }
      </div>

      <!-- Lightbox Modal -->
      @if (selectedIndex() !== null) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in" (click)="closeLightbox()">
          
          <!-- Close Button -->
          <button class="absolute top-6 right-6 text-white/50 hover:text-white p-2 z-50 transition-colors" (click)="closeLightbox()">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <!-- Navigation Prev -->
          <button 
            class="absolute left-4 md:left-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-all z-50 group"
            (click)="$event.stopPropagation(); prev()"
          >
            <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <!-- Navigation Next -->
          <button 
            class="absolute right-4 md:right-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-all z-50 group"
            (click)="$event.stopPropagation(); next()"
          >
             <svg class="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <!-- Main Image Container -->
          <div class="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none">
            
            <div class="pointer-events-auto relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden max-h-[80vh] max-w-[90vw] animate-scale-in" (click)="$event.stopPropagation()">
               <img 
                 [src]="currentPhoto()?.content" 
                 class="max-w-full max-h-[80vh] object-contain select-none"
                 draggable="false"
               >
            </div>

            <!-- Caption -->
            <div class="mt-8 text-center pointer-events-auto" (click)="$event.stopPropagation()">
               <span class="inline-block py-1 px-3 rounded-full bg-white/10 text-[10px] tracking-widest text-rose-300 uppercase mb-3 border border-white/5">
                 {{ currentPhoto()?.date }}
               </span>
               <h3 class="text-3xl font-serif text-white mb-2">{{ currentPhoto()?.title }}</h3>
               <p class="text-white/50 text-sm max-w-lg mx-auto font-light leading-relaxed">
                 {{ currentPhoto()?.description }}
               </p>
               
               <div class="mt-4 text-white/20 text-xs tracking-widest">
                 {{ selectedIndex()! + 1 }} / {{ photoItems().length }}
               </div>
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      opacity: 0;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    
    @keyframes scaleIn { 
      from { transform: scale(0.95); opacity: 0; } 
      to { transform: scale(1); opacity: 1; } 
    }
    .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  `]
})
export class PhotoAlbumComponent {
  items = input.required<any[]>();
  
  selectedIndex = signal<number | null>(null);

  photoItems = computed(() => {
    return this.items().filter(i => i.type === 'photo');
  });

  currentPhoto = computed(() => {
    const idx = this.selectedIndex();
    return idx !== null ? this.photoItems()[idx] : null;
  });

  openLightbox(index: number) {
    this.selectedIndex.set(index);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedIndex.set(null);
    document.body.style.overflow = '';
  }

  next() {
    const current = this.selectedIndex();
    if (current === null) return;
    const nextIdx = (current + 1) % this.photoItems().length;
    this.selectedIndex.set(nextIdx);
  }

  prev() {
    const current = this.selectedIndex();
    if (current === null) return;
    const prevIdx = (current - 1 + this.photoItems().length) % this.photoItems().length;
    this.selectedIndex.set(prevIdx);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.selectedIndex() === null) return;
    
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }
}