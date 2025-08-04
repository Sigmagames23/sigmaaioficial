import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones para producción
  build: {
    // Optimizaciones de bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors principales
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'icons-vendor': ['lucide-react'],
          'utils-vendor': ['uuid']
        },
        // Nombres de archivos optimizados
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Compresión y minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    
    // Optimizaciones de tamaño
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets menores a 4KB
    
    // Source maps para debugging en producción
    sourcemap: false, // Cambiar a true si necesitas debugging
    
    // Optimizaciones de CSS
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Optimizaciones de desarrollo
  server: {
    hmr: {
      overlay: false // Reducir overlays para velocidad
    },
    // Preload de módulos críticos
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/components/Chat.tsx',
        './src/components/Header.tsx'
      ]
    }
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'uuid'
    ],
    exclude: []
  },
  
  // Variables de entorno
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0')
  },
  
  // Configuración de preview
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  },
  
  // Configuración de base para deployment
  base: './',
  
  // Configuración de assets
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp']
});