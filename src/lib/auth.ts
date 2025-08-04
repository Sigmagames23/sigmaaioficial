import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export const signUp = async (email: string, password: string) => {
  try {
    console.log('📝 [AUTH] Iniciando registro para:', email);
    
    // Intentar registro con auto-confirmación
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          email_confirm: true
        }
      }
    });
    
    if (error) {
      console.error('❌ [AUTH] Error en registro:', error.message);
      
      // Si hay error de confirmación, intentar login directo
      if (error.message.includes('email_not_confirmed') || 
          error.message.includes('Email not confirmed') ||
          error.message.includes('User already registered')) {
        console.log('🔄 [AUTH] Usuario ya existe, intentando login...');
        return await signIn(email, password);
      }
      throw error;
    }
    
    console.log('✅ [AUTH] Registro exitoso:', data.user?.email);
    
    // Si el registro fue exitoso pero el usuario no está confirmado, hacer login
    if (data.user && !data.user.email_confirmed_at) {
      console.log('🔄 [AUTH] Usuario registrado, haciendo login automático...');
      const loginResult = await signIn(email, password);
      if (loginResult.user) {
        return loginResult;
      }
    }
    
    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('❌ [AUTH] Error en registro:', error);
    return { user: null, error: { message: error.message } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 [AUTH] Iniciando login para:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ [AUTH] Error en login:', error.message);
      
      if (error.message.includes('email_not_confirmed') || 
          error.message.includes('Email not confirmed')) {
        throw new Error('Tu cuenta necesita ser activada. Intenta registrarte de nuevo.');
      }
      
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email o contraseña incorrectos.');
      }
      
      throw error;
    }
    
    console.log('✅ [AUTH] Login exitoso:', data.user?.email);
    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('❌ [AUTH] Error en login:', error);
    return { user: null, error: { message: error.message } };
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('🔐 [AUTH] Iniciando login con Google...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) throw error;
    console.log('✅ [AUTH] Google login iniciado');
    return { data, error: null };
  } catch (error: any) {
    console.error('❌ [AUTH] Error con Google:', error);
    return { data: null, error: { message: error.message } };
  }
};

export const signOut = async () => {
  try {
    console.log('🚪 [AUTH] Cerrando sesión...');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ [AUTH] Sesión cerrada exitosamente');
    return { error: null };
  } catch (error: any) {
    console.error('❌ [AUTH] Error cerrando sesión:', error);
    return { error: { message: error.message } };
  }
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: any }> => {
  try {
    console.log('🔍 [AUTH] Verificando usuario actual...');
    
    // Agregar timeout para evitar cuelgues
    const { data: { user }, error } = await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 3000)
      )
    ]) as any;
    
    if (error) throw error;
    
    if (user) {
      console.log('✅ [AUTH] Usuario actual encontrado:', user.email);
    } else {
      console.log('ℹ️ [AUTH] No hay usuario autenticado');
    }
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ [AUTH] Error obteniendo usuario:', error);
    return { user: null, error };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('👂 [AUTH] Configurando listener de cambios de estado...');
  
  try {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 [AUTH] Cambio de estado:', event, session?.user?.email || 'sin usuario');
      callback(session?.user || null);
    }).data.subscription;
  } catch (error) {
    console.error('❌ [AUTH] Error configurando listener:', error);
    // Retornar un objeto mock para evitar errores
    return {
      unsubscribe: () => console.log('Mock unsubscribe')
    };
  }
};