import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Module } from '../types';
import { ArrowLeft, Book, Key, AlertTriangle } from 'lucide-react';
import ModuleKeywordsModal from '../utils/moduleKeywordsModal';

interface ChapterListProps {
  module: Module;
  isDarkMode: boolean;
  onChapterSelect: (chapterId: string) => void;
  onBack: () => void;
  isClinicalMode?: boolean;
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  module, 
  isDarkMode, 
  onChapterSelect, 
  onBack,
  isClinicalMode = false
}) => {
  const [showKeywords, setShowKeywords] = useState(false);
  const [iconError, setIconError] = useState(false);

  const handleIconError = () => {
    console.warn(`Failed to load icon for module: ${module.title}`);
    setIconError(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header Section - Mobile */}
      <div className={`fixed top-0 left-0 right-0 z-10 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-sm border-b ${
        isDarkMode ? 'border-gray-800' : 'border-gray-200'
      } md:hidden`}>
        <div className="px-4 py-3">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBack}
            className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-6 md:py-12">
        {/* Desktop Header */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className={`mb-10 hidden md:flex items-center space-x-2 text-lg font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="h-6 w-6" />
          <span>Retour aux modules</span>
        </motion.button>

        {/* Module Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-16">
          <div className="flex items-center gap-4 md:gap-8">
            {iconError ? (
              <AlertTriangle 
                className={`h-16 md:h-24 w-16 md:w-24 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} 
              />
            ) : (
              <motion.img 
                src={module.icon} 
                alt={`${module.title} icon`}
                onError={handleIconError}
                className="h-16 md:h-24 w-16 md:w-24 object-contain" 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <div>
              <motion.h1 
                className={`text-3xl md:text-5xl font-bold mb-2 md:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {module.title}
              </motion.h1>
              <motion.p 
                className={`text-base md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {module.chapters.length} chapitres · {module.chapters.reduce((acc, chapter) => acc + chapter.courses.length, 0)} cours
              </motion.p>
            </div>
          </div>

          {!isClinicalMode && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowKeywords(true)}
              className={`mt-4 md:mt-0 w-full md:w-auto p-4 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-primary-600/10 hover:bg-primary-600/20 text-primary-300' 
                  : 'bg-primary-50 hover:bg-primary-100 text-primary-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Key className="h-5 w-5" />
                <span className="md:hidden">Voir les mots-clés</span>
              </div>
            </motion.button>
          )}
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {module.chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onChapterSelect(chapter.id)}
              className={`group p-6 md:p-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800/80 hover:bg-gray-700/90 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-primary-500/20' 
                  : 'bg-white hover:bg-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-primary-500/10'
              }`}
            >
              <div className="flex items-start gap-4 md:gap-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Book className={`h-6 w-6 md:h-8 md:w-8 ${
                    isDarkMode ? 'text-primary-400' : 'text-primary-500'
                  }`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg md:text-xl font-semibold mb-2 truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {chapter.title}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {chapter.courses.length} cours
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ModuleKeywordsModal
        isOpen={showKeywords}
        module={module}
        isDarkMode={isDarkMode}
        onClose={() => setShowKeywords(false)}
      />
    </div>
  );
};

export default ChapterList;