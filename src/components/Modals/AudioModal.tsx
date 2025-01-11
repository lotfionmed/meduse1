import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import AudioPlayer from '../AudioPlayer';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  audioUrl: string;
  audioTitle: string;
}

const AudioModal: React.FC<AudioModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  audioUrl,
  audioTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-2xl rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Podcast</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <AudioPlayer
            audioUrl={audioUrl}
            title={audioTitle}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AudioModal;