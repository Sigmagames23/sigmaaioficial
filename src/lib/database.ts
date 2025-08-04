import { supabase } from './supabase';
import type { Conversation, Message, FileRecord, GeneratedMedia } from './supabase';

// Conversations
export const createConversation = async (userId: string, title: string = 'Nueva Conversación') => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const getConversations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data as Conversation[];
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

export const updateConversation = async (id: string, title: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Conversation;
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
};

export const deleteConversation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

// Messages
export const createMessage = async (
  conversationId: string,
  content: string,
  sender: 'user' | 'ai',
  messageType: 'text' | 'file' | 'image' | 'video' = 'text',
  metadata: Record<string, any> = {}
) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender,
        message_type: messageType,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Generated Media
export const createGeneratedMedia = async (
  userId: string,
  mediaType: 'image' | 'video',
  prompt: string,
  generationParams: Record<string, any> = {}
) => {
  try {
    const { data, error } = await supabase
      .from('generated_media')
      .insert({
        user_id: userId,
        media_type: mediaType,
        prompt,
        storage_path: null,
        generation_params: generationParams,
        status: 'generating',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as GeneratedMedia;
  } catch (error) {
    console.error('Error creating generated media:', error);
    throw error;
  }
};

export const updateGeneratedMedia = async (id: string, storagePath: string) => {
  try {
    const { data, error } = await supabase
      .from('generated_media')
      .update({
        storage_path: storagePath,
        status: 'completed'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as GeneratedMedia;
  } catch (error) {
    console.error('Error updating generated media:', error);
    throw error;
  }
};

export const getGeneratedMedia = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('generated_media')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as GeneratedMedia[];
  } catch (error) {
    console.error('Error getting generated media:', error);
    return [];
  }
};

// Files
export const uploadFile = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(fileName);
    
    const { data, error } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: fileName,
        analysis_result: {},
        status: 'processing',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      downloadUrl: urlData.publicUrl
    } as FileRecord & { downloadUrl: string };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFiles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FileRecord[];
  } catch (error) {
    console.error('Error getting files:', error);
    return [];
  }
};