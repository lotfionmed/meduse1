import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, ChevronLeft, ChevronRight, RefreshCw, Info, ArrowLeft, Menu } from 'lucide-react';
import ExplanationModal from './ExplanationModal';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Case {
  id: string;
  title: string;
  presentation: string;
  questions: Question[];
  imageUrl?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  title: string;
  questions?: Question[];
  cases?: Case[];
  quizId: string;
}

interface QuizState {
  currentCase: number;
  currentQuestion: number;
  selectedAnswers: { [key: string]: number };
  score: number;
  completed: boolean;
  lastUpdated: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, isDarkMode, title, questions, cases, quizId }) => {
  const storageKey = `quiz_state_${quizId}`;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSwipingDisabled, setIsSwipingDisabled] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Fonction pour charger l'état depuis le localStorage avec encryption
  const loadQuizState = useCallback((): QuizState | null => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        const lastUpdated = new Date(state.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
          localStorage.removeItem(storageKey);
          return null;
        }
        return state;
      }
    } catch (error) {
      console.error('Error loading quiz state:', error);
      localStorage.removeItem(storageKey);
    }
    return null;
  }, [storageKey]);

  // Fonction pour sauvegarder l'état avec encryption
  const saveQuizState = useCallback((state: Partial<QuizState>) => {
    try {
      const currentState = loadQuizState() || {
        currentCase: 0,
        currentQuestion: 0,
        selectedAnswers: {},
        score: 0,
        completed: false,
        lastUpdated: new Date().toISOString()
      };
      
      const newState = {
        ...currentState,
        ...state,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  }, [storageKey, loadQuizState]);

  const initialState = loadQuizState();
  const [currentCase, setCurrentCase] = useState(initialState?.currentCase || 0);
  const [currentQuestion, setCurrentQuestion] = useState(initialState?.currentQuestion || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>(initialState?.selectedAnswers || {});
  const [score, setScore] = useState(initialState?.score || 0);
  const [quizCompleted, setQuizCompleted] = useState(initialState?.completed || false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState("");

  // Restaurer la fonction resetQuiz
  const resetQuiz = () => {
    localStorage.removeItem(storageKey);
    setCurrentCase(0);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  // Restaurer la fonction calculateProgress
  const calculateProgress = () => {
    const totalAnswered = Object.keys(selectedAnswers).length;
    return Math.round((totalAnswered / (cases ? cases.reduce((total, c) => total + c.questions.length, 0) : questions?.length || 0)) * 100);
  };

  // Gestion du swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSwipingDisabled) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSwipingDisabled || touchStart === null) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextQuestion();
      } else {
        handlePreviousQuestion();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Sauvegarde automatique de l'état
  useEffect(() => {
    if (isOpen) {
      saveQuizState({
        currentCase,
        currentQuestion,
        selectedAnswers,
        score,
        completed: quizCompleted
      });
    }
  }, [currentCase, currentQuestion, selectedAnswers, score, quizCompleted, isOpen, saveQuizState]);

  // Fonction pour vérifier si on peut passer à la question suivante
  const canGoToNextQuestion = () => {
    const questionKey = getQuestionKey(currentCase, currentQuestion);
    return selectedAnswers[questionKey] !== undefined;
  };

  const handleNextQuestion = () => {
    // Vérifier si on peut passer à la suivante
    if (!canGoToNextQuestion()) return;

    // Si on n'est pas à la dernière question du cas actuel
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    // Si on a d'autres cas et qu'on est à la dernière question du cas actuel
    else if (cases && currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
      setCurrentQuestion(0);
    }
    // Si on est à la dernière question du dernier cas
    else {
      setQuizCompleted(true);
    }
    
    setShowExplanation(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (cases && currentCase > 0) {
      setCurrentCase(currentCase - 1);
      const previousCase = cases[currentCase - 1];
      setCurrentQuestion(previousCase.questions.length - 1);
    }
    setShowExplanation(false);
  };

  const goToQuestion = (index: number) => {
    // Navigation libre entre toutes les questions
    if (index >= 0 && index < currentQuestions.length) {
      setCurrentQuestion(index);
    }
  };

  if (!isOpen) return null;

  const currentQuestions = cases ? cases[currentCase]?.questions : questions;
  const totalQuestions = cases
    ? cases.reduce((total, c) => total + c.questions.length, 0)
    : questions?.length || 0;

  const getQuestionKey = (caseIndex: number, questionIndex: number) => {
    return cases ? `case_${caseIndex}_q_${questionIndex}` : `q_${questionIndex}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const questionKey = getQuestionKey(currentCase, currentQuestion);
    if (selectedAnswers[questionKey] !== undefined) return;
    
    const isCorrect = currentQuestions[currentQuestion].correctAnswer === answerIndex;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionKey]: answerIndex
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleShowExplanation = () => {
    if (currentQuestions && currentQuestions[currentQuestion]) {
      setCurrentExplanation(currentQuestions[currentQuestion].explanation);
      setShowExplanation(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className={`fixed inset-0 w-full h-full flex flex-col ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestion + 1}/{currentQuestions?.length}
                {currentQuestions?.[currentQuestion]?.difficulty && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    currentQuestions[currentQuestion].difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : currentQuestions[currentQuestion].difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {currentQuestions[currentQuestion].difficulty.charAt(0).toUpperCase() + 
                     currentQuestions[currentQuestion].difficulty.slice(1)}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Bouton Recommencer */}
            <button
              onClick={resetQuiz}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden md:inline">Recommencer</span>
            </button>
            {cases && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Barre de navigation des questions */}
        <div className="border-b overflow-x-auto bg-white dark:bg-gray-900">
          <div className="flex p-2 gap-2 min-w-max">
            {currentQuestions?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                  currentQuestion === index
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${
                  selectedAnswers[getQuestionKey(currentCase, index)] !== undefined
                    ? selectedAnswers[getQuestionKey(currentCase, index)] === currentQuestions[index].correctAnswer
                      ? 'ring-2 ring-green-500'
                      : 'ring-2 ring-red-500'
                    : ''
                }`}
              >
                <span className="font-medium">Q{index + 1}</span>
                {selectedAnswers[getQuestionKey(currentCase, index)] !== undefined && (
                  <span>
                    {selectedAnswers[getQuestionKey(currentCase, index)] === currentQuestions[index].correctAnswer 
                      ? '✓' 
                      : '✗'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar des cas si présent */}
          <AnimatePresence>
            {cases && (isSidebarOpen || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r"
              >
                {cases.map((c, index) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCurrentCase(index);
                      setCurrentQuestion(0);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full p-4 text-left transition ${
                      currentCase === index
                        ? 'bg-blue-50 dark:bg-blue-900'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">Cas {index + 1}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {c.title}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zone de contenu principale */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Cas si présent */}
                {cases && cases[currentCase] && (
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
                  }`}>
                    <h3 className="text-lg font-semibold mb-2">{cases[currentCase].title}</h3>
                    <p>{cases[currentCase].presentation}</p>
                    {cases[currentCase].imageUrl && (
                      <img
                        src={cases[currentCase].imageUrl}
                        alt={cases[currentCase].title}
                        className="mt-4 rounded-lg w-full h-auto"
                      />
                    )}
                  </div>
                )}

                {/* Question et Options */}
                {currentQuestions && currentQuestions[currentQuestion] && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <p className="text-lg">{currentQuestions[currentQuestion].text}</p>
                      {currentQuestions[currentQuestion].imageUrl && (
                        <img
                          src={currentQuestions[currentQuestion].imageUrl}
                          alt="Question illustration"
                          className="mt-4 rounded-lg w-full h-auto"
                        />
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestions[currentQuestion].options.map((option, index) => {
                        const questionKey = getQuestionKey(currentCase, currentQuestion);
                        const isSelected = selectedAnswers[questionKey] === index;
                        const isCorrect = currentQuestions[currentQuestion].correctAnswer === index;
                        const hasAnswered = selectedAnswers[questionKey] !== undefined;
                        
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 rounded-lg text-left transition-all ${
                              !hasAnswered
                                ? isDarkMode
                                  ? 'hover:bg-gray-800 bg-gray-900'
                                  : 'hover:bg-gray-100 bg-white'
                                : isSelected
                                  ? isCorrect
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                  : isCorrect && hasAnswered
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 ring-2 ring-green-500'
                                    : isDarkMode
                                      ? 'bg-gray-900'
                                      : 'bg-white'
                            } ${
                              hasAnswered ? 'cursor-default' : 'cursor-pointer'
                            }`}
                            initial={false}
                            animate={{
                              scale: isSelected ? 1.02 : 1,
                            }}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                  !hasAnswered
                                    ? 'border-2 border-gray-300 dark:border-gray-600'
                                    : isSelected
                                      ? isCorrect
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                      : isCorrect && hasAnswered
                                        ? 'bg-green-500'
                                        : 'border-2 border-gray-300 dark:border-gray-600'
                                }`}>
                                  {hasAnswered && (isSelected || isCorrect) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", damping: 10 }}
                                    >
                                      {isCorrect ? (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-white" />
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                                <span className={`flex-1 ${
                                  hasAnswered && !isSelected && !isCorrect
                                    ? 'text-gray-500 dark:text-gray-400'
                                    : ''
                                }`}>
                                  {option}
                                </span>
                              </div>
                              {hasAnswered && isCorrect && (
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                  Bonne réponse
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Bouton d'explication */}
                    {selectedAnswers[getQuestionKey(currentCase, currentQuestion)] !== undefined && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleShowExplanation}
                        className="mt-4 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors duration-200 w-auto mx-auto shadow-md hover:shadow-lg"
                      >
                        <Info className="w-5 h-5" />
                        <span>Voir l'explication</span>
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer avec navigation */}
            <div className="border-t p-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0 && currentCase === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    currentQuestion === 0 && currentCase === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden md:inline">Précédent</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">
                    Score: {score}/{totalQuestions}
                  </div>
                  <div className="h-2 w-32 md:w-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={!canGoToNextQuestion()}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    !canGoToNextQuestion()
                      ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <span className="hidden md:inline">
                    {currentQuestion === currentQuestions.length - 1 && (!cases || currentCase === cases.length - 1)
                      ? 'Terminer'
                      : 'Suivant'
                    }
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal d'explication */}
      <AnimatePresence>
        {showExplanation && (
          <ExplanationModal
            isOpen={showExplanation}
            onClose={() => setShowExplanation(false)}
            explanation={currentExplanation}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizModal;