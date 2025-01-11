import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Module, Chapter } from '../types';
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

interface CourseListProps {
  module: Module;
  chapter: Chapter;
  isDarkMode: boolean;
  onCourseSelect: (courseId: string) => void;
  onBack: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ module, chapter, isDarkMode, onCourseSelect, onBack }) => {
  const [moduleError, setModuleError] = useState(false);

  useEffect(() => {
    console.log('Module in CourseList:', module);
    console.log('Chapter in CourseList:', chapter);
  }, [module, chapter]);

  const handleModuleError = () => {
    console.error(`Error loading module: ${module.title}`);
    setModuleError(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className={`mb-8 flex items-center space-x-2 ${
          isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Retour aux chapitres</span>
      </motion.button>

      <div className="mb-8 flex items-center">
        {moduleError ? (
          <AlertTriangle 
            className={`h-8 w-8 mr-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} 
          />
        ) : (
          <img 
            src={module.icon} 
            alt={`${module.title} icon`}
            onError={handleModuleError}
            className={`h-8 w-8 mr-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} 
          />
        )}
        <div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {module.title}
          </div>
          <h1 className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {chapter.title}
          </h1>
        </div>
      </div>

      {chapter.courses.length === 0 ? (
        <div className={`text-center p-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Aucun cours disponible dans ce chapitre.
        </div>
      ) : (
        <div className="space-y-4">
          {chapter.courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onCourseSelect(course.id)}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-102 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-blue-500/20' 
                  : 'bg-white hover:bg-gray-50 hover:shadow-blue-500/30'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <BookOpen className={`h-6 w-6 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <h2 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {course.title}
                  </h2>
                  {course.content?.definition && (
                    <p className={`mt-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {course.content.definition}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;