import React, { useState } from 'react';
import { ClipboardCheck, BookOpen, Youtube, X, ArrowLeftRight, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import QuizModal from '../QuizModal';
import MatchingModal from '../Modals/MatchingModal';
import FillBlanksModal from '../Modals/FillBlanksModal';

interface CourseActionsProps {
  course: any;
  isDarkMode: boolean;
  showQuiz: boolean;
  setShowQuiz: (show: boolean) => void;
  showReferences: boolean;
  setShowReferences: (show: boolean) => void;
  showVideos: boolean;
  setShowVideos: (show: boolean) => void;
}

const CourseActions: React.FC<CourseActionsProps> = ({
  course,
  isDarkMode,
  showQuiz,
  setShowQuiz,
  showReferences,
  setShowReferences,
  showVideos,
  setShowVideos
}) => {
  const [quizType, setQuizType] = useState<'normal' | 'clinical' | null>(null);
  const [showMatching, setShowMatching] = useState(false);
  const [currentMatchingIndex, setCurrentMatchingIndex] = useState(0);
  const [showFillBlanks, setShowFillBlanks] = useState(false);

  const openQuiz = (type: 'normal' | 'clinical') => {
    setQuizType(type);
    setShowQuiz(true);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizType(null);
  };

  return (
    <>
      <div className={`flex justify-center gap-4 py-8 mt-8 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {course.content?.normalMode?.quiz && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openQuiz('normal')}
            className={`p-3 rounded-full shadow-lg ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-500 hover:bg-blue-400 text-white'
            }`}
          >
            <ClipboardCheck className="h-5 w-5" />
          </motion.button>
        )}

        {course.content?.clinicalQuiz && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openQuiz('clinical')}
            className={`p-3 rounded-full shadow-lg ${
              isDarkMode
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-green-500 hover:bg-green-400 text-white'
            }`}
          >
            <ClipboardCheck className="h-5 w-5" />
          </motion.button>
        )}

        {course.content?.normalMode?.matching && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCurrentMatchingIndex(0);
              setShowMatching(true);
            }}
            className={`p-3 rounded-full shadow-lg ${
              isDarkMode
                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                : 'bg-orange-500 hover:bg-orange-400 text-white'
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </motion.button>
        )}

        {course.content?.normalMode?.fillBlanks && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFillBlanks(true)}
            className={`p-3 rounded-full shadow-lg ${
              isDarkMode
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-purple-500 hover:bg-purple-400 text-white'
            }`}
          >
            <Edit3 className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      {showQuiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={closeQuiz}
          isDarkMode={isDarkMode}
          quizId={
            quizType === 'normal' 
              ? course.content.normalMode.quiz.id 
              : course.content.clinicalQuiz.id
          }
          title={
            quizType === 'normal'
              ? course.content.normalMode.quiz.title
              : course.content.clinicalQuiz.title
          }
          questions={quizType === 'normal' ? course.content.normalMode.quiz.questions : undefined}
          cases={quizType === 'clinical' ? course.content.clinicalQuiz.cases : undefined}
        />
      )}

      {/* Matching Modal */}
      {showMatching && course.content?.normalMode?.matching && (
        <MatchingModal
          isOpen={showMatching}
          onClose={() => {
            setShowMatching(false);
            setCurrentMatchingIndex(0);
          }}
          isDarkMode={isDarkMode}
          exercises={course.content.normalMode.matching}
          currentExerciseIndex={currentMatchingIndex}
          onExerciseChange={setCurrentMatchingIndex}
        />
      )}

      {/* Fill Blanks Modal */}
      {showFillBlanks && course.content?.normalMode?.fillBlanks && (
        <FillBlanksModal
          isOpen={showFillBlanks}
          onClose={() => setShowFillBlanks(false)}
          isDarkMode={isDarkMode}
          exercises={course.content.normalMode.fillBlanks.exercises}
        />
      )}
    </>
  );
};

export default CourseActions;