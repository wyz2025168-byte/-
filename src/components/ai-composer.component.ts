import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-ai-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg mx-auto overflow-hidden flex flex-col max-h-[85vh]">
      
      <!-- Tabs -->
      <div class="flex border-b border-slate-700">
        <button 
          (click)="activeTab.set('letter')"
          class="flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
          [class.bg-slate-800]="activeTab() === 'letter'"
          [class.text-rose-400]="activeTab() === 'letter'"
          [class.text-slate-500]="activeTab() !== 'letter'"
        >
          Edit Letter
        </button>
        <button 
          (click)="activeTab.set('memory')"
          class="flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
          [class.bg-slate-800]="activeTab() === 'memory'"
          [class.text-rose-400]="activeTab() === 'memory'"
          [class.text-slate-500]="activeTab() !== 'memory'"
        >
          Add Memory
        </button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar">
        
        <!-- Tab: Letter Editor -->
        @if (activeTab() === 'letter') {
          <div class="animate-fade-in">
             <h3 class="text-white font-serif italic mb-4">The Final Promise</h3>
             <textarea 
              [(ngModel)]="currentContent" 
              (ngModelChange)="onContentChange($event)"
              class="w-full h-48 bg-slate-800 text-white p-4 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none mb-4 leading-relaxed resize-none"
              placeholder="在这里手动输入或粘贴给她的信..."
            ></textarea>

            <div class="border-t border-slate-700 pt-4">
              <p class="text-slate-400 text-xs mb-3">或者让 AI 帮你写：</p>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  [(ngModel)]="keywords" 
                  placeholder="关键词：异地、猫咪、海边"
                  class="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none"
                >
                <button 
                  (click)="generate()"
                  [disabled]="isLoading()"
                  class="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                >
                  {{ isLoading() ? '...' : '✨ 生成' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Tab: Add Memory -->
        @if (activeTab() === 'memory') {
          <div class="animate-fade-in space-y-4">
             <h3 class="text-white font-serif italic mb-2">Capture a Moment</h3>
             
             <!-- Image Upload Area -->
             <div class="relative w-full h-40 border-2 border-dashed border-slate-600 rounded-xl hover:border-rose-500 transition-colors bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
               <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">
               
               @if (newMemoryImage) {
                 <img [src]="newMemoryImage" class="absolute inset-0 w-full h-full object-cover z-10 opacity-60 group-hover:opacity-40 transition-opacity">
                 <div class="z-20 p-2 bg-black/60 rounded-full">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                 </div>
               } @else {
                 <svg class="w-8 h-8 text-slate-400 mb-2 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 <span class="text-xs text-slate-400 uppercase tracking-widest">Upload Photo</span>
               }
             </div>

             <!-- Inputs -->
             <div class="grid grid-cols-2 gap-3">
               <input [(ngModel)]="newMemoryTitle" type="text" placeholder="Title (e.g., Summer Trip)" class="bg-slate-800 text-white px-3 py-3 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none">
               <input [(ngModel)]="newMemoryDate" type="text" placeholder="Date (e.g., 2023.05.20)" class="bg-slate-800 text-white px-3 py-3 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none">
             </div>
             
             <input [(ngModel)]="newMemoryLocation" type="text" placeholder="Location (Optional)" class="w-full bg-slate-800 text-white px-3 py-3 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none">
             
             <textarea 
               [(ngModel)]="newMemoryDesc" 
               class="w-full h-24 bg-slate-800 text-white p-3 rounded-lg text-sm border border-slate-700 focus:border-rose-500 outline-none resize-none"
               placeholder="Write a short description about this memory..."
             ></textarea>

             <button 
               (click)="addMemory()"
               [disabled]="!newMemoryTitle || !newMemoryImage"
               class="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
             >
               Add to Timeline
             </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  `]
})
export class AiComposerComponent {
  private geminiService = inject(GeminiService);
  
  // State
  activeTab = signal<'letter' | 'memory'>('letter');
  isLoading = signal(false);

  // Letter Logic
  keywords = '';
  currentContent = '';
  contentUpdated = output<string>();

  // New Memory Logic
  newMemoryTitle = '';
  newMemoryDate = '';
  newMemoryLocation = '';
  newMemoryDesc = '';
  newMemoryImage: string | null = null;
  memoryAdded = output<any>();

  onContentChange(val: string) {
    this.contentUpdated.emit(val);
  }

  async generate() {
    if (!this.keywords) return;
    this.isLoading.set(true);
    const message = await this.geminiService.generateBirthdayWish(this.keywords, 'romantic');
    this.currentContent = message;
    this.contentUpdated.emit(message);
    this.isLoading.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newMemoryImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addMemory() {
    if (!this.newMemoryTitle || !this.newMemoryImage) return;

    const newMemory = {
      id: Date.now(), // Generate ID based on timestamp
      type: 'photo',
      title: this.newMemoryTitle,
      date: this.newMemoryDate || 'Recently',
      location: this.newMemoryLocation,
      content: this.newMemoryImage,
      description: this.newMemoryDesc
    };

    this.memoryAdded.emit(newMemory);

    // Reset Form
    this.newMemoryTitle = '';
    this.newMemoryDate = '';
    this.newMemoryLocation = '';
    this.newMemoryDesc = '';
    this.newMemoryImage = null;
    
    // Switch back to provide feedback or just stay (user might want to add more)
    alert('Memory added to timeline successfully!');
  }
}