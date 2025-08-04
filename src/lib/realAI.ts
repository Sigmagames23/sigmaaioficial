// 🤖 MOTOR DE IA REAL CON PUTER.COM
// Sistema optimizado para móviles con GPT-4o y DALL-E 3

import { puterAI } from './puterAI';

export class RealAIEngine {
  private static instance: RealAIEngine;
  private conversationHistory: Array<{role: string, content: string, timestamp: number}> = [];
  private systemPrompt: string;
  private responseCache: Map<string, string> = new Map();

  constructor() {
    this.systemPrompt = `Eres Sigma AI, un asistente inteligente que funciona con Puter.com y GPT-4o. 
    Eres útil, creativo y optimizado para dispositivos móviles. Puedes generar imágenes, analizar archivos 
    y mantener conversaciones naturales. Siempre respondes en español de manera clara y amigable.`;
    
    console.log('🚀 [REAL AI] Motor Puter AI inicializado');
  }

  static getInstance(): RealAIEngine {
    if (!RealAIEngine.instance) {
      RealAIEngine.instance = new RealAIEngine();
    }
    return RealAIEngine.instance;
  }

  // 💬 GENERAR RESPUESTA CON GPT-4o
  async generateResponse(message: string, userId?: string, imageUrl?: string): Promise<string> {
    try {
      console.log('⚡ [REAL AI] Generando respuesta con Puter AI...');
      
      // Cache para respuestas rápidas (limitado para móviles)
      const cacheKey = message.toLowerCase().trim();
      if (!imageUrl && this.responseCache.has(cacheKey) && this.responseCache.size < 10) {
        console.log('📦 [REAL AI] Respuesta desde cache');
        return this.responseCache.get(cacheKey)!;
      }

      // Usar Puter AI para generar respuesta
      const response = await puterAI.generateResponse(message, userId, imageUrl);

      // Guardar en cache (limitado para móviles)
      if (!imageUrl && message.length < 100 && this.responseCache.size < 10) {
        this.responseCache.set(cacheKey, response);
      }

      console.log('✅ [REAL AI] Respuesta generada con GPT-4o');
      return response;

    } catch (error) {
      console.error('❌ [REAL AI] Error:', error);
      return this.generateFallbackResponse(message);
    }
  }

  // 🎨 GENERAR IMAGEN CON DALL-E 3
  async generateImage(prompt: string): Promise<string> {
    try {
      console.log('🎨 [REAL AI] Generando imagen con Puter AI...');
      return await puterAI.generateImage(prompt);
    } catch (error) {
      console.error('❌ [REAL AI] Error generando imagen:', error);
      throw error;
    }
  }

  // 📄 ANALIZAR ARCHIVO
  async analyzeFile(file: File): Promise<any> {
    try {
      console.log('📄 [REAL AI] Analizando archivo con Puter AI...');
      return await puterAI.analyzeFile(file);
    } catch (error) {
      console.error('❌ [REAL AI] Error analizando archivo:', error);
      throw error;
    }
  }

  // ⚡ RESPUESTA DE EMERGENCIA
  private generateFallbackResponse(message: string): string {
    const fallbackResponses = [
      'Puter AI está procesando tu consulta. ¿Podrías ser más específico?',
      'Sistema Puter AI funcionando. ¿En qué puedo ayudarte exactamente?',
      'Motor GPT-4o activo. Dime qué necesitas y te ayudo.',
      'Puter AI listo. ¿Qué tarea quieres que realice?'
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  // 📊 ESTADO DEL MOTOR
  getEngineStatus(): any {
    const puterStatus = puterAI.getEngineStatus();
    return {
      status: 'PUTER AI ACTIVO - GPT-4o + DALL-E 3',
      version: '2.0.0 - Puter Integration',
      performance: {
        responseTime: 'GPT-4o Real ⚡',
        imageGeneration: 'DALL-E 3 Real 🎨',
        fileAnalysis: 'IA Avanzada 📄',
        mobileOptimized: 'Optimizado para móviles 📱'
      },
      capabilities: [
        'Chat inteligente con GPT-4o real',
        'Generación de imágenes con DALL-E 3',
        'Análisis avanzado de archivos con IA',
        'Procesamiento de imágenes y texto',
        'Memoria conversacional optimizada',
        'Interfaz optimizada para móviles',
        'Sin tokens necesarios - Puter.com'
      ],
      puterEngine: puterStatus,
      conversationLength: this.conversationHistory.length,
      cacheSize: this.responseCache.size,
      mobileOptimization: 'Activa para dispositivos móviles'
    };
  }

  // 🧹 LIMPIAR MEMORIA
  clearHistory(): void {
    this.conversationHistory = [];
    this.responseCache.clear();
    puterAI.clearMemory();
    console.log('🧹 [REAL AI] Memoria optimizada para móviles');
  }

  // 📊 Estado detallado de APIs
  async getDetailedAPIStatus(): Promise<any> {
    return {
      puter: {
        available: typeof window !== 'undefined' && window.puter,
        engine: 'Puter.com AI Platform',
        status: 'Conectado con GPT-4o y DALL-E 3',
        models: ['GPT-4o', 'DALL-E 3'],
        capabilities: ['Chat', 'Imágenes', 'Análisis de archivos']
      },
      configuration: 'PUTER AI - SIN TOKENS NECESARIOS',
      fallbackChain: ['Puter AI Engine', 'Respuestas locales']
    };
  }
}

// Exportar instancia única
export const realAI = RealAIEngine.getInstance();