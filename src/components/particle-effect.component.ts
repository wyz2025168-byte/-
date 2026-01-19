import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-particle-effect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      @for (p of particles; track $index) {
        <div 
          class="absolute rounded-full bg-rose-200 blur-[1px] animate-float"
          [style.left.%]="p.left"
          [style.top.%]="p.top"
          [style.width.px]="p.size"
          [style.height.px]="p.size"
          [style.animation-duration.s]="p.duration"
          [style.animation-delay.s]="p.delay"
          [style.opacity]="p.opacity"
        ></div>
      }
    </div>
  `,
  styles: [`
    @keyframes float {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      50% { opacity: 0.8; }
      100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
    }
    .animate-float {
      animation: float linear infinite;
    }
  `]
})
export class ParticleEffectComponent {
  particles = Array.from({ length: 30 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10, // 10-20s slow float
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1
  }));
}