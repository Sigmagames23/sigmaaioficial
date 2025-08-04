import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap, Image, FileText, Mic } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando Sigma AI...', 
  progress = 0 
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([
    { icon: Brain, label: 'Inicializando motor de IA', completed: false },
    { icon: Sparkles, label: 'Cargando capacidades creativas', completed: false },
    { icon: Image, label: 'Preparando generación de imágenes', completed: false },
    { icon: FileText, label: 'Activando análisis de archivos', completed: false },
    { icon: Mic, label: 'Habilitando procesamiento de audio', completed: false },
    { icon: Zap, label: 'Optimizando rendimiento', completed: false }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, progress || 90);
        
        // Actualizar pasos completados basado en el progreso
        setLoadingSteps(steps => 
          steps.map((step, index) => ({
            ...step,
            completed: newProgress > (index + 1) * (100 / steps.length)
          }))
        );
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Logo animado */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          {/* Anillos de carga */}
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-xl border-2 border-pink-500/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Sigma AI
        </h1>
        <p className="text-gray-300 mb-8">Advanced Intelligence</p>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{message}</span>
            <span className="text-sm text-purple-400">{Math.round(currentProgress)}%</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${currentProgress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Pasos de carga */}
        <div className="space-y-3">
          {loadingSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  step.completed 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {step.completed ? (
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>
                
                <span className={`text-sm transition-colors ${
                  step.completed ? 'text-green-300' : 'text-gray-300'
                }`}>
                  {step.label}
                </span>
                
                {step.completed && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Motor de IA real</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>APIs conectadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Análisis inteligente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span>Generación creativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};