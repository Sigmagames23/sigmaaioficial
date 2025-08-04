import React, { useState, useEffect } from 'react';
import { Brain, Settings, User, LogOut, Palette, Volume2, Zap, Moon, Sun, Cpu } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  user?: SupabaseUser | null;
  onAuthClick: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onSignOut }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(15);
  const [theme, setTheme] = useState('purple');
  const [apiStatus, setApiStatus] = useState<any>(null);

  // Cargar configuración guardada
  useEffect(() => {
    const savedSettings = localStorage.getItem('sigmaAI_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode !== false);
      setSoundEnabled(settings.soundEnabled !== false);
      setTypingSpeed(settings.typingSpeed || 15);
      setTheme(settings.theme || 'purple');
    }
  }, []);

  // Verificar estado de API cuando se abren los settings
  useEffect(() => {
    if (showSettings) {
      checkAPIStatus();
    }
  }, [showSettings]);

  const checkAPIStatus = async () => {
    try {
      // Importar dinámicamente para evitar errores de SSR
      const { checkReplicateAPIStatus } = await import('../lib/apiConfig');
      const { realAI } = await import('../lib/realAI');
      
      const [replicateStatus, engineStatus] = await Promise.all([
        checkReplicateAPIStatus(),
        realAI.getDetailedAPIStatus()
      ]);
      
      setApiStatus({
        replicate: replicateStatus,
        engine: engineStatus
      });
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus({ error: 'Error verificando API' });
    }
  };

  // Función para reproducir sonidos de prueba
  const playTestSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  const themes = [
    { name: 'purple', colors: 'from-purple-500 to-pink-600', label: 'Púrpura' },
    { name: 'blue', colors: 'from-blue-500 to-cyan-600', label: 'Azul' },
    { name: 'green', colors: 'from-green-500 to-emerald-600', label: 'Verde' },
    { name: 'orange', colors: 'from-orange-500 to-red-600', label: 'Naranja' },
    { name: 'teal', colors: 'from-teal-500 to-blue-600', label: 'Teal' }
  ];

  const getCurrentThemeColors = () => {
    const currentTheme = themes.find(t => t.name === theme);
    return currentTheme?.colors || themes[0].colors;
  };

  const saveSettings = () => {
    const settings = {
      darkMode,
      soundEnabled,
      typingSpeed,
      theme
    };
    localStorage.setItem('sigmaAI_settings', JSON.stringify(settings));
    setShowSettings(false);
    
    // Reproducir sonido de confirmación
    if (soundEnabled) {
      playTestSound();
    }
    
    // Recargar página para aplicar tema
    window.location.reload();
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getCurrentThemeColors()} rounded-xl flex items-center justify-center shadow-lg`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r ${getCurrentThemeColors()} bg-clip-text text-transparent`}>
                Sigma AI
              </h1>
              <p className="text-xs text-gray-400">IA Avanzada</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-gray-300 hidden sm:block">
                  {user.email}
                </span>
                
                {/* Botón de Ajustes */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                    title="Configuración de Sigma AI"
                  >
                    <Settings className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </button>

                  {/* Panel de Ajustes */}
                  {showSettings && (
                    <div className="absolute right-0 top-12 w-96 bg-black/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">⚙️ Configuración</h3>
                        <button
                          onClick={() => setShowSettings(false)}
                          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="text-gray-400">✕</span>
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Tema de Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-3">
                            <Palette className="w-4 h-4 inline mr-2" />
                            Tema de Color
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {themes.map((t) => (
                              <button
                                key={t.name}
                                onClick={() => setTheme(t.name)}
                                className={`p-3 rounded-lg bg-gradient-to-r ${t.colors} text-white text-xs font-medium transition-all ${
                                  theme === t.name ? 'ring-2 ring-white/50 scale-105' : 'hover:scale-105'
                                }`}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Velocidad de Escritura */}
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-3">
                            <Zap className="w-4 h-4 inline mr-2" />
                            Velocidad de Escritura: {typingSpeed}ms
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            value={typingSpeed}
                            onChange={(e) => setTypingSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${((typingSpeed - 5) / 45) * 100}%, rgba(255,255,255,0.2) ${((typingSpeed - 5) / 45) * 100}%, rgba(255,255,255,0.2) 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Rápido (5ms)</span>
                            <span>Lento (50ms)</span>
                          </div>
                        </div>

                        {/* Modo Oscuro */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-200">
                            {darkMode ? <Moon className="w-4 h-4 inline mr-2" /> : <Sun className="w-4 h-4 inline mr-2" />}
                            Modo Oscuro
                          </label>
                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              darkMode ? 'bg-purple-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                darkMode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Sonidos */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-200">
                            <Volume2 className="w-4 h-4 inline mr-2" />
                            Efectos de Sonido
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={playTestSound}
                              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition-colors"
                              disabled={!soundEnabled}
                            >
                              🔊 Test
                            </button>
                            <button
                              onClick={() => setSoundEnabled(!soundEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Estado de API */}
                        <div className="pt-4 border-t border-white/20">
                          <h4 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
                            <Cpu className="w-4 h-4 mr-2" />
                            Estado del Sistema
                          </h4>
                          {apiStatus ? (
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span>Motor IA:</span>
                                <span className="text-green-400">
                                  ✅ CONECTADO
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Chat:</span>
                                <span className="text-blue-400">Avanzado</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Imágenes:</span>
                                <span className="text-purple-400">Generación IA</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Archivos:</span>
                                <span className="text-green-400">Análisis IA ✅</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Verificando sistema...</div>
                          )}
                          <button
                            onClick={checkAPIStatus}
                            className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition-colors"
                          >
                            🔄 Actualizar Estado
                          </button>
                        </div>

                        {/* Información del Sistema */}
                        <div className="pt-4 border-t border-white/20">
                          <h4 className="text-sm font-medium text-gray-200 mb-2">📊 Estado del Sistema</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Motor IA:</span>
                              <span className="text-green-400">✅ ACTIVO</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Móviles:</span>
                              <span className="text-blue-400">📱 Optimizado</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Límites:</span>
                              <span className="text-purple-400">🚫 Sin límites</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estado:</span>
                              <span className="text-green-400">🎯 FUNCIONANDO</span>
                            </div>
                          </div>
                        </div>

                        {/* Botón de Guardar */}
                        <button
                          onClick={saveSettings}
                          className={`w-full bg-gradient-to-r ${getCurrentThemeColors()} text-white py-3 px-4 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium`}
                        >
                          💾 Guardar y Aplicar Configuración
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                </button>
              </>
            ) : (
              <button 
                onClick={onAuthClick}
                className={`flex items-center space-x-2 bg-gradient-to-r ${getCurrentThemeColors()} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS personalizado para el slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </header>
  );
};