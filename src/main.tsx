import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import CopyrightProtection from './lib/copyright';

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ [MAIN] Elemento root no encontrado');
  document.body.innerHTML = `
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      background: linear-gradient(135deg, #1e293b, #7c3aed, #1e293b);
      color: white;
      font-family: system-ui;
      text-align: center;
    ">
      <div>
        <h1>Error de Inicialización</h1>
        <p>No se pudo cargar la aplicación correctamente.</p>
        <button onclick="window.location.reload()" style="
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 16px;
        ">
          Reintentar
        </button>
        <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
          © 2025 Sigma AI. Todos los derechos reservados.
        </div>
      </div>
    </div>
  `;
} else {
  console.log('✅ [MAIN] Inicializando aplicación React...');
  console.log('🔒 [COPYRIGHT] Activando protección de derechos de autor...');
  
  try {
    // Inicializar protección de copyright
    CopyrightProtection.injectWatermarks();
    
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ [MAIN] Aplicación React inicializada correctamente');
    console.log('🛡️ [COPYRIGHT] Protección activada:', CopyrightProtection.getCopyrightInfo());
  } catch (error) {
    console.error('❌ [MAIN] Error inicializando React:', error);
    rootElement.innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        background: linear-gradient(135deg, #1e293b, #7c3aed, #1e293b);
        color: white;
        font-family: system-ui;
        text-align: center;
      ">
        <div>
          <h1>Error de React</h1>
          <p>Hubo un problema inicializando la aplicación.</p>
          <button onclick="window.location.reload()" style="
            background: linear-gradient(135deg, #7c3aed, #ec4899);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 16px;
          ">
            Reintentar
          </button>
          <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
            © 2025 Sigma AI. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `;
  }
}