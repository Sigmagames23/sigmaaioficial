// 🤖 INTEGRACIÓN CON GPT-J BACKEND
// Cliente para comunicarse con el backend de GPT-J

interface GPTJRequest {
  prompt: string;
  max_length?: number;
  temperature?: number;
  top_p?: number;
}

interface GPTJResponse {
  generated_text: string;
  processing_time: number;
  model_info: {
    model: string;
    device: string;
    parameters: string;
  };
}

interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  gpu_available: boolean;
}

export class GPTJClient {
  private baseUrl: string;
  private timeout: number;
  private isConnected: boolean = false;

  constructor(baseUrl: string = 'http://localhost:8000', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  // 🧠 Generar texto con GPT-J
  async generateText(request: GPTJRequest): Promise<GPTJResponse> {
    try {
      console.log('🤖 [GPT-J] Enviando prompt al backend:', request.prompt.substring(0, 50) + '...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          max_length: request.max_length || 100,
          temperature: request.temperature || 0.7,
          top_p: request.top_p || 0.9
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ [GPT-J] Respuesta generada exitosamente');
      this.isConnected = true;
      
      return result;
    } catch (error: any) {
      console.error('❌ [GPT-J] Error generando texto:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // 🔍 Verificar estado del backend
  async checkHealth(): Promise<HealthResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout más corto para health check

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const result = await response.json();
      this.isConnected = true;
      return result;
    } catch (error: any) {
      console.warn('⚠️ [GPT-J] Backend no disponible:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // 🔧 Verificar si el backend está disponible
  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'healthy' && health.model_loaded;
    } catch {
      return false;
    }
  }

  // 📊 Obtener estado de conexión
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // ⚙️ Configurar URL del backend
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.isConnected = false; // Reset connection status
  }

  // ⏱️ Configurar timeout
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

// Instancia global del cliente
export const gptjClient = new GPTJClient();

// Función de conveniencia para generar texto
export async function generateWithGPTJ(
  prompt: string, 
  options: Partial<GPTJRequest> = {}
): Promise<string> {
  try {
    const response = await gptjClient.generateText({
      prompt,
      max_length: options.max_length || 100,
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9
    });
    
    return response.generated_text;
  } catch (error: any) {
    console.error('❌ [GPT-J API] Error generando:', error.message);
    throw new Error(`GPT-J no disponible: ${error.message}`);
  }
}

// Función para verificar disponibilidad
export async function isGPTJAvailable(): Promise<boolean> {
  try {
    return await gptjClient.isAvailable();
  } catch {
    return false;
  }
}

// Función para obtener estado detallado
export async function getGPTJStatus(): Promise<{available: boolean, details?: HealthResponse, error?: string}> {
  try {
    const details = await gptjClient.checkHealth();
    return {
      available: true,
      details
    };
  } catch (error: any) {
    return {
      available: false,
      error: error.message
    };
  }
}