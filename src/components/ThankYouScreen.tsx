import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Brain, ArrowRight } from 'lucide-react';

interface ThankYouScreenProps {
  userEmail: string;
  onContinue: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ userEmail, onContinue }) => {
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setShowContent(true), 300);
    
    // Progreso animado
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className={`max-w-md w-full text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Icono de éxito animado */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Anillos de celebración */}
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-emerald-400/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          ¡Bienvenido a Sigma AI!
        </h1>
        
        <p className="text-xl text-gray-300 mb-2">
          Gracias por registrarte
        </p>
        
        <p className="text-gray-400 mb-8">
          {userEmail}
        </p>

        {/* Características destacadas */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Tu IA está lista</span>
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Chat inteligente sin límites</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Generación de imágenes con IA</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Análisis inteligente de archivos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Optimizado para móviles</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Configurando tu experiencia</span>
            <span className="text-sm text-purple-400">{progress}%</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Botón de continuar */}
        <button
          onClick={onContinue}
          disabled={progress < 100}
          className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
            progress >= 100
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {progress >= 100 ? (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Comenzar con Sigma AI</span>
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Preparando tu IA...</span>
            </>
          )}
        </button>

        {/* Mensaje adicional */}
        <p className="text-xs text-gray-500 mt-4">
          IA avanzada • Sin límites • sigmaai.ct.ws
        </p>
      </div>
    </div>
  );
};