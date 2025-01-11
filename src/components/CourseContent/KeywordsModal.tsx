import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key } from 'lucide-react';
import KeywordDefinitionModal from './KeywordDefinitionModal';

interface Keyword {
  term: string;
  definition: string;
}

interface KeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  keywords: Keyword[];
  title: string;
}

const KeywordsModal: React.FC<KeywordsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  keywords,
  title
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-xl sm:max-w-2xl rounded-xl shadow-2xl p-4 sm:p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Key className={`h-5 w-5 ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`} />
              <h2 className="text-xl sm:text-2xl font-bold truncate">Mots-clés : {title}</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 max-h-[60vh] overflow-y-auto">
            {keywords.map((keyword, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedKeyword(keyword)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-primary-600/20 text-primary-300 hover:bg-primary-600/30'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {keyword.term}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedKeyword && (
              <KeywordDefinitionModal
                term={selectedKeyword.term}
                definition={selectedKeyword.definition}
                onClose={() => setSelectedKeyword(null)}
                isDarkMode={isDarkMode}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default KeywordsModal;