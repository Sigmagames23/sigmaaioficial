import React from 'react';
import { 
  MessageSquare, 
  Plus,
  X,
  Trash2,
  Clock
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

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
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-black/20 backdrop-blur-md border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Conversaciones</h2>
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
            <button 
              onClick={onNewConversation}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl py-3 px-4 hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Nueva Conversación</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No hay conversaciones aún</p>
                <p className="text-gray-500 text-xs">Inicia una nueva conversación</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`
                    group relative p-3 rounded-xl cursor-pointer transition-all duration-200
                    ${activeConversationId === conversation.id 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30' 
                      : 'hover:bg-white/10 border border-transparent'
                    }
                  `}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {conversation.title}
                      </h4>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatDate(conversation.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-500 text-center">
              © 2025 Sigma AI
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
