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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className={`mb-8 flex items-center space-x-2 ${
          isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Retour aux modules</span>
      </motion.button>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          {iconError ? (
            <AlertTriangle 
              className={`h-12 w-12 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} 
            />
          ) : (
            <img 
              src={module.icon} 
              alt={`${module.title} icon`}
              onError={handleIconError}
              className="h-12 w-12 object-cover rounded-lg shadow-lg" 
            />
          )}
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {module.title}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {module.chapters.length} chapitres · {module.chapters.reduce((acc, chapter) => acc + chapter.courses.length, 0)} cours
            </p>
          </div>
        </div>

        {!isClinicalMode && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowKeywords(true)}
            className={`p-3 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-primary-600/20 hover:bg-primary-600/30 text-primary-300' 
                : 'bg-primary-100 hover:bg-primary-200 text-primary-600'
            }`}
          >
            <Key className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {module.chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChapterSelect(chapter.id)}
            className={`group p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-102 cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 hover:shadow-xl hover:shadow-primary-500/10' 
                : 'bg-white hover:bg-gray-50 hover:shadow-xl hover:shadow-primary-500/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl transform transition-all duration-300 group-hover:scale-110 ${
                isDarkMode ? 'bg-primary-500/20' : 'bg-primary-100'
              }`}>
                <Book className={`h-6 w-6 ${
                  isDarkMode ? 'text-primary-400' : 'text-primary-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h2 className={`text-xl font-semibold truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } group-hover:text-primary-500 transition-colors duration-300`}>
                    {chapter.title}
                  </h2>
                  <div className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    {chapter.courses.length} cours
                  </div>
                </div>
                {chapter.description && (
                  <p className={`mt-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  } line-clamp-2`}>
                    {chapter.description}
                  </p>
                )}
                {chapter.tags && chapter.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {chapter.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode
                            ? 'bg-gray-700/80 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ModuleKeywordsModal
        isOpen={showKeywords}
        onClose={() => setShowKeywords(false)}
        isDarkMode={isDarkMode}
        module={module}
      />
    </div>
  );
};

export default ChapterList;