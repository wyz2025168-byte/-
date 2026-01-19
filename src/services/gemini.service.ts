import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateBirthdayWish(keywords: string, tone: 'romantic' | 'funny' | 'poetic'): Promise<string> {
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
      return response.text || '暂时无法生成祝福，请稍后再试。';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return '二十岁生日快乐！(AI暂时不可用)';
    }
  }

  async analyzeVibe(memories: string[]): Promise<string> {
    if (memories.length === 0) return '添加一些回忆来分析氛围';
    
    const prompt = `分析这些关于情侣的简短回忆，并用3个中文词语形容这段关系的“氛围感”（例如：热烈、温馨、永恒）。
    回忆内容：${memories.join(', ')}。
    只返回这三个词，用空格分隔。`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || '独一无二';
    } catch (error) {
      return '珍贵';
    }
  }
}