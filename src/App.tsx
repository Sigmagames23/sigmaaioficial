import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThankYouScreen } from './components/ThankYouScreen';
import { onAuthStateChange, signOut, getCurrentUser } from './lib/auth';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Inicializando Sigma AI...');

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeApp = async () => {
      try {
        console.log('🚀 [APP] Inicializando aplicación...');
        setError(null);
        setLoadingMessage('Conectando con servicios...');
        setLoadingProgress(20);
        
        // Verificar usuario actual con timeout
        const userPromise = getCurrentUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        let currentUser = null;
        try {
          setLoadingMessage('Verificando autenticación...');
          setLoadingProgress(40);
          
          const result = await Promise.race([userPromise, timeoutPromise]) as any;
          currentUser = result.user;
        } catch (error) {
          console.warn('⚠️ [APP] Timeout o error obteniendo usuario, continuando sin auth');
          currentUser = null;
        }
        
        setLoadingMessage('Configurando interfaz...');
        setLoadingProgress(60);
        
        if (mounted) {
          if (currentUser) {
            console.log('✅ [APP] Usuario encontrado:', currentUser.email);
            setUser(currentUser);
            setShowLanding(false);
          } else {
            console.log('ℹ️ [APP] No hay usuario autenticado');
            setUser(null);
            setShowLanding(true);
          }
        }

        setLoadingMessage('Activando motor de IA...');
        setLoadingProgress(80);

        // Configurar listener de cambios de autenticación
        try {
          authSubscription = onAuthStateChange((user) => {
            if (mounted) {
              console.log('🔄 [APP] Cambio de estado de auth:', user?.email || 'sin usuario');
              setUser(user);
              if (user) {
                setShowLanding(false);
              } else {
                setShowLanding(true);
              }
            }
          });
        } catch (error) {
          console.warn('⚠️ [APP] Error configurando auth listener:', error);
        }

        setLoadingMessage('Finalizando carga...');
        setLoadingProgress(100);

        // Finalizar carga después de un tiempo mínimo
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
          }
        }, 800); // Tiempo suficiente para mostrar progreso completo

      } catch (error) {
        console.error('❌ [APP] Error crítico inicializando:', error);
        if (mounted) {
          setError('Error inicializando la aplicación');
          setLoading(false);
          setShowLanding(true);
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
      if (authSubscription) {
        try {
          authSubscription.unsubscribe();
        } catch (error) {
          console.warn('⚠️ [APP] Error desuscribiendo auth:', error);
        }
      }
    };
  }, []);

  const handleGetStarted = () => {
    console.log('🎯 [APP] Get started clicked');
    setShowLanding(false);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🚪 [APP] Cerrando sesión...');
      await signOut();
      setUser(null);
      setShowLanding(true);
      setShowAuthModal(false);
    } catch (error) {
      console.error('❌ [APP] Error cerrando sesión:', error);
    }
  };

  const handleAuthSuccess = () => {
    console.log('✅ [APP] Autenticación exitosa');
    setShowAuthModal(false);
    setShowThankYou(true);
  };

  const handleThankYouContinue = () => {
    setShowThankYou(false);
    setShowLanding(false);
  };

  // Pantalla de error
  if (error) {
    return (
      <ErrorBoundary>
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">Error de Conexión</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                Reintentar
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Pantalla de carga mejorada
  if (loading) {
    return (
      <ErrorBoundary>
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
          <div className="flex-1">
            <LoadingScreen 
              message={loadingMessage} 
              progress={loadingProgress} 
            />
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Mostrar pantalla de agradecimiento
  if (showThankYou && user) {
    return (
      <ErrorBoundary>
        <ThankYouScreen 
          userEmail={user.email || 'Usuario'} 
          onContinue={handleThankYouContinue}
        />
      </ErrorBoundary>
    );
  }

  // Mostrar landing page si no hay usuario
  if (showLanding && !user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
          <div className="flex-1">
            <LandingPage onGetStarted={handleGetStarted} />
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Aplicación principal
  return (
    <ErrorBoundary>
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Header 
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />
        
        <div className="flex-1 overflow-hidden">
          <Chat user={user} />
        </div>

        <Footer />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;