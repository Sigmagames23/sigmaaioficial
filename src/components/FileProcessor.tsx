import React, { useState, useEffect } from 'react';
import { Upload, FileText, Image, Video, Music, Archive, Eye, Download, Trash2, CheckCircle, Clock } from 'lucide-react';
import { uploadFile, getFiles } from '../lib/database';
import { SigmaAIEngine } from '../lib/aiEngine';
import { User } from 'firebase/auth';
import type { FileRecord } from '../lib/database';

interface FileProcessorProps {
  user: User | null;
}

export const FileProcessor: React.FC<FileProcessorProps> = ({ user }) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;
    
    try {
      const userFiles = await getFiles(user.uid);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return FileText;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = async (fileList: File[]) => {
    if (!user) return;

    for (const file of fileList) {
      try {
        // Subir archivo a Firebase
        const fileRecord = await uploadFile(file, user.uid);
        setFiles(prev => [fileRecord, ...prev]);

        // Analizar archivo con Sigma AI
        setTimeout(async () => {
          try {
            const analysis = await SigmaAIEngine.analyzeFile(file);
            
            // Actualizar el archivo con el análisis
            setFiles(prev => prev.map(f => 
              f.id === fileRecord.id 
                ? { ...f, analysisResult: analysis, status: 'completed' }
                : f
            ));
          } catch (error) {
            console.error('Error analyzing file:', error);
            setFiles(prev => prev.map(f => 
              f.id === fileRecord.id 
                ? { ...f, status: 'error' }
                : f
            ));
          }
        }, 2000);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Inicia sesión para procesar archivos</h2>
          <p className="text-gray-300">Necesitas una cuenta para usar el procesador de archivos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Procesador de Archivos</h2>
          <p className="text-gray-300">Analiza archivos con la IA Sigma</p>
        </div>

        {/* Upload Area */}
        <div
          className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-white/30 hover:border-purple-400 hover:bg-purple-500/5'
          }`}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Arrastra archivos aquí o haz clic para seleccionar
          </h3>
          <p className="text-gray-300 mb-4">
            Soporta imágenes, videos, documentos, audio y más
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            Seleccionar Archivos
          </label>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Archivos Procesados</h3>
            {files.map(file => {
              const IconComponent = getFileIcon(file.fileType);
              return (
                <div key={file.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{file.filename}</h4>
                        <p className="text-sm text-gray-300">
                          {formatFileSize(file.fileSize)} • {file.createdAt.toLocaleString()}
                        </p>
                        {file.status === 'processing' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className="text-sm text-purple-400">Analizando con Sigma AI...</span>
                          </div>
                        )}
                        {file.status === 'completed' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Análisis completado</span>
                          </div>
                        )}
                        {file.status === 'completed' && file.analysisResult && (
                          <div className="mt-2 p-2 bg-black/20 rounded-lg">
                            <p className="text-xs text-gray-300">
                              <strong>Análisis:</strong> {file.analysisResult.type} - {file.analysisResult.description || 'Procesado correctamente'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Eye className="w-4 h-4 text-gray-300" />
                      </button>
                      <a
                        href={file.downloadUrl}
                        download={file.filename}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-300" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};