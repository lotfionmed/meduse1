import React, { useState } from 'react';
import { Play, Map, Image, Star, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import NoteModal from '../Modals/NoteModal';

interface CourseHeaderProps {
  course: any;
  isDarkMode: boolean;
  showAudio: boolean;
  setShowAudio: (show: boolean) => void;
  setShowMindMap: (show: boolean) => void;
  setShowImage: (show: boolean) => void;
  setShowChronology: (show: boolean) => void;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  isDarkMode,
  showAudio,
  setShowAudio,
  setShowMindMap,
  setShowImage,
  setShowChronology
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const courseNotes = course.content?.normalMode?.notes || [];

  return (
    <>
      <div className={`relative overflow-hidden p-8 rounded-2xl ${
        isDarkMode ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
      } shadow-xl border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-white to-gray-300' 
                  : 'from-gray-900 to-gray-600'
              }`}>
                {course.title}
              </h1>
              {course.duration && (
                <div className={`flex items-center mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{course.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Definition Section */}
          {course.content?.definition && (
            <div className={`relative p-4 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-base sm:text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}> 
                {course.content.definition.split(/\*\*(.*?)\*\*/g).map((part, index) => (
                  <span key={index} className={index % 2 === 1 ? 'font-bold text-primary-500' : ''}>
                    {part}
                  </span>
                ))} 
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-start">
            {courseNotes.length > 0 && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowNotes(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}
            
            {course.content?.audio && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowAudio(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                    : 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/20'
                }`}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}

            {course.content?.mindMap && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowMindMap(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20'
                }`}
              >
                <Map className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}

            {course.content?.normalMode?.chronology && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowChronology(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' 
                    : 'bg-yellow-500 hover:bg-yellow-400 text-white shadow-lg shadow-yellow-500/20'
                }`}
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}

            {course.content?.images && course.content.images.length > 0 && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowImage(true)}
                className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                <Image className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <NoteModal
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          notes={courseNotes}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default CourseHeader;