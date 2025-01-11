import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key } from 'lucide-react';
import { Module } from '../types';

interface ModuleKeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  module: Module;
}

const ModuleKeywordsModal: React.FC<ModuleKeywordsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  module
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<{[key: string]: Array<{term: string, definition: string}>}>({});

  useEffect(() => {
    if (!module) return;

    // Récupérer et trier les mots-clés
    const allKeywords = module.chapters
      .flatMap(chapter => chapter.courses.flatMap(course => course.content?.normalMode?.keywords || []))
      .sort((a, b) => a.term.localeCompare(b.term, 'fr-FR'));

    // Grouper par première lettre
    const grouped = allKeywords.reduce((acc, keyword) => {
      const firstLetter = keyword.term.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(keyword);
      return acc;
    }, {} as {[key: string]: Array<{term: string, definition: string}>});

    setKeywords(grouped);
    // Sélectionner la première lettre disponible
    const firstAvailableLetter = Object.keys(grouped).sort()[0];
    setSelectedLetter(firstAvailableLetter);
  }, [module]);

  if (!isOpen) return null;

  const letters = Object.keys(keywords).sort();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Key className={`h-5 w-5 ${
                  isDarkMode ? 'text-primary-400' : 'text-primary-600'
                }`} />
                <h2 className="text-2xl font-bold">Mots-clés : {module.title}</h2>
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

            {/* Navigation alphabétique */}
            <div className="mt-6 flex flex-wrap gap-2">
              {letters.map((letter) => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 rounded-lg font-semibold transition-all duration-300 ${
                    selectedLetter === letter
                      ? isDarkMode
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedLetter && (
                <motion.div
                  key={selectedLetter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-4"
                >
                  {keywords[selectedLetter].map((keyword, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-primary-400' : 'text-primary-600'
                      }`}>
                        {keyword.term}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {keyword.definition}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModuleKeywordsModal;