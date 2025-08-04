// 🤖 PUTER AI ENGINE - Motor de IA con Puter.com
// Sistema completo con análisis de archivos avanzado y generación de imágenes

declare global {
  interface Window {
    puter: any;
    pdfjsLib: any;
  }
}

export class PuterAIEngine {
  private static instance: PuterAIEngine;
  private conversationHistory: Array<{role: string, content: string, timestamp: number}> = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializePuter();
  }

  static getInstance(): PuterAIEngine {
    if (!PuterAIEngine.instance) {
      PuterAIEngine.instance = new PuterAIEngine();
    }
    return PuterAIEngine.instance;
  }

  private async initializePuter() {
    try {
      // Esperar a que Puter esté disponible
      if (typeof window !== 'undefined' && window.puter) {
        this.isInitialized = true;
        console.log('✅ [PUTER AI] Motor inicializado correctamente');
      } else {
        // Esperar hasta que Puter esté disponible
        const checkPuter = () => {
          if (window.puter) {
            this.isInitialized = true;
            console.log('✅ [PUTER AI] Motor inicializado correctamente');
          } else {
            setTimeout(checkPuter, 100);
          }
        };
        checkPuter();
      }
    } catch (error) {
      console.error('❌ [PUTER AI] Error inicializando:', error);
    }
  }

  // 💬 CHAT INTELIGENTE
  async generateResponse(message: string, userId?: string, imageUrl?: string): Promise<string> {
    try {
      if (!this.isInitialized || !window.puter) {
        throw new Error('Puter AI no está inicializado');
      }

      console.log('🤖 [PUTER AI] Generando respuesta...');
      
      // Agregar mensaje al historial
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: Date.now()
      });

      // Mantener solo los últimos 20 mensajes para optimizar
      if (this.conversationHistory.length > 40) {
        this.conversationHistory = this.conversationHistory.slice(-40);
      }

      // Crear contexto de conversación
      let prompt = message;
      if (this.conversationHistory.length > 1) {
        const context = this.conversationHistory
          .slice(-6) // Últimos 6 mensajes
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        prompt = `Contexto de conversación:\n${context}\n\nUsuario: ${message}\nAsistente:`;
      }

      // Si hay imagen, agregar contexto visual
      if (imageUrl) {
        prompt = `Analiza esta imagen y responde: ${message}`;
      }

      const stream = await window.puter.ai.chat(prompt, {
        model: "gpt-4o",
        stream: true,
        max_tokens: 2000,
        temperature: 0.7
      });

      let response = "";
      for await (const parte of stream) {
        if (parte?.text) {
          response += parte.text;
        }
      }

      // Limpiar respuesta
      response = this.cleanResponse(response);

      // Agregar respuesta al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now() + 50
      });

      console.log('✅ [PUTER AI] Respuesta generada');
      return response;

    } catch (error) {
      console.error('❌ [PUTER AI] Error:', error);
      return this.generateFallbackResponse(message);
    }
  }

  // 🎨 GENERACIÓN DE IMÁGENES
  async generateImage(prompt: string): Promise<string> {
    try {
      if (!this.isInitialized || !window.puter) {
        throw new Error('Puter AI no está inicializado');
      }

      console.log('🎨 [PUTER AI] Generando imagen...');
      
      const imagen = await window.puter.ai.txt2img(prompt, {
        model: "dall-e-3",
        size: "1024x1024",
        quality: "standard"
      });

      // Convertir imagen a URL si es necesario
      let imageUrl = '';
      if (imagen instanceof HTMLImageElement) {
        imageUrl = imagen.src;
      } else if (typeof imagen === 'string') {
        imageUrl = imagen;
      } else if (imagen.src) {
        imageUrl = imagen.src;
      }

      console.log('✅ [PUTER AI] Imagen generada exitosamente');
      return imageUrl;

    } catch (error) {
      console.error('❌ [PUTER AI] Error generando imagen:', error);
      // Fallback a imagen placeholder
      return `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024&fit=crop&puter=${Date.now()}`;
    }
  }

  // 📄 ANÁLISIS AVANZADO DE ARCHIVOS
  async analyzeFile(file: File): Promise<any> {
    try {
      console.log('📄 [PUTER AI] Analizando archivo:', file.name);

      let fileContent = '';
      let analysisType = 'general';

      // Procesar según tipo de archivo
      if (file.name.endsWith('.txt')) {
        fileContent = await file.text();
        analysisType = 'text';
      } else if (file.name.endsWith('.pdf')) {
        fileContent = await this.extractPdfText(file);
        analysisType = 'pdf';
      } else if (file.type.startsWith('image/')) {
        const imageUrl = await this.fileToDataURL(file);
        return await this.analyzeImageWithAI(file.name, imageUrl);
      } else if (file.name.endsWith('.json')) {
        try {
          const text = await file.text();
          JSON.parse(text); // Validar JSON
          fileContent = text;
          analysisType = 'json';
        } catch {
          fileContent = await file.text();
          analysisType = 'text';
        }
      } else {
        fileContent = await file.text();
        analysisType = 'text';
      }

      // Análisis con IA si hay contenido
      if (fileContent && this.isInitialized && window.puter) {
        try {
          const aiAnalysis = await window.puter.ai.chat(
            `Analiza este archivo ${analysisType} llamado "${file.name}" y proporciona un resumen útil:\n\n${fileContent.substring(0, 3000)}`,
            {
              model: "gpt-4o",
              max_tokens: 1000,
              temperature: 0.3
            }
          );

          return {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            analysisType,
            content: fileContent.substring(0, 500) + (fileContent.length > 500 ? '...' : ''),
            aiAnalysis: aiAnalysis,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.warn('⚠️ [PUTER AI] Error en análisis IA:', error);
        }
      }

      // Análisis básico si falla la IA
      return {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        analysisType,
        content: fileContent.substring(0, 500) + (fileContent.length > 500 ? '...' : ''),
        basicAnalysis: this.getBasicFileAnalysis(file, fileContent),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ [PUTER AI] Error analizando archivo:', error);
      return {
        fileName: file.name,
        error: 'Error procesando archivo',
        timestamp: new Date().toISOString()
      };
    }
  }

  // 🔧 MÉTODOS PRIVADOS

  private async extractPdfText(file: File): Promise<string> {
    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF.js no está cargado');
      }

      const buffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('Error extrayendo texto PDF:', error);
      return 'Error procesando PDF';
    }
  }

  private async fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async analyzeImageWithAI(fileName: string, imageUrl: string): Promise<any> {
    try {
      if (!this.isInitialized || !window.puter) {
        throw new Error('Puter AI no disponible');
      }

      const analysis = await window.puter.ai.chat(
        'Describe detalladamente esta imagen, incluyendo objetos, colores, composición y cualquier texto visible.',
        imageUrl
      );

      return {
        fileName,
        fileType: 'image',
        analysisType: 'image_ai',
        imageUrl,
        aiAnalysis: analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analizando imagen con IA:', error);
      return {
        fileName,
        fileType: 'image',
        analysisType: 'image_basic',
        imageUrl,
        basicAnalysis: 'Imagen cargada correctamente',
        timestamp: new Date().toISOString()
      };
    }
  }

  private getBasicFileAnalysis(file: File, content: string): string {
    if (file.name.endsWith('.txt')) {
      const lines = content.split('\n').length;
      const words = content.split(/\s+/).filter(w => w.length > 0).length;
      return `Archivo de texto con ${lines} líneas y ${words} palabras`;
    } else if (file.name.endsWith('.json')) {
      try {
        const json = JSON.parse(content);
        const keys = Object.keys(json).length;
        return `Archivo JSON válido con ${keys} claves principales`;
      } catch {
        return 'Archivo JSON con formato inválido';
      }
    } else if (file.name.endsWith('.pdf')) {
      return `Documento PDF procesado, contenido extraído`;
    }
    return `Archivo ${file.type || 'desconocido'} procesado`;
  }

  private cleanResponse(response: string): string {
    return response
      .replace(/^(Asistente:|Assistant:|AI:|IA:)\s*/i, '')
      .replace(/^(Usuario:|User:)\s*/i, '')
      .trim();
  }

  private generateFallbackResponse(message: string): string {
    const fallbacks = [
      'Lo siento, hay un problema temporal con el servicio. ¿Podrías intentar de nuevo?',
      'El servicio no está disponible en este momento. Intenta más tarde.',
      'Hay un error de conexión. Por favor, reintenta.',
      'El servicio está temporalmente no disponible.'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Estado del motor
  getEngineStatus(): any {
    return {
      status: this.isInitialized ? 'CONECTADO' : 'INICIALIZANDO',
      version: '1.0.0 - Puter AI Integration',
      model: 'GPT-4o',
      imageGeneration: 'DALL-E 3',
      fileAnalysis: 'IA Avanzada + PDF.js',
      conversationMemory: this.conversationHistory.length,
      capabilities: [
        'Chat inteligente sin límites',
        'Generación de imágenes DALL-E 3',
        'Análisis avanzado de archivos',
        'Procesamiento de PDF con PDF.js',
        'Análisis de imágenes con IA',
        'Memoria conversacional optimizada'
      ]
    };
  }

  // Limpiar memoria
  clearMemory(): void {
    this.conversationHistory = [];
    console.log('🧹 [PUTER AI] Memoria conversacional limpiada');
  }
}

// Exportar instancia única
export const puterAI = PuterAIEngine.getInstance();