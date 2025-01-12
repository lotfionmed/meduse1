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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          } transition-colors duration-300`}
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
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
      <div className="space-y-3 md:space-y-4">
        {course.content?.normalMode?.questions.map((q: Question, index: number) => (
          <motion.div
            key={q.id}
            ref={el => questionsRef.current[index] = el}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl ${
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
            <div 
              onClick={() => toggleQuestion(q.id)}
              className="p-4 md:p-6 cursor-pointer"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`flex items-center justify-center min-w-[2rem] h-8 rounded-full text-sm md:text-base ${
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-base md:text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } group-hover:text-blue-500 transition-colors duration-300 pr-8`}>
                      {q.question}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.image && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => openImageModal(q.image!, q.imageTitle, e)}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors duration-300 ${
                            isDarkMode 
                              ? 'hover:bg-blue-500/20 text-blue-400' 
                              : 'hover:bg-blue-100 text-blue-600'
                          }`}
                          aria-label="Voir l'image"
                        >
                          <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
                        </motion.button>
                      )}
                      {q.note && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => openNoteModal(q.note!, e)}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors duration-300 ${
                            isDarkMode 
                              ? 'hover:bg-yellow-500/20 text-yellow-400' 
                              : 'hover:bg-yellow-100 text-yellow-600'
                          }`}
                          aria-label="Voir la note"
                        >
                          <StickyNote className="h-4 w-4 md:h-5 md:w-5" />
                        </motion.button>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 md:p-2 rounded-lg ${
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
                          <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                      </motion.div>
                    </div>
                  </div>
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
                    <div className={`mt-4 md:mt-6 ml-11 md:ml-12 pt-4 border-t ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className={`relative p-3 md:p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                        <div className={`whitespace-pre-line text-sm md:text-base ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        } leading-relaxed`}>
                          {q.answer}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ isOpen: false, url: '', title: '' })}
        isDarkMode={isDarkMode}
      >
        <div className="p-4">
          {imageModal.title && (
            <h3 className={`text-lg md:text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {imageModal.title}
            </h3>
          )}
          <img 
            src={imageModal.url} 
            alt={imageModal.title || 'Question image'} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ isOpen: false, text: '' })}
        isDarkMode={isDarkMode}
      >
        <div className="p-4">
          <h3 className={`text-lg md:text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Note
          </h3>
          <div className={`whitespace-pre-line text-sm md:text-base ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {noteModal.text}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CourseQuestions;