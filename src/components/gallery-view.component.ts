import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Masonry Layout Approximation using Columns -->
    <div class="columns-2 md:columns-3 gap-6 space-y-6 pb-24 px-4">
      @for (item of items(); track item.id; let i = $index) {
        @if (item.type === 'photo') {
          <div 
            class="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] animate-fade-up"
            [style.animation-delay]="(i * 0.15) + 's'"
          >
            <!-- Image -->
            <img [src]="item.content" class="w-full h-auto object-cover transform duration-700 group-hover:scale-110" alt="Gallery">
            
            <!-- Overlay Info -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
               <span class="text-rose-300 font-serif text-xs tracking-widest uppercase mb-1">{{ item.date }}</span>
               <span class="text-white font-serif text-lg italic">{{ item.title }}</span>
            </div>
            
            <!-- Shiny border effect -->
            <div class="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-300"></div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up {
      animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      opacity: 0; 
    }
  `]
})
export class GalleryViewComponent {
  items = input.required<any[]>();
}