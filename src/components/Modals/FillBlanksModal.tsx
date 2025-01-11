import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCircle, ChevronRight, ChevronLeft, Award } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Blank {
  id: string;
  correctWord: string;
  currentWord?: string;
}

interface Exercise {
  text: string;
  words: Word[];
  blanks: Blank[];
}

interface FillBlanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  exercises: Exercise[];
}

const FillBlanksModal: React.FC<FillBlanksModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  exercises
}) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showCongrats, setShowCongrats] = useState(false);
  const [draggedWordId, setDraggedWordId] = useState<string | null>(null);
  const [currentBlankId, setCurrentBlankId] = useState<string | null>(null);

  useEffect(() => {
    if (showResults) {
      const correctAnswers = exercises[currentExercise].blanks.filter(
        blank => userAnswers[blank.id] === blank.correctWord
      ).length;
      const totalBlanks = exercises[currentExercise].blanks.length;
      setScore({ correct: correctAnswers, total: totalBlanks });
      
      if (correctAnswers === totalBlanks) {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 2000);
      }
    }
  }, [showResults]);

  const handleDragStart = (word: string, wordId: string) => {
    setDraggedWord(word);
    setDraggedWordId(wordId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (blankId: string) => {
    if (draggedWord) {
      setUserAnswers(prev => ({
        ...prev,
        [blankId]: draggedWord
      }));
      setDraggedWord(null);
      setDraggedWordId(null);
    }
  };

  const handleWordClick = (word: string, wordId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentBlankId as string]: word
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore({ correct: 0, total: 0 });
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      resetExercise();
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
      resetExercise();
    }
  };

  const exercise = exercises[currentExercise];
  const words = exercise.words.map(word => ({
    ...word,
    isUsed: Object.values(userAnswers).includes(word.text)
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-6xl rounded-2xl shadow-2xl p-4 md:p-8 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                {/* Main Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4 md:mb-8 mt-4">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
                      Exercice {currentExercise + 1}/{exercises.length}
                    </h2>
                    <div className="flex items-center gap-2 md:gap-4">
                      {showResults && (
                        <span className={`text-sm md:text-base font-semibold ${
                          score.correct === score.total ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          Score: {score.correct}/{score.total}
                        </span>
                      )}
                      <button
                        onClick={onClose}
                        className={`p-1.5 md:p-2 rounded-lg transition-colors duration-300 hover:bg-opacity-80 ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <X className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Exercise Text */}
                  <div className={`p-4 md:p-8 rounded-xl mb-4 md:mb-8 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  } shadow-inner backdrop-blur-sm border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="text-base md:text-lg leading-[2.2] tracking-wide font-medium space-y-4 md:space-y-6">
                      {exercise.text.split('___').map((part, index) => (
                        <React.Fragment key={index}>
                          <span className={`${
                            isDarkMode ? 'text-gray-100' : 'text-gray-700'
                          }`}>
                            {part}
                          </span>
                          {index < exercise.blanks.length && (
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(exercise.blanks[index].id)}
                              onClick={() => setCurrentBlankId(exercise.blanks[index].id)}
                              className={`inline-block mx-1 md:mx-2 px-3 md:px-6 py-1 md:py-2 min-w-[80px] md:min-w-[120px] text-center rounded-lg transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                                userAnswers[exercise.blanks[index].id]
                                  ? isDarkMode
                                    ? 'bg-blue-600/80 shadow-lg shadow-blue-500/20'
                                    : 'bg-blue-500/80 shadow-lg shadow-blue-500/20'
                                  : isDarkMode
                                  ? 'bg-gray-600/50 border-2 border-dashed border-gray-500'
                                  : 'bg-gray-200/50 border-2 border-dashed border-gray-300'
                              } ${
                                showResults
                                  ? userAnswers[exercise.blanks[index].id] === exercise.blanks[index].correctWord
                                    ? 'bg-green-500/20 border-green-500 text-green-500'
                                    : 'bg-red-500/20 border-red-500 text-red-500'
                                  : ''
                              }`}
                            >
                              <span className="text-sm md:text-base">
                                {userAnswers[exercise.blanks[index].id] || '...'}
                              </span>
                            </motion.span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-4 md:mt-6">
                    <button
                      onClick={previousExercise}
                      disabled={currentExercise === 0}
                      className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-colors duration-300 ${
                        currentExercise === 0
                          ? isDarkMode
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="hidden md:inline">Précédent</span>
                      <span className="md:hidden">Préc</span>
                    </button>
                    <button
                      onClick={nextExercise}
                      disabled={currentExercise === exercises.length - 1}
                      className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-colors duration-300 ${
                        currentExercise === exercises.length - 1
                          ? isDarkMode
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="hidden md:inline">Suivant</span>
                      <span className="md:hidden">Suiv</span>
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>

                {/* Words Bank */}
                <div className={`flex flex-wrap md:flex-col gap-2 p-4 rounded-xl w-full md:w-64 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <div className="w-full text-sm md:text-base font-medium mb-2 text-center md:text-left">
                    Mots disponibles:
                  </div>
                  {words.map(word => (
                    <motion.div
                      key={word.id}
                      draggable
                      onDragStart={() => handleDragStart(word.text, word.id)}
                      onClick={() => handleWordClick(word.text, word.id)}
                      whileHover={!word.isUsed ? { scale: 1.05 } : {}}
                      className={`text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        word.isUsed
                          ? isDarkMode
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-gray-600 hover:bg-gray-500 text-white'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {word.text}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2 md:gap-4 mt-4 md:mt-6">
                <button
                  onClick={resetExercise}
                  className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <RefreshCw className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Recommencer</span>
                  <span className="md:hidden">Reset</span>
                </button>
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== exercise.blanks.length}
                  className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-colors duration-300 ${
                    Object.keys(userAnswers).length === exercise.blanks.length
                      ? isDarkMode
                        ? 'bg-primary-600 hover:bg-primary-500 text-white'
                        : 'bg-primary-500 hover:bg-primary-400 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Vérifier les réponses</span>
                  <span className="md:hidden">Vérifier</span>
                </button>
              </div>

              {/* Congratulations Animation */}
              <AnimatePresence>
                {showCongrats && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1 }}
                      className="bg-green-500 text-white p-8 rounded-full shadow-lg"
                    >
                      <Award className="h-16 w-16" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FillBlanksModal;
