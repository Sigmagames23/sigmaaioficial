#!/bin/bash

echo "🚀 Iniciando Sigma AI GPT-J Backend..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar Python
print_status "Verificando Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python3 no encontrado. Por favor instala Python 3.8 o superior."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
print_success "Python $PYTHON_VERSION encontrado"

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    print_status "Creando entorno virtual..."
    python3 -m venv venv
    if [ $? -eq 0 ]; then
        print_success "Entorno virtual creado"
    else
        print_error "Error creando entorno virtual"
        exit 1
    fi
fi

# Activar entorno virtual
print_status "Activando entorno virtual..."
source venv/bin/activate

# Verificar activación
if [[ "$VIRTUAL_ENV" != "" ]]; then
    print_success "Entorno virtual activado: $VIRTUAL_ENV"
else
    print_error "Error activando entorno virtual"
    exit 1
fi

# Actualizar pip
print_status "Actualizando pip..."
pip install --upgrade pip

# Instalar dependencias
print_status "Instalando dependencias..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_success "Dependencias instaladas correctamente"
    else
        print_warning "Algunas dependencias pueden haber fallado, continuando..."
    fi
else
    print_error "requirements.txt no encontrado"
    exit 1
fi

# Verificar GPU
print_status "Verificando disponibilidad de GPU..."
python3 -c "
try:
    import torch
    if torch.cuda.is_available():
        print(f'✅ GPU disponible: {torch.cuda.get_device_name(0)}')
        print(f'💾 Memoria GPU: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB')
    else:
        print('⚠️  GPU no disponible, usando CPU')
except ImportError:
    print('⚠️  PyTorch no instalado, funcionará en modo simulación')
"

# Verificar puerto
print_status "Verificando puerto 8000..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Puerto 8000 ocupado. Intentando cerrar proceso..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 2
fi

# Crear directorio de logs si no existe
mkdir -p logs

print_success "Configuración completada"
print_status "Iniciando servidor en puerto 8000..."

# Iniciar servidor con logs
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info 2>&1 | tee logs/server.log &

# Obtener PID del proceso
SERVER_PID=$!

# Esperar un momento para que el servidor inicie
sleep 3

# Verificar si el servidor está corriendo
if ps -p $SERVER_PID > /dev/null; then
    print_success "✅ Backend iniciado correctamente!"
    print_success "🌐 Servidor disponible en: http://localhost:8000"
    print_success "📚 Documentación API: http://localhost:8000/docs"
    print_success "❤️  Health check: http://localhost:8000/health"
    print_status "📋 PID del proceso: $SERVER_PID"
    print_status "📝 Logs guardados en: logs/server.log"
    echo ""
    print_status "Para detener el servidor: kill $SERVER_PID"
    print_status "Para ver logs en tiempo real: tail -f logs/server.log"
    
    # Esperar a que el usuario presione Ctrl+C
    echo ""
    print_status "Presiona Ctrl+C para detener el servidor..."
    wait $SERVER_PID
else
    print_error "❌ Error iniciando el servidor"
    exit 1
fi