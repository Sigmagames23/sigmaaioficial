# 🤖 Sigma AI GPT-J Backend

Backend en Python para integrar GPT-J de EleutherAI con la aplicación Sigma AI.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8 o superior
- GPU con al menos 24GB VRAM (recomendado)
- 32GB RAM mínimo

### 1. Configurar entorno
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Linux/Mac)
source venv/bin/activate

# Activar entorno (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Iniciar servidor
```bash
# Método 1: Script automático
chmod +x start.sh
./start.sh

# Método 2: Manual
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Verificar funcionamiento
```bash
# Verificar estado
curl http://localhost:8000/health

# Probar generación
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explica qué es la inteligencia artificial"}'
```

## 📡 API Endpoints

### `GET /health`
Verificar estado del servicio
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda",
  "gpu_available": true
}
```

### `POST /generate`
Generar texto con GPT-J
```json
{
  "prompt": "Tu prompt aquí",
  "max_length": 100,
  "temperature": 0.7,
  "top_p": 0.9
}
```

Respuesta:
```json
{
  "generated_text": "Texto generado...",
  "processing_time": 2.5,
  "model_info": {
    "model": "EleutherAI/gpt-j-6B",
    "device": "cuda",
    "parameters": "6B"
  }
}
```

## ⚙️ Configuración

### Variables de entorno
```bash
# Opcional: configurar cache de Hugging Face
export HF_HOME=/path/to/cache

# Configurar GPU (si tienes múltiples)
export CUDA_VISIBLE_DEVICES=0
```

### Optimizaciones de memoria
- El modelo usa `torch.float16` en GPU para reducir memoria
- `low_cpu_mem_usage=True` para carga eficiente
- `device_map="auto"` para distribución automática en múltiples GPUs

## 🔧 Troubleshooting

### Error de memoria
```bash
# Reducir batch size o usar CPU
# Editar main.py y cambiar device a "cpu"
```

### Modelo no carga
```bash
# Verificar espacio en disco (modelo ~24GB)
df -h

# Limpiar cache si es necesario
rm -rf ~/.cache/huggingface/
```

### Puerto ocupado
```bash
# Cambiar puerto en main.py o usar otro
uvicorn main:app --port 8001
```

## 📊 Monitoreo

### Logs
```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Verificar uso de GPU
nvidia-smi
```

### Métricas
- Tiempo de respuesta promedio: 2-5 segundos
- Memoria GPU utilizada: ~20-24GB
- CPU: Variable según configuración

## 🚀 Despliegue en Producción

### Docker (Recomendado)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Consideraciones
- Usar balanceador de carga para múltiples instancias
- Implementar cache Redis para respuestas frecuentes
- Configurar límites de rate limiting
- Monitoreo con Prometheus/Grafana

## 🔒 Seguridad

- Implementar autenticación API key
- Configurar CORS apropiadamente
- Validar y sanitizar inputs
- Implementar rate limiting
- Logs de auditoría

## 📈 Escalabilidad

- Usar múltiples workers con Gunicorn
- Implementar queue system (Celery + Redis)
- Cache de respuestas frecuentes
- Auto-scaling basado en carga