import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, StickyNote, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  answer: string;
  image?: string;
  imageTitle?: string;
  note?: string;
}

interface CourseQuestionsProps {
  course: any;
  isDarkMode: boolean;
  questionsRef: React.RefObject<(HTMLDivElement | null)[]>;
}

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

const CourseQuestions: React.FC<CourseQuestionsProps> = ({
  course,
  isDarkMode,
  questionsRef
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [imageModal, setImageModal] = useState<{ 
    isOpen: boolean; 
    url: string;
    title?: string;
  }>({ 
    isOpen: false, 
    url: '',
    title: ''
  });
  const [noteModal, setNoteModal] = useState<{ isOpen: boolean; text: string }>({ isOpen: false, text: '' });

  const toggleQuestion = (questionId: number) => {
    if (expandedQuestions.includes(questionId)) {
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
    } else {
      setExpandedQuestions([...expandedQuestions, questionId]);
    }
  };

  const openImageModal = (imageUrl: string, imageTitle?: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageModal({ isOpen: true, url: imageUrl, title: imageTitle });
  };

  const openNoteModal = (noteText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteModal({ isOpen: true, text: noteText });
  };

  return (
    <>
      <div className="space-y-4">
        {course.content?.normalMode?.questions.map((q: Question, index: number) => (
          <motion.div
            key={q.id}
            ref={el => questionsRef.current[index] = el}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'
            } shadow-lg border-l-4 ${
              isDarkMode 
                ? expandedQuestions.includes(q.id) 
                  ? 'border-l-blue-500 border-gray-700' 
                  : 'border-l-gray-600 border-gray-700'
                : expandedQuestions.includes(q.id)
                  ? 'border-l-blue-500 border-gray-200'
                  : 'border-l-gray-300 border-gray-200'
            } hover:border-l-blue-500 transition-all duration-300`}
          >
            <div className="flex items-center justify-between group">
              <button
                onClick={() => toggleQuestion(q.id)}
                className="flex-grow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    expandedQuestions.includes(q.id)
                      ? isDarkMode 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-100 text-gray-500'
                  } transition-all duration-300`}>
                    {index + 1}
                  </div>
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } group-hover:text-blue-500 transition-colors duration-300`}>
                    {q.question}
                  </h3>
                </div>
              </button>

              <div className="flex items-center space-x-3 ml-4">
                {q.image && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => openImageModal(q.image!, q.imageTitle, e)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-blue-500/20 text-blue-400' 
                        : 'hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </motion.button>
                )}
                {q.note && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => openNoteModal(q.note!, e)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-yellow-500/20 text-yellow-400' 
                        : 'hover:bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    <StickyNote className="h-5 w-5" />
                  </motion.button>
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg ${
                    expandedQuestions.includes(q.id)
                      ? isDarkMode 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  } transition-all duration-300`}
                >
                  {expandedQuestions.includes(q.id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </motion.div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedQuestions.includes(q.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-6 ml-12 pt-4 border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className={`relative p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className={`whitespace-pre-line ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      } leading-relaxed`}>
                        {q.answer.split(/\*\*(.*?)\*\*/g).map((part, index) => (
                          <span key={index} className={index % 2 === 1 ? 'font-bold text-blue-500' : ''}>
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ isOpen: false, url: '', title: '' })}
        isDarkMode={isDarkMode}
      >
        <div className="flex flex-col items-center">
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {imageModal.title || "Illustration détaillée"}
          </h3>
          <img
            src={imageModal.url}
            alt="Illustration détaillée"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </Modal>

      <Modal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ isOpen: false, text: '' })}
        isDarkMode={isDarkMode}
      >
        <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          <h3 className="text-xl font-semibold mb-4">Note importante</h3>
          <p className="whitespace-pre-line text-lg">{noteModal.text}</p>
        </div>
      </Modal>
    </>
  );
};

export default CourseQuestions;