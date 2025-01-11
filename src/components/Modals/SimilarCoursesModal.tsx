import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimilarCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  similarCourses: Array<{
    id: string;
    title: string;
    description: string;
    reason: string;
  }>;
  onCourseSelect: (courseId: string) => void;
}

const SimilarCoursesModal: React.FC<SimilarCoursesModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  similarCourses,
  onCourseSelect
}) => {
  const handleCourseClick = (courseId: string) => {
    onCourseSelect(courseId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                <h2 className="text-2xl font-bold">Cours similaires</h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {similarCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg cursor-pointer ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className={`text-sm mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {course.description}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <strong>Relation :</strong> {course.reason}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SimilarCoursesModal;
