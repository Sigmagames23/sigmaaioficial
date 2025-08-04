// 🔑 CONFIGURACIÓN EXCLUSIVA REPLICATE LLAVA MISTRAL 7B
// Usando el token: r8_DI47oEZwuC3Lrh6FYOaSCQlN6wuDOAT3KK1O9

export const API_CONFIG = {
  // Replicate API - LLaVA v1.6 Mistral 7B
  replicate: {
    apiKey: 'r8_DI47oEZwuC3Lrh6FYOaSCQlN6wuDOAT3KK1O9',
    baseUrl: 'https://api.replicate.com/v1',
    model: 'yorickvp/llava-v1.6-mistral-7b',
    version: '19be067b589d0c46689ffa7cc3ff321447a441986a7694c01225973c2eafc874'
  }
};

// Función para llamadas a LLaVA Mistral 7B con soporte de imágenes
export async function callReplicateAPI(prompt: string, systemPrompt?: string, imageUrl?: string) {
  try {
    console.log('🤖 [LLAVA MISTRAL] Generando respuesta...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos para imágenes
    
    // Formatear prompt según especificaciones
    const formattedPrompt = `USER: ${prompt}\nASSISTANT:`;

    // Preparar input según si hay imagen o no
    const input: any = {
      prompt: formattedPrompt,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9
    };

    // Agregar imagen si se proporciona
    if (imageUrl) {
      input.image = imageUrl;
      console.log('🖼️ [LLAVA MISTRAL] Procesando imagen:', imageUrl);
    }

    // Crear predicción
    const response = await fetch(`${API_CONFIG.replicate.baseUrl}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_CONFIG.replicate.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Sigma-AI/2.0'
      },
      body: JSON.stringify({
        version: API_CONFIG.replicate.version,
        input
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [LLAVA MISTRAL] Error:', response.status, errorText);
      throw new Error(`Replicate API error: ${response.status} - ${errorText}`);
    }

    const prediction = await response.json();
    console.log('🔄 [LLAVA MISTRAL] Predicción iniciada:', prediction.id);

    // Esperar a que la predicción se complete
    return await waitForPrediction(prediction.id);
  } catch (error) {
    console.error('❌ [LLAVA MISTRAL] Error:', error);
    throw error;
  }
}

// Función para esperar a que se complete la predicción
async function waitForPrediction(predictionId: string): Promise<string> {
  const maxAttempts = 90; // 90 intentos (1.5 minutos)
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
      
      const response = await fetch(`${API_CONFIG.replicate.baseUrl}/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${API_CONFIG.replicate.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error checking prediction: ${response.status}`);
      }

      const prediction = await response.json();
      console.log(`🔄 [LLAVA MISTRAL] Estado: ${prediction.status} (intento ${attempts + 1})`);
      
      if (prediction.status === 'succeeded') {
        console.log('✅ [LLAVA MISTRAL] Respuesta generada exitosamente');
        
        // Procesar la salida
        let output = '';
        if (Array.isArray(prediction.output)) {
          output = prediction.output.join('');
        } else if (typeof prediction.output === 'string') {
          output = prediction.output;
        } else {
          output = String(prediction.output || '');
        }
        
        // Limpiar la respuesta
        return cleanLLaVAResponse(output);
      } else if (prediction.status === 'failed') {
        const errorMsg = prediction.error || 'Unknown error';
        console.error('❌ [LLAVA MISTRAL] Predicción falló:', errorMsg);
        throw new Error(`Prediction failed: ${errorMsg}`);
      } else if (prediction.status === 'canceled') {
        throw new Error('Prediction was canceled');
      }

      attempts++;
    } catch (error) {
      console.error('❌ [LLAVA MISTRAL] Error checking prediction:', error);
      if (attempts >= maxAttempts - 1) {
        throw error;
      }
      attempts++;
    }
  }

  throw new Error('Prediction timed out after 90 seconds');
}

// Función para limpiar la respuesta de LLaVA
function cleanLLaVAResponse(output: string): string {
  let cleaned = output.trim();
  
  // Remover prefijos y sufijos comunes
  cleaned = cleaned
    .replace(/^(USER:|ASSISTANT:)\s*/gi, '')
    .replace(/^(Assistant:|Asistente:|AI:|IA:)\s*/i, '')
    .replace(/^(User:|Usuario:)\s*/i, '')
    .replace(/\n\nUSER:.*$/s, '') // Remover cualquier prompt adicional
    .trim();
  
  // Si la respuesta está vacía o muy corta, devolver mensaje por defecto
  if (!cleaned || cleaned.length < 5) {
    return 'He procesado tu consulta. ¿Podrías ser más específico sobre lo que necesitas?';
  }
  
  return cleaned;
}

// Función para verificar estado de Replicate API
export async function checkReplicateAPIStatus() {
  try {
    console.log('🔍 [LLAVA MISTRAL] Verificando estado...');
    
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000); // 5 segundos máximo
    
    const response = await fetch(`${API_CONFIG.replicate.baseUrl}/models/${API_CONFIG.replicate.model}`, {
      headers: {
        'Authorization': `Token ${API_CONFIG.replicate.apiKey}`,
      },
      signal: controller.signal,
      method: 'GET'
    });

    const status = response.ok;
    console.log(`📊 [LLAVA MISTRAL] Estado: ${status ? 'CONECTADO ✅' : 'DESCONECTADO ❌'}`);
    return status;
  } catch (error) {
    console.error('❌ [LLAVA MISTRAL] Error verificando estado:', error);
    return false;
  }
}

console.log('🔑 [API CONFIG] Configuración LLaVA v1.6 Mistral 7B cargada');
console.log('🤖 [API CONFIG] Token configurado:', API_CONFIG.replicate.apiKey.substring(0, 8) + '...');
console.log('📋 [API CONFIG] Modelo:', API_CONFIG.replicate.model);
console.log('🔢 [API CONFIG] Versión:', API_CONFIG.replicate.version);