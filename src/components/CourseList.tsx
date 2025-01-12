import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Module, Chapter } from '../types';
import { ArrowLeft, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react';

interface CourseListProps {
  module: Module;
  chapter: Chapter;
  isDarkMode: boolean;
  onCourseSelect: (courseId: string) => void;
  onBack: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ module, chapter, isDarkMode, onCourseSelect, onBack }) => {
  const [moduleError, setModuleError] = useState(false);

  const handleModuleError = () => {
    console.error(`Error loading module: ${module.title}`);
    setModuleError(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className={`mb-10 flex items-center space-x-2 text-lg font-medium ${
          isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-6 w-6" />
        <span>Retour aux chapitres</span>
      </motion.button>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          {moduleError ? (
            <AlertTriangle 
              className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} 
            />
          ) : (
            <img 
              src={module.icon} 
              alt={`${module.title} icon`}
              onError={handleModuleError}
              className="h-6 w-6 object-contain" 
            />
          )}
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {module.title}
          </div>
        </div>
        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {chapter.title}
        </h1>
      </div>

      {chapter.courses.length === 0 ? (
        <div className={`text-center p-8 rounded-xl ${
          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'
        }`}>
          Aucun cours disponible dans ce chapitre.
        </div>
      ) : (
        <div className="space-y-3">
          {chapter.courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onCourseSelect(course.id)}
              className={`group flex items-center justify-between p-5 rounded-xl transition-all duration-300 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-700/80' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-primary-900/30 text-primary-400 group-hover:bg-primary-900/40' 
                    : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                }`}>
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className={`text-lg font-medium truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {course.title}
                </h2>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;