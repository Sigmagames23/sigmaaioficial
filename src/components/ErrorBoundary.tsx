import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 [ERROR BOUNDARY] Error capturado:', error);
    console.error('📍 [ERROR BOUNDARY] Info del error:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Reportar error a servicio de monitoreo (opcional)
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Aquí puedes integrar con servicios como Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('📊 [ERROR REPORT]', errorReport);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
            {/* Icono de error */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-white mb-4">
              ¡Oops! Algo salió mal
            </h1>

            {/* Descripción */}
            <p className="text-gray-300 mb-6">
              Sigma AI encontró un error inesperado. No te preocupes, estamos trabajando para solucionarlo.
            </p>

            {/* Detalles del error (solo en desarrollo) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-red-400 font-semibold mb-2">Detalles del error:</h3>
                <p className="text-red-300 text-sm font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="text-red-400 text-xs cursor-pointer">
                      Ver stack trace
                    </summary>
                    <pre className="text-red-300 text-xs mt-2 overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Intentar de nuevo</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full bg-white/10 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar página</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-white/10 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Ir al inicio</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-gray-400 text-sm">
                Si el problema persiste, puedes contactarnos en{' '}
                <a 
                  href="mailto:support@sigma-ai.app" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  support@sigma-ai.app
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}