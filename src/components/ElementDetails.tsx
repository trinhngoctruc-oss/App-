import React, { useState } from 'react';
import { Element } from '../types';
import { X, Volume2, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface ElementDetailsProps {
  element: Element | null;
  onClose: () => void;
}

export const ElementDetails: React.FC<ElementDetailsProps> = ({ element, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  if (!element) return null;

  const handleReadAloud = async () => {
    if (isPlaying) return;
    
    setLoadingAudio(true);
    const textToRead = `Nguyên tố ${element.name}, ký hiệu là ${element.symbol}, số hiệu nguyên tử là ${element.number}. Khối lượng nguyên tử: ${element.atomic_mass}. Phân loại: ${element.category}. Trạng thái: ${element.phase}. ${element.summary}`;
    
    const audioData = await generateSpeech(textToRead);
    setLoadingAudio(false);

    if (audioData) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(audioData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // The TTS model returns raw 16-bit PCM at 24kHz
        const pcmData = new Int16Array(bytes.buffer);
        const audioBuffer = audioCtx.createBuffer(1, pcmData.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < pcmData.length; i++) {
          channelData[i] = pcmData[i] / 32768.0; // Convert to float [-1.0, 1.0]
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          audioCtx.close();
        };
        
        setIsPlaying(true);
        source.start();
      } catch (err) {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-blue-500 rounded-2xl flex flex-col items-center justify-center bg-blue-50">
                <span className="text-sm font-bold text-blue-600">{element.number}</span>
                <span className="text-4xl sm:text-5xl font-black text-blue-900">{element.symbol}</span>
                <span className="text-xs font-medium text-blue-600">{element.atomic_mass}</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{element.name}</h2>
                <p className="text-lg font-medium text-blue-600 capitalize mb-4">{element.category}</p>
                
                <button
                  onClick={handleReadAloud}
                  disabled={loadingAudio || isPlaying}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
                >
                  {loadingAudio ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                  {isPlaying ? "Đang đọc..." : "Đọc thông tin"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Trạng thái</p>
                <p className="font-semibold text-gray-900">{element.phase}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Điểm nóng chảy</p>
                <p className="font-semibold text-gray-900">{element.melt ? `${element.melt} K` : 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Điểm sôi</p>
                <p className="font-semibold text-gray-900">{element.boil ? `${element.boil} K` : 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Khối lượng riêng</p>
                <p className="font-semibold text-gray-900">{element.density ? `${element.density} g/cm³` : 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Người tìm thấy</p>
                <p className="font-semibold text-gray-900 truncate" title={element.discovered_by || 'N/A'}>
                  {element.discovered_by || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Nhóm / Chu kỳ</p>
                <p className="font-semibold text-gray-900">{element.group} / {element.period}</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tóm tắt</h3>
              <p className="text-gray-600 leading-relaxed">
                {element.summary}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
