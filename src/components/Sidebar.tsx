import React from 'react';
import { 
  MessageSquare, 
  FileText, 
  Image, 
  Video, 
  Code, 
  Zap,
  History,
  Plus,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'history', label: 'History', icon: History },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-md border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Workspace</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl py-3 px-4 hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-300 border border-purple-400/30' 
                      : 'text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Zap className="w-4 h-4" />
              <span>Powered by Sigma AI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};