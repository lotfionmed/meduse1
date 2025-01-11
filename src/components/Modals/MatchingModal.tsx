import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface MatchingItem {
  id: string;
  leftColumn: string;
  rightColumn: string;
}

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  exercises: Array<{
    id: string;
    title: string;
    description: string;
    items: MatchingItem[];
  }>;
  currentExerciseIndex: number;
  onExerciseChange: (index: number) => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  exercises,
  currentExerciseIndex,
  onExerciseChange
}) => {
  const exercise = exercises[currentExerciseIndex];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shuffledLeftItems = useMemo(() => {
    return [...exercise.items]
      .sort(() => Math.random() - 0.5)
      .map(item => ({
        id: item.id,
        leftColumn: item.leftColumn,
        rightColumn: item.rightColumn
      }));
  }, [exercise.id]);

  const rightItems = exercise.items.map(item => item.rightColumn);

  useEffect(() => {
    drawLines();
  }, [matches, isDarkMode]);

  useEffect(() => {
    setMatches({});
    setIsCorrect({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setShowSuccess(false);
  }, [currentExerciseIndex]);

  const drawLines = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.entries(matches).forEach(([leftId, rightText]) => {
      const leftElement = document.getElementById(`left-${leftId}`);
      const rightElement = document.getElementById(`right-${rightText}`);

      if (leftElement && rightElement) {
        const leftRect = leftElement.getBoundingClientRect();
        const rightRect = rightElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const startX = leftRect.right - canvasRect.left;
        const startY = leftRect.top - canvasRect.top + leftRect.height / 2;
        const endX = rightRect.left - canvasRect.left;
        const endY = rightRect.top - canvasRect.top + rightRect.height / 2;

        // Dessiner une ligne courbe
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        const controlX = startX + (endX - startX) / 2;
        ctx.bezierCurveTo(
          controlX, startY,
          controlX, endY,
          endX, endY
        );

        // Couleur de la ligne basée sur la correction
        if (isCorrect[leftId] !== undefined) {
          ctx.strokeStyle = isCorrect[leftId] 
            ? isDarkMode ? '#22c55e' : '#16a34a'  // vert
            : isDarkMode ? '#ef4444' : '#dc2626'; // rouge
        } else {
          ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dessiner une flèche
        const arrowSize = 8;
        const angle = Math.atan2(endY - startY, endX - startX);
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });
  };

  const handleLeftClick = (id: string) => {
    if (isCorrect[id] !== undefined) return; // Empêcher la modification des réponses vérifiées
    
    // Si l'élément est déjà sélectionné, le désélectionner
    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }

    // Si un élément de droite est déjà sélectionné
    if (selectedRight) {
      setMatches(prev => ({ ...prev, [id]: selectedRight }));
      setSelectedRight(null);
    } else {
      // Sinon, juste sélectionner l'élément de gauche
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (text: string) => {
    // Vérifier si cet élément est déjà correctement apparié
    const matchedLeftId = Object.entries(matches).find(
      ([leftId, rightText]) => rightText === text && isCorrect[leftId]
    )?.[0];
    if (matchedLeftId && isCorrect[matchedLeftId]) return;

    // Si l'élément est déjà sélectionné, le désélectionner
    if (selectedRight === text) {
      setSelectedRight(null);
      return;
    }

    // Si un élément de gauche est déjà sélectionné
    if (selectedLeft) {
      setMatches(prev => ({ ...prev, [selectedLeft]: text }));
      setSelectedLeft(null);
    } else {
      // Sinon, juste sélectionner l'élément de droite
      setSelectedRight(text);
    }
  };

  const checkAnswers = () => {
    const newIsCorrect: { [key: string]: boolean } = {};
    let correctCount = 0;

    exercise.items.forEach(item => {
      const selectedRight = matches[item.id];
      const correct = selectedRight === item.rightColumn;
      newIsCorrect[item.id] = correct;
      if (correct) correctCount++;
    });

    setIsCorrect(newIsCorrect);
    setScore((correctCount / exercise.items.length) * 100);
    
    if (correctCount === exercise.items.length) {
      setShowSuccess(true);
    }
  };

  const resetExercise = () => {
    setMatches({});
    setIsCorrect({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setShowSuccess(false);
  };

  const handlePrevious = () => {
    onExerciseChange(currentExerciseIndex - 1);
  };

  const handleNext = () => {
    onExerciseChange(currentExerciseIndex + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-4xl rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{exercise.title}</h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {exercise.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  Exercise {currentExerciseIndex + 1}/{exercises.length}
                </span>
                {score > 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    score === 100
                      ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-orange-900 text-orange-100' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Score: {score}%
                  </span>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-500/50' : 'bg-gray-200 hover:bg-gray-300 shadow-lg shadow-gray-300/50'
              }`}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Contenu de l'exercice avec animation simple */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExerciseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Zone de matching */}
              <div className="relative flex justify-between gap-20 bg-opacity-50 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none"
                  width={800}
                  height={600}
                />
                
                {/* Colonnes */}
                <div className="w-1/2 space-y-4">
                  {shuffledLeftItems.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id={`left-${item.id}`}
                      onClick={() => handleLeftClick(item.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedLeft === item.id
                          ? isDarkMode
                            ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                            : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                          : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      } ${
                        isCorrect[item.id] !== undefined
                          ? isCorrect[item.id]
                            ? isDarkMode 
                              ? 'border-2 border-green-500 shadow-lg shadow-green-500/50'
                              : 'border-2 border-green-500 shadow-lg shadow-green-500/50'
                            : isDarkMode
                              ? 'border-2 border-red-500 shadow-lg shadow-red-500/50'
                              : 'border-2 border-red-500 shadow-lg shadow-red-500/50'
                          : ''
                      }`}
                    >
                      {item.leftColumn}
                    </motion.div>
                  ))}
                </div>

                <div className="w-1/2 space-y-4">
                  {rightItems.map((text, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      id={`right-${text}`}
                      onClick={() => handleRightClick(text)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedRight === text
                          ? isDarkMode
                            ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                            : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                          : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              disabled={currentExerciseIndex === 0}
              className={`p-3 rounded-full ${
                currentExerciseIndex === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-500/50' 
                    : 'bg-gray-200 hover:bg-gray-300 shadow-lg shadow-gray-300/50'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={checkAnswers}
              className={`p-3 rounded-full ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/50'
              } text-white`}
            >
              <Check className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetExercise}
              className={`p-3 rounded-full ${
                isDarkMode
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-500/50'
                  : 'bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/50'
              } text-white`}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              disabled={currentExerciseIndex === exercises.length - 1}
              className={`p-3 rounded-full ${
                currentExerciseIndex === exercises.length - 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-500/50' 
                    : 'bg-gray-200 hover:bg-gray-300 shadow-lg shadow-gray-300/50'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchingModal;
