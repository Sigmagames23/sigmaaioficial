import { supabase } from './supabase';

const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co';

export const generateImage = async (prompt: string, options: {
  style?: string;
  size?: string;
} = {}) => {
  if (isDemo) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a high-quality stock image
    const imageUrl = `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024&fit=crop&random=${Date.now()}`;
    
    return {
      success: true,
      image_url: imageUrl,
      generation_params: {
        prompt,
        style: options.style || 'realistic',
        size: options.size || '1024x1024'
      },
      processing_time: '2.1s',
      model_used: 'sigma-ai-v1'
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt,
        style: options.style || 'realistic',
        size: options.size || '1024x1024'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const generateVideo = async (prompt: string, options: {
  duration?: number;
  fps?: number;
  resolution?: string;
} = {}) => {
  if (isDemo) {
    // Simulate longer processing time for video
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Return a sample video URL
    const videoUrl = `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4?random=${Date.now()}`;
    
    return {
      success: true,
      video_url: videoUrl,
      generation_params: {
        prompt,
        duration: options.duration || 5,
        fps: options.fps || 24,
        resolution: options.resolution || '1280x720'
      },
      processing_time: '5.2s',
      model_used: 'sigma-video-v1',
      duration: options.duration || 5,
      file_size: '1.2MB'
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-video', {
      body: {
        prompt,
        duration: options.duration || 5,
        fps: options.fps || 24,
        resolution: options.resolution || '1280x720'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

export const analyzeFile = async (filePath: string, fileType: string, fileName: string) => {
  if (isDemo) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let analysisResult = {};

    if (fileType.startsWith('image/')) {
      analysisResult = {
        type: 'image_analysis',
        objects_detected: ['person', 'building', 'sky', 'tree'],
        colors: ['blue', 'green', 'brown', 'white'],
        resolution: '1920x1080',
        quality_score: 8.5,
        description: 'Una imagen de alta calidad que muestra una escena urbana con elementos naturales.',
        text_detected: [],
        faces_count: 1,
        sentiment: 'positive'
      };
    } else if (fileType.startsWith('video/')) {
      analysisResult = {
        type: 'video_analysis',
        duration: '00:02:30',
        fps: 30,
        resolution: '1920x1080',
        scenes_detected: 3,
        objects_timeline: ['person', 'car', 'building'],
        audio_detected: true,
        quality_score: 9.0,
        description: 'Video de alta definición con múltiples escenas y audio claro.',
        thumbnail_timestamps: ['00:00:10', '00:01:15', '00:02:00']
      };
    } else if (fileType.includes('pdf')) {
      analysisResult = {
        type: 'document_analysis',
        pages: 5,
        word_count: 1250,
        language: 'spanish',
        topics: ['tecnología', 'inteligencia artificial', 'innovación'],
        summary: 'Documento técnico sobre avances en inteligencia artificial y sus aplicaciones.',
        key_phrases: ['machine learning', 'neural networks', 'deep learning'],
        readability_score: 7.2,
        text_extracted: true
      };
    } else {
      analysisResult = {
        type: 'general_analysis',
        file_structure: 'valid',
        encoding: 'UTF-8',
        size_analysis: 'optimal',
        security_scan: 'clean',
        metadata_extracted: true,
        description: `Archivo ${fileType} analizado correctamente.`
      };
    }

    return {
      success: true,
      file_name: fileName,
      file_type: fileType,
      analysis: analysisResult,
      processing_time: '1.5s',
      confidence_score: 0.95,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('analyze-file', {
      body: {
        file_path: filePath,
        file_type: fileType,
        file_name: fileName
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw error;
  }
};