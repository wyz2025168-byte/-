import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineViewComponent } from './components/timeline-view.component';
import { GalleryViewComponent } from './components/gallery-view.component';
import { PhotoAlbumComponent } from './components/photo-album.component';
import { BackgroundSliderComponent } from './components/background-slider.component';
import { LetterViewComponent } from './components/letter-view.component';
import { AiComposerComponent } from './components/ai-composer.component';
import { AudioPlayerComponent } from './components/audio-player.component';
import { ParticleEffectComponent } from './components/particle-effect.component';
import { StatsViewComponent } from './components/stats-view.component';
import { BucketListComponent } from './components/bucket-list.component';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    TimelineViewComponent, 
    GalleryViewComponent,
    PhotoAlbumComponent,
    BackgroundSliderComponent,
    LetterViewComponent,
    AiComposerComponent,
    AudioPlayerComponent,
    ParticleEffectComponent,
    StatsViewComponent,
    BucketListComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private audioService = inject(AudioService);

  // Flow: 0:Intro -> 1:Stats -> 2:Timeline -> 3:Gallery/Album -> 4:BucketList -> 5:Letter
  currentStage = signal(0);
  isEditMode = signal(false);

  finalLetter = signal(`亲爱的希宝贝，
  
二十岁，生日快乐~
这是你成年后的第一个大生日，也是我陪你度过的第三个。
人生难免有遗憾，这次美中不足的就是没能在你身边，
我相信这一切都只是暂时的，希望未来你的每一年生日，我都不会缺席。

近两年多以来，我一直处于一种相对忙的状态，
当我真的停下来，回顾我们走过的点点滴滴，才惊觉时间过得太快。




生日快乐，我的女孩。

永远爱你的，
奕哥哥);

  backgroundPhotos = signal([
    'https://picsum.photos/seed/romance1/1920/1080',
    'https://picsum.photos/seed/romance2/1920/1080',
    'https://picsum.photos/seed/romance3/1920/1080',
    'https://picsum.photos/seed/romance4/1920/1080'
  ]);

  // STAGE 1 DATA: STATS
  relationshipStats = signal([
    { icon: '📅', value: 834, label: 'Days Together', description: '从我们相遇的第一天起，每一天都是限量版。' },
    { icon: '📸', value: 1000+, label: 'Photos Taken', description: '虽然你总说还要再修图，但在我眼里每一张都很美。' },
    { icon: '🎬', value: 100+, label: 'Movies Watched', description: '哭过笑过的那些瞬间，都藏着我们的回忆。' },
    { icon: '✈️', value: 12, label: 'KMs Traveled', description: '只要是和你一起，无论去哪里都是最好的旅行。' }
  ]);

  // STAGE 2 DATA: MEMORIES (Timeline)
  memories = signal([
    {
      id: 1, type: 'photo', title: '初次相遇', date: '2021.10.15',
      location: '图书馆 · 3F',
      content: 'https://picsum.photos/seed/mem1/800/600',
      description: '那天阳光很好，你穿了一件白色的毛衣，就像天使一样撞进了我的视线。'
    },
    {
      id: 2, type: 'text', title: '第一次旅行', date: '2022.05.20',
      location: '秦皇岛 · 蔚蓝海岸',
      content: '记得那天凌晨三点我们就起床去等日出。海风很冷，但我握着你的手，心里却是滚烫的。看到太阳升起的那一刻，我偷偷许愿：每一年都要陪你看日出。',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1e37517684.mp3?filename=waves.mp3'
    },
    {
      id: 3, type: 'photo', title: '跨年夜', date: '2022.12.31',
      location: '市中心广场',
      content: 'https://picsum.photos/seed/mem3/800/600',
      description: '烟花绽放的瞬间，我在拥挤的人潮里大声说我爱你，你羞红了脸。'
    },
    {
      id: 4, type: 'text', title: '彼此支撑', date: '2023.08.10',
      location: '心 · 连接处',
      content: '那段时间我们压力都很大，通过电话互相打气。如果不曾共患难，又怎会知道我们是如此契合的灵魂伴侣。'
    },
    {
      id: 5, type: 'photo', title: '走向未来', date: '2024.01.01',
      location: '我们的新家',
      content: 'https://picsum.photos/seed/mem5/800/600',
      description: '生活还在继续，而我依然为你心动。'
    }
  ]);

  // STAGE 4 DATA: BUCKET LIST
  bucketList = signal([
    { title: '去看极光', description: '在冰岛的玻璃屋里，等一场绿色的奇迹。', image: 'https://picsum.photos/seed/aurora/800/400' },
    { title: '领养一只猫', description: '名字我都想好了，就叫“糯米”。', image: 'https://picsum.photos/seed/cat/800/400' },
    { title: '学会做你的拿手菜', description: '虽然现在只会煮泡面，但我会努力的。', image: 'https://picsum.photos/seed/cooking/800/400' },
    { title: '穿一次婚纱', description: '那将是我这一生最期待的画面。', image: 'https://picsum.photos/seed/wedding/800/400' }
  ]);

  startJourney() {
    this.audioService.playBgm();
    this.nextStage();
  }

  nextStage() {
    if (this.currentStage() < 5) {
      this.currentStage.update(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleEditMode() {
    this.isEditMode.update(v => !v);
  }

  updateLetter(text: string) {
    this.finalLetter.set(text);
  }

  addMemory(newMemory: any) {
    // Add to memories. Because it's a signal, the Timeline and Gallery views will update automatically.
    this.memories.update(current => [newMemory, ...current].sort((a,b) => b.id - a.id));
    
    // Also add to background slider to keep the vibe fresh
    if (newMemory.type === 'photo' && newMemory.content) {
       this.backgroundPhotos.update(photos => [newMemory.content, ...photos]);
    }
  }
}
