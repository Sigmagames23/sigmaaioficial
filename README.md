# 🧠 Sigma AI - Asistente de Inteligencia Artificial Avanzado

![Sigma AI](https://img.shields.io/badge/Sigma%20AI-v2.0.0-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green?style=for-the-badge&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5.4.2-yellow?style=for-the-badge&logo=vite)

**Sigma AI** es tu asistente personal de inteligencia artificial con capacidades avanzadas de generación de contenido, análisis inteligente de archivos y conversaciones naturales. Construido con tecnologías modernas y un motor de IA completamente independiente.

## ✨ Características Principales

### 🤖 **Motor de IA Avanzado**
- **Conversaciones inteligentes** con respuestas contextuales y naturales
- **Efecto de escritura progresiva** para una experiencia inmersiva
- **Memoria conversacional** que mantiene el contexto entre mensajes
- **Respuestas únicas** generadas dinámicamente

### 🎨 **Generación de Contenido**
- **Generación de imágenes** con IA real usando Hugging Face FLUX.1-dev
- **Creación de videos** personalizados (próximamente)
- **Prompts inteligentes** con optimización automática
- **Calidad profesional** en todas las generaciones

### 📄 **Análisis Inteligente de Archivos**
- **Lectura completa** de documentos de texto, JSON, CSV
- **Análisis de imágenes** con reconocimiento de contenido
- **Procesamiento de videos** y multimedia
- **Extracción de datos** estructurados y metadatos
- **Respuestas específicas** sobre el contenido de los archivos

### 🎤 **Procesamiento de Audio**
- **Grabación de voz** integrada en el navegador
- **Transcripción de audio** (simulada, expandible a APIs reales)
- **Procesamiento en tiempo real** de grabaciones
- **Interfaz intuitiva** para control de audio

### 🎨 **Personalización Completa**
- **5 temas de color** dinámicos (Púrpura, Azul, Verde, Naranja, Teal)
- **Efectos de sonido** configurables con Web Audio API
- **Velocidad de escritura** ajustable (5ms - 50ms)
- **Modo oscuro/claro** con persistencia
- **Configuración guardada** en localStorage

### 🔒 **Seguridad y Privacidad**
- **Autenticación segura** con Supabase Auth
- **Row Level Security (RLS)** en base de datos
- **Datos encriptados** en tránsito y reposo
- **Sesiones persistentes** con auto-renovación
- **OAuth con Google** disponible

## 🚀 Tecnologías Utilizadas

### **Frontend**
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.5.3** - Tipado estático para JavaScript
- **Tailwind CSS 3.4.1** - Framework de CSS utilitario
- **Vite 5.4.2** - Herramienta de construcción ultra-rápida
- **Lucide React** - Iconos modernos y consistentes

### **Backend & Base de Datos**
- **Supabase** - Backend como servicio con PostgreSQL
- **Row Level Security** - Seguridad a nivel de fila
- **Real-time subscriptions** - Actualizaciones en tiempo real
- **Storage** - Almacenamiento de archivos seguro

### **APIs de IA**
- **OpenRouter** - API para modelos de lenguaje (Claude 3.5 Sonnet)
- **Hugging Face** - Generación de imágenes con FLUX.1-dev
- **Web Audio API** - Procesamiento de audio nativo

### **PWA & Performance**
- **Service Worker** - Funcionalidad offline
- **Manifest.json** - Instalación como app nativa
- **Code Splitting** - Carga optimizada de recursos
- **Lazy Loading** - Carga bajo demanda
- **Error Boundaries** - Manejo robusto de errores

## 📦 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18.0.0 o superior
- npm 8.0.0 o superior
- Cuenta de Supabase
- API keys de OpenRouter y Hugging Face

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sigma-ai.git
cd sigma-ai
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# API Keys (configuradas en src/lib/apiConfig.ts)
# OpenRouter API Key para respuestas de IA
# Hugging Face API Key para generación de imágenes
```

### **4. Configurar Supabase**

#### **Base de Datos**
Ejecuta las migraciones incluidas en `supabase/migrations/`:
```sql
-- Las migraciones se ejecutan automáticamente
-- Incluyen tablas para conversaciones, mensajes, archivos y media generada
```

#### **Autenticación**
En el Dashboard de Supabase:
1. **Authentication > Settings**:
   - ✅ Enable signup
   - ❌ Enable email confirmations (deshabilitado para registro instantáneo)
   - ✅ Enable auto-confirm users

2. **Authentication > Providers**:
   - ✅ Google OAuth (opcional)
   - Configurar Client ID y Client Secret

#### **Storage**
Los buckets se crean automáticamente:
- `user-files` - Archivos subidos por usuarios
- `generated-media` - Contenido generado por IA

### **5. Configurar APIs de IA**

#### **OpenRouter (Respuestas de Chat)**
1. Crear cuenta en [OpenRouter](https://openrouter.ai)
2. Obtener API key
3. Actualizar en `src/lib/apiConfig.ts`:
```typescript
openrouter: {
  apiKey: 'tu-openrouter-api-key',
  // ...
}
```

#### **Hugging Face (Generación de Imágenes)**
1. Crear cuenta en [Hugging Face](https://huggingface.co)
2. Obtener API token
3. Actualizar en `src/lib/apiConfig.ts`:
```typescript
huggingface: {
  apiKey: 'tu-huggingface-token',
  // ...
}
```

### **6. Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Construcción para Producción

### **Build optimizado**
```bash
npm run build
```

### **Preview de producción**
```bash
npm run preview
```

### **Análisis de bundle**
```bash
npm run build:analyze
```

## 📱 Características PWA

### **Instalación como App**
- **Manifest.json** configurado para instalación
- **Service Worker** para funcionalidad offline
- **Iconos optimizados** para todas las plataformas
- **Shortcuts** para acciones rápidas

### **Funcionalidad Offline**
- **Cache inteligente** de recursos estáticos
- **Estrategias de cache** diferenciadas por tipo de contenido
- **Fallbacks** para contenido no disponible
- **Sincronización en background** (preparado para expansión)

## 🎯 Uso de la Aplicación

### **1. Registro/Inicio de Sesión**
- **Registro instantáneo** sin confirmación de email
- **Login con Google** disponible
- **Sesiones persistentes** automáticas

### **2. Chat Inteligente**
- **Conversaciones naturales** con Sigma AI
- **Respuestas contextuales** basadas en historial
- **Efecto de escritura** configurable
- **Memoria conversacional** activa

### **3. Generación de Imágenes**
- Usar prompts como: *"Genera una imagen de..."*
- **Calidad profesional** con FLUX.1-dev
- **Descarga directa** de imágenes generadas
- **Historial** de generaciones

### **4. Análisis de Archivos**
- **Arrastrar y soltar** archivos en el chat
- **Lectura completa** del contenido
- **Análisis inteligente** con insights
- **Respuestas específicas** sobre el contenido

### **5. Grabación de Audio**
- **Clic en micrófono** para iniciar grabación
- **Transcripción automática** (simulada)
- **Procesamiento inteligente** del audio
- **Respuestas contextuales** al contenido hablado

### **6. Personalización**
- **Clic en ⚙️** en el header
- **Seleccionar tema** de color
- **Ajustar velocidad** de escritura
- **Configurar sonidos** con botón de prueba
- **Guardar configuración** persistente

## 🔧 Arquitectura del Proyecto

```
sigma-ai/
├── public/                 # Archivos estáticos
│   ├── manifest.json      # Configuración PWA
│   ├── sw.js             # Service Worker
│   └── favicon.svg       # Iconos
├── src/
│   ├── components/       # Componentes React
│   │   ├── Chat.tsx     # Chat principal
│   │   ├── Header.tsx   # Barra superior
│   │   ├── AuthModal.tsx # Modal de autenticación
│   │   ├── LandingPage.tsx # Página de inicio
│   │   ├── LoadingScreen.tsx # Pantalla de carga
│   │   └── ErrorBoundary.tsx # Manejo de errores
│   ├── lib/             # Lógica de negocio
│   │   ├── supabase.ts  # Cliente Supabase
│   │   ├── auth.ts      # Autenticación
│   │   ├── database.ts  # Operaciones de BD
│   │   ├── apiConfig.ts # Configuración APIs
│   │   └── realAI.ts    # Motor de IA
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── supabase/
│   ├── migrations/      # Migraciones de BD
│   └── functions/       # Edge Functions
└── package.json         # Dependencias y scripts
```

## 🚀 Deployment

### **Netlify (Recomendado)**
1. Conectar repositorio a Netlify
2. Configurar variables de entorno
3. Build command: `npm run build`
4. Publish directory: `dist`

### **Vercel**
1. Importar proyecto en Vercel
2. Configurar variables de entorno
3. Deploy automático desde Git

### **Variables de Entorno en Producción**
```env
VITE_SUPABASE_URL=tu_supabase_url_produccion
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_produccion
```

## 🔍 Monitoreo y Analytics

### **Error Tracking**
- **Error Boundaries** para captura de errores
- **Console logging** estructurado
- **Preparado para Sentry** u otros servicios

### **Performance Monitoring**
- **Web Vitals** tracking preparado
- **Bundle analysis** con Vite
- **Lighthouse** optimizations aplicadas

## 🤝 Contribución

### **Desarrollo Local**
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### **Estándares de Código**
- **TypeScript** estricto habilitado
- **ESLint** configurado
- **Prettier** para formateo
- **Conventional Commits** recomendado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

### **Documentación**
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **Contacto**
- **Email**: support@sigma-ai.app
- **GitHub Issues**: [Reportar problema](https://github.com/tu-usuario/sigma-ai/issues)

## 🎉 Agradecimientos

- **OpenRouter** por el acceso a modelos de IA avanzados
- **Hugging Face** por la generación de imágenes de calidad
- **Supabase** por la infraestructura backend robusta
- **Comunidad Open Source** por las herramientas increíbles

---

**Desarrollado con ❤️ por el equipo de Sigma AI**

*Sigma AI - Donde la inteligencia artificial se encuentra con la creatividad*