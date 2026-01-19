import { Component, input, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
      
      @for (photo of photos(); track $index) {
        <div 
          class="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
          [class.opacity-40]="activeindex() === $index"
          [class.opacity-0]="activeindex() !== $index"
          [class.scale-105]="activeindex() === $index"
          [class.scale-100]="activeindex() !== $index"
          [style.background-image]="'url(' + photo + ')'"
        ></div>
      }
      <!-- Overlay Gradient for Readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-black/80 z-20"></div>
      
      <!-- Purple/Gold Atmosphere overlay -->
      <div class="absolute inset-0 bg-purple-900/10 mix-blend-overlay z-20"></div>

      <!-- Grain texture for film look -->
      <div class="absolute inset-0 opacity-[0.04] z-30 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }
  `]
})
export class BackgroundSliderComponent implements OnDestroy {
  photos = input.required<string[]>();
  activeindex = signal(0);
  intervalId: any;

  constructor() {
    this.startSlideshow();
  }

  startSlideshow() {
    this.intervalId = setInterval(() => {
      this.activeindex.update(i => (i + 1) % this.photos().length);
    }, 5000); // Change every 5 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}