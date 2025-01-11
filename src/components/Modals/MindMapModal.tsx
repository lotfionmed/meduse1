import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import InteractiveMindMap from '../InteractiveMindMap';
import { MindMap } from '../../modules/mindmaps/types';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  mindMap: MindMap;
}

const MindMapModal: React.FC<MindMapModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  mindMap
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className={`fixed inset-0 w-full h-full flex flex-col ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h2 className="text-xl md:text-2xl font-bold">{mindMap.title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-black'
            }`}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <InteractiveMindMap
            isDarkMode={isDarkMode}
            mindMap={mindMap}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MindMapModal;