import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface KeywordDefinitionModalProps {
  term: string;
  definition: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const KeywordDefinitionModal: React.FC<KeywordDefinitionModalProps> = ({
  term,
  definition,
  onClose,
  isDarkMode
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`relative w-full max-w-md rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-primary-600/20' : 'bg-primary-100'
              }`}>
                <BookOpen className={`h-5 w-5 ${
                  isDarkMode ? 'text-primary-400' : 'text-primary-600'
                }`} />
              </div>
              <h3 className="text-lg font-semibold flex-1 break-words pr-8">
                {term}
              </h3>
              <button
                onClick={onClose}
                className={`absolute right-4 top-4 p-1 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`p-4 sm:p-6 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="prose prose-sm sm:prose max-w-none">
              {definition}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KeywordDefinitionModal;