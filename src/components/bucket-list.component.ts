import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (item of items(); track $index) {
          <div class="relative group overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            
            <!-- Background Image (Dimmed) -->
            <div 
              class="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
              [style.background-image]="'url(' + item.image + ')'"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <!-- Content -->
            <div class="relative p-8 flex flex-col h-full min-h-[200px] justify-end">
              <div class="flex items-center gap-3 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div class="w-5 h-5 rounded-full border border-rose-400 flex items-center justify-center">
                   <div class="w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 class="text-xl font-serif text-white italic">{{ item.title }}</h3>
              </div>
              
              <p class="text-xs text-gray-300 pl-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        }
      </div>
      
      <div class="mt-12 text-center">
        <p class="text-rose-200/60 text-xs tracking-[0.3em] uppercase animate-pulse">And many more to come...</p>
      </div>
    </div>
  `
})
export class BucketListComponent {
  items = input.required<any[]>();
}