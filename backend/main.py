from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import os
import sys

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sigma AI GPT-J Backend", 
    version="1.0.0",
    description="Backend para integración de GPT-J con Sigma AI"
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://tu-dominio.com",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables globales para el modelo
model = None
tokenizer = None
device = "cpu"  # Por defecto CPU
model_loaded = False

class PromptRequest(BaseModel):
    prompt: str
    max_length: Optional[int] = 100
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9

class GenerationResponse(BaseModel):
    generated_text: str
    processing_time: float
    model_info: dict

@app.on_event("startup")
async def load_model():
    """Cargar el modelo GPT-J al iniciar la aplicación"""
    global model, tokenizer, device, model_loaded
    
    try:
        logger.info("🚀 Iniciando Sigma AI GPT-J Backend...")
        
        # Verificar si hay GPU disponible
        try:
            import torch
            device = "cuda" if torch.cuda.is_available() else "cpu"
            logger.info(f"🔧 Dispositivo detectado: {device}")
            
            if device == "cuda":
                logger.info(f"🎮 GPU disponible: {torch.cuda.get_device_name(0)}")
                logger.info(f"💾 Memoria GPU: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
        except ImportError:
            logger.warning("⚠️ PyTorch no disponible, usando modo simulación")
            device = "cpu"
        
        # Intentar cargar el modelo real
        try:
            from transformers import GPTJForCausalLM, AutoTokenizer
            
            logger.info("📦 Cargando modelo GPT-J...")
            model_name = "EleutherAI/gpt-j-6B"
            
            # Cargar tokenizador
            logger.info("🔤 Cargando tokenizador...")
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token
            
            # Cargar modelo con optimizaciones
            logger.info("🧠 Cargando modelo (esto puede tomar varios minutos)...")
            
            if device == "cuda":
                model = GPTJForCausalLM.from_pretrained(
                    model_name,
                    torch_dtype=torch.float16,
                    low_cpu_mem_usage=True,
                    device_map="auto"
                )
            else:
                # Para CPU, usar configuración más ligera
                model = GPTJForCausalLM.from_pretrained(
                    model_name,
                    torch_dtype=torch.float32,
                    low_cpu_mem_usage=True
                )
                model = model.to(device)
            
            model_loaded = True
            logger.info(f"✅ Modelo GPT-J cargado exitosamente en {device}")
            
        except Exception as model_error:
            logger.error(f"❌ Error cargando modelo real: {model_error}")
            logger.info("🔄 Iniciando en modo simulación...")
            model_loaded = False
        
        logger.info("🌟 Backend iniciado correctamente")
        
    except Exception as e:
        logger.error(f"❌ Error crítico en startup: {e}")
        model_loaded = False

def generate_text_real(prompt: str, max_length: int = 100, temperature: float = 0.7, top_p: float = 0.9):
    """Generar texto usando GPT-J real"""
    if not model_loaded or model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    
    try:
        import torch
        
        # Preparar input
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
        
        if device == "cuda":
            inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Generar texto
        with torch.no_grad():
            outputs = model.generate(
                inputs['input_ids'],
                max_length=len(inputs['input_ids'][0]) + max_length,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                num_return_sequences=1,
                no_repeat_ngram_size=2,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id
            )
        
        # Decodificar resultado
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Remover el prompt original del resultado
        if generated_text.startswith(prompt):
            generated_text = generated_text[len(prompt):].strip()
        
        return generated_text
        
    except Exception as e:
        logger.error(f"❌ Error generando texto real: {e}")
        raise HTTPException(status_code=500, detail=f"Error en generación: {str(e)}")

def generate_text_simulation(prompt: str, max_length: int = 100, temperature: float = 0.7, top_p: float = 0.9):
    """Generar texto simulado para testing"""
    import time
    import random
    
    # Simular tiempo de procesamiento
    time.sleep(random.uniform(1, 3))
    
    # Respuestas simuladas inteligentes
    if "hola" in prompt.lower() or "hello" in prompt.lower():
        return "Hola, soy GPT-J ejecutándose localmente. ¿En qué puedo ayudarte?"
    elif "qué" in prompt.lower() or "what" in prompt.lower():
        return "Soy un modelo de lenguaje GPT-J de 6B parámetros ejecutándose en tu servidor local. Puedo ayudarte con diversas tareas de procesamiento de lenguaje natural."
    elif "código" in prompt.lower() or "code" in prompt.lower():
        return "Puedo ayudarte con programación y análisis de código. Comparte tu código y te ayudo a mejorarlo."
    else:
        return f"He procesado tu mensaje: '{prompt[:50]}...' usando GPT-J local. Esta es una respuesta simulada mientras el modelo real se carga."

@app.post("/generate", response_model=GenerationResponse)
async def generate_text_api(request: PromptRequest):
    """Endpoint para generar texto"""
    import time
    
    start_time = time.time()
    
    try:
        logger.info(f"📝 Generando texto para prompt: {request.prompt[:50]}...")
        
        if model_loaded:
            generated_text = generate_text_real(
                prompt=request.prompt,
                max_length=request.max_length,
                temperature=request.temperature,
                top_p=request.top_p
            )
            model_type = "GPT-J Real"
        else:
            generated_text = generate_text_simulation(
                prompt=request.prompt,
                max_length=request.max_length,
                temperature=request.temperature,
                top_p=request.top_p
            )
            model_type = "GPT-J Simulado"
        
        processing_time = time.time() - start_time
        
        logger.info(f"✅ Texto generado en {processing_time:.2f}s usando {model_type}")
        
        return GenerationResponse(
            generated_text=generated_text,
            processing_time=processing_time,
            model_info={
                "model": "EleutherAI/gpt-j-6B",
                "device": device,
                "parameters": "6B",
                "type": model_type,
                "loaded": model_loaded
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Error en generación: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Verificar estado del servicio"""
    try:
        import torch
        gpu_available = torch.cuda.is_available()
        gpu_count = torch.cuda.device_count() if gpu_available else 0
    except ImportError:
        gpu_available = False
        gpu_count = 0
    
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "device": device,
        "gpu_available": gpu_available,
        "gpu_count": gpu_count,
        "backend_version": "1.0.0",
        "model_type": "GPT-J Real" if model_loaded else "GPT-J Simulado"
    }

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Sigma AI GPT-J Backend", 
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model_loaded,
        "endpoints": {
            "health": "/health",
            "generate": "/generate",
            "docs": "/docs"
        }
    }

@app.get("/status")
async def detailed_status():
    """Estado detallado del sistema"""
    try:
        import torch
        import psutil
        
        return {
            "system": {
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage('/').percent
            },
            "gpu": {
                "available": torch.cuda.is_available(),
                "count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
                "current_device": device
            },
            "model": {
                "loaded": model_loaded,
                "name": "EleutherAI/gpt-j-6B" if model_loaded else "Simulación",
                "device": device
            }
        }
    except ImportError:
        return {
            "system": "Info no disponible",
            "gpu": {"available": False},
            "model": {"loaded": model_loaded}
        }

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Iniciando servidor Sigma AI GPT-J...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")