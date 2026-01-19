import { Component, input, signal, ElementRef, viewChildren, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-6 py-12">
      @for (stat of stats(); track $index) {
        <div class="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
          
          <!-- Icon -->
          <div class="mb-4 text-rose-300 opacity-80 group-hover:scale-110 transition-transform duration-500">
            <span class="text-3xl">{{ stat.icon }}</span>
          </div>

          <!-- Number -->
          <div class="text-5xl md:text-6xl font-serif text-white mb-2 tracking-tight">
            <span class="counter" [attr.data-target]="stat.value">0</span>
            <span class="text-2xl text-rose-400 ml-1">+</span>
          </div>

          <!-- Label -->
          <h3 class="text-sm font-bold tracking-[0.2em] uppercase text-rose-100/60">{{ stat.label }}</h3>
          
          <!-- Description -->
          <p class="mt-4 text-xs text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
            {{ stat.description }}
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class StatsViewComponent {
  stats = input.required<any[]>();
  
  // Simple counting animation logic
  constructor() {
    afterNextRender(() => {
      this.animateCounters();
    });
  }

  animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter: any) => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); 
      
      let current = 0;
      const updateCount = () => {
        if (current < target) {
          current += increment;
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }
}