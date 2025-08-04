import React from 'react';
import { Brain, Sparkles, Zap, Image, Video, FileText, MessageSquare, ArrowRight, Check, Star, Shield, Copyright } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Sigma AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Tu Asistente de Inteligencia Artificial Personal
            </p>
            
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              IA avanzada sin límites - Generación de imágenes - Análisis de archivos - Optimizado para móviles
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg font-semibold"
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="flex -space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm">IA Avanzada</span>
              </div>
            </div>

            {/* Copyright Notice en Hero más pequeño */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-black/10 backdrop-blur-md rounded-lg px-3 py-1 border border-white/5">
              <Copyright className="w-3 h-3" />
              <span>© {currentYear} Sigma AI. Tecnología protegida.</span>
              <Shield className="w-3 h-3 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Qué es Sigma AI?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sigma AI es tu asistente personal de inteligencia artificial avanzado con capacidades de generación de imágenes,
              análisis inteligente de archivos y conversaciones naturales sin límites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chat Inteligente</h3>
              <p className="text-gray-300 text-sm">
                Conversaciones naturales con IA avanzada sin límites de tokens ni restricciones.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Generación de Imágenes</h3>
              <p className="text-gray-300 text-sm">
                Crea imágenes únicas y de alta calidad usando IA avanzada de generación visual.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Creación de Videos</h3>
              <p className="text-gray-300 text-sm">
                Genera contenido multimedia y visual personalizado con tecnología de IA.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Análisis de Archivos</h3>
              <p className="text-gray-300 text-sm">
                Analiza archivos PDF, texto, imágenes, JSON y más con IA avanzada y extracción inteligente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Asistente de IA Avanzado
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Sigma AI utiliza tecnología de IA avanzada para ofrecerte conversaciones inteligentes,
                generación de imágenes de alta calidad y análisis profundo de archivos sin límites.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">IA avanzada sin límites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Generación de imágenes de alta calidad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Análisis inteligente de archivos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Conversaciones naturales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Optimizado para móviles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Interfaz intuitiva y moderna</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Sin Límites</div>
                    <div className="text-sm text-gray-300">Conversaciones</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">IA Avanzada</div>
                    <div className="text-sm text-gray-300">Tecnología</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Imágenes</div>
                    <div className="text-sm text-gray-300">Generación</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Archivos</div>
                    <div className="text-sm text-gray-300">Análisis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Cómo Funciona Sigma AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nuestro sistema de IA avanzada utiliza tecnología de última generación para ofrecerte la mejor experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Análisis Inteligente</h3>
              <p className="text-gray-300">
                Sigma AI analiza tu entrada usando IA avanzada para comprender exactamente lo que necesitas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Procesamiento Avanzado</h3>
              <p className="text-gray-300">
                Nuestro sistema procesa la información usando tecnología de IA de última generación.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Resultado Único</h3>
              <p className="text-gray-300">
                Genera respuestas inteligentes, imágenes únicas y análisis profundos de archivos sin límites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Experimenta la IA Avanzada
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Disfruta de un asistente de IA avanzado con generación de imágenes y análisis inteligente sin límites
          </p>
          
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white px-12 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto text-lg font-semibold"
          >
            <Brain className="w-6 h-6" />
            <span>Comenzar con Sigma AI</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-gray-400 mt-4">
            IA avanzada - Sin límites de tokens - Generación de imágenes - Análisis de archivos
          </p>

          {/* Copyright Notice en CTA más pequeño */}
          <div className="mt-6 p-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/5">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3 text-purple-400" />
              <span>
                <strong className="text-gray-400">sigmaai.ct.ws</strong> - Tecnología avanzada de IA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};