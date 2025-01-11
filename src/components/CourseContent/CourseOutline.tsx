import React from 'react';
import { Key, Layers, Youtube, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseOutlineProps {
  course: any;
  isDarkMode: boolean;
  onKeywordsClick: () => void;
  onSimilarCoursesClick: () => void;
  isClinicalMode: boolean;
  showVideos: boolean;
  setShowVideos: (show: boolean) => void;
  showReferences: boolean;
  setShowReferences: (show: boolean) => void;
}

const CourseOutline: React.FC<CourseOutlineProps> = ({
  course,
  isDarkMode,
  onKeywordsClick,
  onSimilarCoursesClick,
  isClinicalMode,
  showVideos,
  setShowVideos,
  showReferences,
  setShowReferences
}) => {
  const openYoutubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className={`fixed top-20 left-4 z-40 flex flex-col gap-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {!isClinicalMode && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onKeywordsClick}
              className={`p-3 rounded-lg shadow-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-primary-300'
                  : 'bg-white hover:bg-gray-50 text-primary-700'
              }`}
              title="Mots-clés"
            >
              <Key className="h-5 w-5" />
            </motion.button>

            {course.content?.normalMode?.similarCourses?.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSimilarCoursesClick}
                className={`p-3 rounded-lg shadow-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-primary-300'
                    : 'bg-white hover:bg-gray-50 text-primary-700'
                }`}
                title="Cours similaires"
              >
                <Layers className="h-5 w-5" />
              </motion.button>
            )}

            {course.content?.normalMode?.videos && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowVideos(true)}
                className={`p-3 rounded-lg shadow-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-red-400'
                    : 'bg-white hover:bg-gray-50 text-red-500'
                }`}
                title="Vidéos YouTube"
              >
                <Youtube className="h-5 w-5" />
              </motion.button>
            )}

            {course.content?.normalMode?.references && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReferences(true)}
                className={`p-3 rounded-lg shadow-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-amber-400'
                    : 'bg-white hover:bg-gray-50 text-amber-500'
                }`}
                title="Références"
              >
                <BookOpen className="h-5 w-5" />
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* References Modal */}
      <AnimatePresence>
        {showReferences && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowReferences(false)} />
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
                  <h2 className="text-2xl font-bold">Références</h2>
                  <button
                    onClick={() => setShowReferences(false)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ul className="space-y-4">
                  {course.content?.normalMode?.references.map((ref: any, index: number) => (
                    <li key={index} className="flex flex-col">
                      <span className="font-semibold">{ref.title}</span>
                      <span className="text-sm text-gray-500">{ref.edition}</span>
                      <span className="text-sm">{ref.pages}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Videos Modal */}
      <AnimatePresence>
        {showVideos && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowVideos(false)} />
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
                  <h2 className="text-2xl font-bold">Vidéos</h2>
                  <button
                    onClick={() => setShowVideos(false)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {course.content?.normalMode?.videos.map((video: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => openYoutubeVideo(video.url)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
                        isDarkMode
                          ? 'hover:bg-gray-700 bg-gray-750'
                          : 'hover:bg-gray-100 bg-gray-50'
                      }`}
                    >
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{video.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseOutline;