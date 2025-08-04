import React, { useState, useEffect } from 'react';
import { Wand2, Image, Video, Palette, Sparkles, Download, Clock, Zap, Brain } from 'lucide-react';
import { SigmaAIEngine } from '../lib/aiEngine';
import { createGeneratedMedia, getGeneratedMedia, updateGeneratedMedia } from '../lib/database';
import { User } from 'firebase/auth';
import type { GeneratedMedia } from '../lib/database';

interface MediaGeneratorProps {
  user: User | null;
  activeType: 'images' | 'videos';
}

export const MediaGenerator: React.FC<MediaGeneratorProps> = ({ user, activeType }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedItems, setGeneratedItems] = useState<GeneratedMedia[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [engineInfo, setEngineInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadGeneratedMedia();
      // Obtener información del motor
      setEngineInfo(SigmaAIEngine.getEngineInfo());
    }
  }, [user]);

  const loadGeneratedMedia = async () => {
    if (!user) return;
    
    try {
      const media = await getGeneratedMedia(user.uid);
      setGeneratedItems(media);
    } catch (error) {
      console.error('Error loading generated media:', error);
    }
  };

  const handleGenerateMedia = async () => {
    if (!prompt.trim() || !user) return;

    setIsGenerating(true);
    
    try {
      const mediaType = activeType === 'images' ? 'image' : 'video';
      const mediaRecord = await createGeneratedMedia(user.uid, mediaType, prompt);
      setGeneratedItems(prev => [mediaRecord, ...prev]);
      
      const currentPrompt = prompt;
      setPrompt('');

      console.log(`🚀 [MEDIA GENERATOR] Iniciando generación real de ${mediaType}...`);
      console.log(`📝 [MEDIA GENERATOR] Prompt: "${currentPrompt}"`);

      // Generar contenido usando APIs reales
      let result;
      if (mediaType === 'image') {
        result = await SigmaAIEngine.generateImage(currentPrompt, {
          style: 'realistic',
          size: '1024x1024'
        });
      } else {
        result = await SigmaAIEngine.generateVideo(currentPrompt, {
          duration: 5,
          fps: 24,
          resolution: '1280x720'
        });
      }

      console.log(`✅ [MEDIA GENERATOR] ${mediaType} real generado exitosamente!`);

      // Actualizar registro con resultado
      await updateGeneratedMedia(mediaRecord.id, result);
      
      setGeneratedItems(prev => prev.map(item => 
        item.id === mediaRecord.id 
          ? { ...item, downloadUrl: result, status: 'completed' }
          : item
      ));
    } catch (error) {
      console.error('Error generating media:', error);
      
      // Actualizar estado de error
      setGeneratedItems(prev => prev.map(item => 
        item.id === prev[0]?.id 
          ? { ...item, status: 'error' }
          : item
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const presetPrompts = {
    images: [
      "Un paisaje futurista con ciudades flotantes y luces neón violetas",
      "Retrato artístico de una persona en estilo cyberpunk con elementos holográficos",
      "Atardecer mágico en una playa tropical con palmeras y reflejos dorados",
      "Gato espacial con casco de astronauta flotando entre estrellas brillantes",
      "Arquitectura moderna minimalista con cristales y geometría perfecta",
      "Bosque encantado con luces místicas y criaturas fantásticas",
      "Ciudad submarina con estructuras de coral y peces luminosos",
      "Montañas nevadas al amanecer con aurora boreal en el cielo"
    ],
    videos: [
      "Animación de ondas oceánicas relajantes al atardecer con colores cálidos",
      "Transición épica de día a noche en una ciudad moderna con luces",
      "Partículas de luz dorada flotando suavemente en el espacio profundo",
      "Crecimiento acelerado de una planta mágica con flores que brillan",
      "Lluvia cayendo suavemente en una ventana con gotas que se deslizan",
      "Vuelo cinematográfico sobre un valle verde con montañas majestuosas",
      "Transformación de estaciones en un mismo paisaje de forma fluida",
      "Danza de luces aurora boreal en un cielo estrellado nocturno"
    ]
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Inicia sesión para generar contenido</h2>
          <p className="text-gray-300 mb-4">Necesitas una cuenta para usar el generador de medios Sigma AI</p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Generación con APIs reales</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Contenido de alta calidad</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              {activeType === 'images' ? <Image className="w-4 h-4 text-white" /> : <Video className="w-4 h-4 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {activeType === 'images' ? 'Generador de Imágenes' : 'Generador de Videos'} Sigma AI
            </h2>
          </div>
          <p className="text-gray-300">Crea contenido real con APIs de IA avanzadas</p>
          
          {/* Engine Info */}
          {engineInfo && (
            <div className="mt-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">APIs Reales: {engineInfo.apis.status}</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-300">{activeType === 'images' ? 'Hugging Face FLUX.1' : 'Video API'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Generation Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6 shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Describe lo que quieres generar con IA real
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe detalladamente tu ${activeType === 'images' ? 'imagen' : 'video'} ideal. La IA real creará contenido único basado en tu descripción...`}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          {/* Preset Prompts */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-200 mb-2">Prompts sugeridos para IA real:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {presetPrompts[activeType].map((presetPrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(presetPrompt)}
                  className="text-sm bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-2 rounded-lg transition-colors border border-white/20 text-left"
                >
                  {presetPrompt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateMedia}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>IA real generando {activeType === 'images' ? 'imagen' : 'video'}...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generar {activeType === 'images' ? 'Imagen' : 'Video'} con IA Real</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Items */}
        {generatedItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Contenido Generado con IA Real</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedItems.filter(item => item.mediaType === (activeType === 'images' ? 'image' : 'video')).map(item => (
                <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="aspect-square bg-black/20 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {item.status === 'generating' ? (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Brain className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">IA real generando...</p>
                        <p className="text-xs text-gray-400 mt-1">APIs procesando</p>
                      </div>
                    ) : item.status === 'error' ? (
                      <div className="text-center">
                        <p className="text-sm text-red-400">Error en generación</p>
                        <p className="text-xs text-gray-400 mt-1">Intenta de nuevo</p>
                      </div>
                    ) : item.downloadUrl ? (
                      item.mediaType === 'image' ? (
                        <img
                          src={item.downloadUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={item.downloadUrl}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23fff'%3E▶%3C/text%3E%3C/svg%3E"
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Contenido no disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {item.createdAt.toLocaleString()}
                        </span>
                        {item.status === 'completed' && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                            ✓ IA Real
                          </span>
                        )}
                      </div>
                      {item.status === 'completed' && item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          download
                          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                          title="Descargar contenido generado por IA real"
                        >
                          <Download className="w-4 h-4 text-gray-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};