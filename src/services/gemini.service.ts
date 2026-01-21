import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  
  // TODO: 如果你想使用 AI 写信功能，请在这里填入你的 Key。
  // 如果留空，网页依然可以完美运行，只是 AI 写信会返回预设的浪漫文案。
  // 申请地址: https://aistudio.google.com/app/apikey
  private readonly API_KEY = ''; 

  constructor() {
    if (this.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: this.API_KEY });
    }
  }

  async generateBirthdayWish(keywords: string, tone: 'romantic' | 'funny' | 'poetic'): Promise<string> {
    // 如果没有配置 Key，直接返回预设的高质量文案，确保功能可用
    if (!this.ai) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟思考时间
      return this.getFallbackMessage(tone);
    }

    const toneMap = {
      romantic: '浪漫深情',
      funny: '幽默风趣',
      poetic: '如诗如画'
    };
    
    const prompt = `为我即将20岁的女朋友写一段简短、动人且唯美的生日祝福。
    风格：${toneMap[tone]}。
    关键词：${keywords}。
    要求：100字以内，使用中文，直接返回纯文本内容，不要包含任何解释。`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || this.getFallbackMessage(tone);
    } catch (error) {
      console.warn('Gemini API Warning: Using fallback due to error', error);
      return this.getFallbackMessage(tone);
    }
  }

  async analyzeVibe(memories: string[]): Promise<string> {
    if (!this.ai || memories.length === 0) return '独一无二';
    
    const prompt = `分析这些关于情侣的简短回忆，并用3个中文词语形容这段关系的“氛围感”（例如：热烈、温馨、永恒）。
    回忆内容：${memories.join(', ')}。
    只返回这三个词，用空格分隔。`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || '珍贵 永恒 浪漫';
    } catch (error) {
      return '珍贵 永恒 浪漫';
    }
  }

  private getFallbackMessage(tone: string): string {
    const messages = [
      "二十岁，是花开的年纪。愿你的未来如星河般璀璨，而我永远是你身边的引力，陪你度过漫长岁月。",
      "亲爱的，生日快乐。你是我平淡生活里最惊艳的伏笔，未来的每一天，我都想和你一起虚度。",
      "祝我的女孩二十岁快乐！愿你眼中有光，心中有爱，在这个美好的年纪，活成自己最喜欢的模样。"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}