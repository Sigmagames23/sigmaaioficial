import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Loader2, Brain, Menu, X, Eye } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { puterAI } from '../lib/puterAI';
import { createConversation, createMessage, getConversations, getMessages, deleteConversation } from '../lib/database';
import type { User } from '@supabase/supabase-js';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    url?: string;
    analysis?: any;
  };
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatProps {
  user: User | null;
}

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy Sigma AI, tu asistente inteligente. Puedo ayudarte con:\n\n🤖 **Chat inteligente** - Conversaciones naturales sin límites\n🎨 **Generar imágenes** - Solo describe lo que quieres\n📄 **Analizar archivos** - Sube cualquier archivo (PDF, texto, imágenes, JSON)\n📱 **Optimizado para móviles** - Funciona perfecto en tu teléfono\n\n¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<{file: File, preview: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  // Cargar conversaciones
  useEffect(() => {
    if (user) {
      loadConversations();
      createInitialConversation();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const userConversations = await getConversations(user.id);
      setConversations(userConversations);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    }
  };

  const createInitialConversation = async () => {
    if (!user) return;
    
    try {
      const conversation = await createConversation(user.id, 'Nueva conversación con Sigma AI');
      setCurrentConversationId(conversation.id);
      loadConversations();
    } catch (error) {
      console.error('Error creando conversación:', error);
    }
  };

  const handleNewConversation = async () => {
    if (!user) return;
    
    try {
      const conversation = await createConversation(user.id, 'Nueva conversación');
      setCurrentConversationId(conversation.id);
      setMessages([{
        id: '1',
        content: '¡Hola! Soy Sigma AI, tu asistente inteligente. ¿En qué puedo ayudarte hoy?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }]);
      loadConversations();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error creando nueva conversación:', error);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      setCurrentConversationId(conversationId);
      const conversationMessages = await getMessages(conversationId);
      
      const formattedMessages: Message[] = conversationMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.created_at),
        type: msg.message_type as 'text' | 'image' | 'file',
        fileInfo: msg.metadata?.imageUrl ? {
          name: 'imagen-generada.jpg',
          size: 0,
          type: 'image/jpeg',
          url: msg.metadata.imageUrl
        } : undefined
      }));
      
      setMessages(formattedMessages);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      await deleteConversation(conversationId);
      loadConversations();
      
      if (currentConversationId === conversationId) {
        handleNewConversation();
      }
    } catch (error) {
      console.error('Error eliminando conversación:', error);
    }
  };

  // Ajustar altura del textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  // Efecto de escritura optimizado para móviles
  const typeMessage = async (message: string, sender: 'ai' = 'ai') => {
    setShowTyping(true);
    setTypingMessage('');
    
    const messageId = Date.now().toString();
    const speed = 15; // Velocidad optimizada
    
    for (let i = 0; i <= message.length; i++) {
      setTypingMessage(message.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setShowTyping(false);
    const newMessage: Message = {
      id: messageId,
      content: message,
      sender,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setTypingMessage('');

    // Guardar en Supabase
    if (user && currentConversationId) {
      try {
        await createMessage(currentConversationId, message, sender);
      } catch (error) {
        console.error('Error guardando mensaje:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Agregar mensaje del usuario
    const userMessageObj: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessageObj]);

    // Guardar mensaje del usuario
    if (user && currentConversationId) {
      try {
        await createMessage(currentConversationId, userMessage, 'user');
      } catch (error) {
        console.error('Error guardando mensaje del usuario:', error);
      }
    }

    // Detectar si es solicitud de imagen
    const isImageRequest = /^(genera|crea|haz|dibuja|imagen|picture|draw|create|generate).*(imagen|image|foto|photo|picture|dibujo|drawing)/i.test(userMessage) ||
                          /^(imagen|image|foto|photo|picture|dibujo|drawing).*(de|of|con|with)/i.test(userMessage);

    setIsLoading(true);
    
    try {
      if (isImageRequest) {
        setLoadingMessage('🎨 Generando imagen...');
        
        const imageUrl = await puterAI.generateImage(userMessage);
        
        setIsLoading(false);
        setLoadingMessage('');
        
        // Agregar imagen generada
        const imageMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `He generado una imagen basada en tu descripción: "${userMessage}"`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'image',
          fileInfo: {
            name: 'imagen-generada.jpg',
            size: 0,
            type: 'image/jpeg',
            url: imageUrl
          }
        };
        
        setMessages(prev => [...prev, imageMessage]);

        // Guardar en Supabase
        if (user && currentConversationId) {
          try {
            await createMessage(currentConversationId, imageMessage.content, 'ai', 'image', {
              imageUrl: imageUrl,
              prompt: userMessage
            });
          } catch (error) {
            console.error('Error guardando imagen:', error);
          }
        }
      } else {
        setLoadingMessage('🤖 Procesando...');
        
        const response = await puterAI.generateResponse(userMessage, user?.id);
        
        setIsLoading(false);
        setLoadingMessage('');
        
        // Mostrar respuesta con efecto de escritura
        await typeMessage(response);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setLoadingMessage('');
      
      await typeMessage('Lo siento, hubo un error procesando tu solicitud. ¿Podrías intentar de nuevo?');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Crear vista previa
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview({
          file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview({
        file,
        preview: ''
      });
    }
  };

  const handleFileUpload = async () => {
    if (!filePreview) return;

    const file = filePreview.file;
    setFilePreview(null);

    // Agregar mensaje de archivo
    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `He subido el archivo: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    };
    setMessages(prev => [...prev, fileMessage]);

    // Guardar mensaje de archivo
    if (user && currentConversationId) {
      try {
        await createMessage(currentConversationId, fileMessage.content, 'user', 'file', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
      } catch (error) {
        console.error('Error guardando archivo:', error);
      }
    }

    setIsLoading(true);
    setLoadingMessage('📄 Analizando archivo...');

    try {
      const analysis = await puterAI.analyzeFile(file);
      
      setIsLoading(false);
      setLoadingMessage('');
      
      let analysisText = `📄 **Análisis del archivo "${file.name}":**\n\n`;
      
      // Información básica
      analysisText += `**Información básica:**\n`;
      analysisText += `• Tamaño: ${(file.size / 1024).toFixed(1)} KB\n`;
      analysisText += `• Tipo: ${file.type || 'Desconocido'}\n\n`;
      
      // Análisis con IA si está disponible
      if (analysis.aiAnalysis) {
        analysisText += `**Análisis con IA:**\n${analysis.aiAnalysis}\n\n`;
      } else if (analysis.basicAnalysis) {
        analysisText += `**Análisis básico:**\n${analysis.basicAnalysis}\n\n`;
      }
      
      // Contenido si es texto
      if (analysis.content && analysis.content.length > 0) {
        analysisText += `**Vista previa del contenido:**\n${analysis.content}\n\n`;
      }
      
      await typeMessage(analysisText);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setIsLoading(false);
      setLoadingMessage('');
      
      await typeMessage('Hubo un error analizando el archivo. ¿Podrías intentar con otro archivo?');
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Detectar títulos con **
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part
            )}
          </p>
        );
      }
      // Detectar listas con •
      if (line.trim().startsWith('•')) {
        return <p key={index} className="ml-4 mb-1">{line}</p>;
      }
      // Líneas normales
      return line.trim() ? <p key={index} className="mb-2">{line}</p> : <br key={index} />;
    });
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Inicia sesión para chatear</h2>
          <p className="text-gray-300 mb-4">Necesitas una cuenta para usar Sigma AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-lg font-semibold text-white">Sigma AI</h3>
          <div className="w-9 lg:hidden"></div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-100'
                }`}
              >
                {message.type === 'image' && message.fileInfo?.url ? (
                  <div className="space-y-2">
                    <img
                      src={message.fileInfo.url}
                      alt="Imagen generada"
                      className="w-full rounded-lg shadow-lg"
                      loading="lazy"
                    />
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : message.type === 'file' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-2">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm font-medium">{message.fileInfo?.name}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed">
                    {formatMessage(message.content)}
                  </div>
                )}
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de escritura */}
          {showTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[70%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-sm">Sigma AI escribiendo...</span>
                </div>
                <div className="text-sm leading-relaxed text-gray-100 mt-2">
                  {formatMessage(typingMessage)}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm">{loadingMessage}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Vista previa del archivo</h4>
                <button
                  onClick={() => setFilePreview(null)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                {filePreview.preview && filePreview.file.type.startsWith('image/') ? (
                  <img
                    src={filePreview.preview}
                    alt="Vista previa"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Paperclip className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="text-white font-medium">{filePreview.file.name}</p>
                  <p className="text-gray-300 text-sm">
                    {(filePreview.file.size / 1024).toFixed(1)} KB • {filePreview.file.type}
                  </p>
                </div>
                
                <button
                  onClick={handleFileUpload}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  Subir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-end space-x-2">
            {/* Botón de archivo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/20"
              title="Subir archivo (PDF, texto, imágenes, JSON)"
            >
              <Paperclip className="w-5 h-5 text-gray-300" />
            </button>

            {/* Input de texto */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none text-white placeholder-gray-400 disabled:opacity-50"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Botón de enviar */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />

          {/* Información adicional */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            IA sin límites • Análisis de archivos • Generación de imágenes • Optimizado para móviles
          </div>
        </div>
      </div>
    </div>
  );
};
