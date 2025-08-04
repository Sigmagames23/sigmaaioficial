import React from 'react';
import { Brain, Shield, Copyright } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-1 sm:space-y-0">
          {/* Copyright principal más pequeño */}
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Copyright className="w-3 h-3" />
            <span>© {currentYear} Sigma AI</span>
          </div>

          {/* Logo y marca más pequeño */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Brain className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sigma AI
            </span>
          </div>

          {/* Protección legal más pequeña */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            <span>sigmaai.ct.ws</span>
          </div>
        </div>

      </div>
    </footer>
  );
};