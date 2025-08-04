import { createClient } from '@supabase/supabase-js';

// Verificar que las variables de entorno estén disponibles
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SUPABASE] Variables de entorno faltantes');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Faltante');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Faltante');
}

// Crear cliente con configuración optimizada
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'sigma-ai@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Verificar conexión al inicializar
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ [SUPABASE] Error verificando sesión:', error);
  } else {
    console.log('✅ [SUPABASE] Cliente inicializado correctamente');
    if (data.session) {
      console.log('🔐 [SUPABASE] Sesión activa encontrada:', data.session.user.email);
    }
  }
}).catch(error => {
  console.error('❌ [SUPABASE] Error crítico inicializando:', error);
});

// Database types
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'ai';
  message_type: 'text' | 'file' | 'image' | 'video';
  metadata: Record<string, any>;
  created_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  analysis_result: Record<string, any>;
  status: 'processing' | 'completed' | 'error';
  created_at: string;
}

export interface GeneratedMedia {
  id: string;
  user_id: string;
  media_type: 'image' | 'video';
  prompt: string;
  storage_path: string | null;
  generation_params: Record<string, any>;
  status: 'generating' | 'completed' | 'error';
  created_at: string;
}