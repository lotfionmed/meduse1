import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Menu, X, ClipboardCheck, Download } from 'lucide-react';
import QuizModal from './QuizModal';
import { generateClinicalCasePDF } from '../utils/clinicalPdfGenerator';

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface ClinicalCase {
  id: string;
  title: string;
  presentation: string;
  questions: Question[];
}

interface ClinicalCaseProps {
  clinicalCase: ClinicalCase;
  clinicalQuiz: any;
  isDarkMode: boolean;
  onBack: () => void;
}

const ClinicalCase: React.FC<ClinicalCaseProps> = ({
  clinicalCase,
  clinicalQuiz,
  isDarkMode
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const questionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const outlineRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outlineRef.current && 
        !outlineRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowOutline(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = questionsRef.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    questionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleQuestion = (questionId: number) => {
    if (expandedQuestions.includes(questionId)) {
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
    } else {
      setExpandedQuestions([...expandedQuestions, questionId]);
    }
  };

  const scrollToQuestion = (index: number) => {
    questionsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setShowOutline(false);
  };

  const handleDownloadPDF = () => {
    const pdf = generateClinicalCasePDF(clinicalCase, isDarkMode);
    pdf.save(`cas-clinique-${clinicalCase.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="relative">
      {/* Bouton pour afficher le plan */}
      <button
        ref={menuButtonRef}
        onClick={() => setShowOutline(!showOutline)}
        className={`fixed top-20 left-4 z-40 p-2 rounded-lg shadow-lg transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-50 text-gray-900'
        }`}
      >
        {showOutline ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Plan du cas clinique rétractable */}
      <AnimatePresence>
        {showOutline && (
          <motion.div
            ref={outlineRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed top-0 left-0 w-64 h-screen z-30 overflow-y-auto p-4 pt-20 shadow-xl ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Plan du cas clinique
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDownloadPDF}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                }`}
              >
                <Download className="h-4 w-4" />
              </motion.button>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => {
                  document.querySelector('#presentation')?.scrollIntoView({ behavior: 'smooth' });
                  setShowOutline(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors duration-300 ${
                  activeSection === null
                    ? isDarkMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Présentation du cas
              </button>
              {clinicalCase.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(index)}
                  className={`w-full text-left p-2 rounded-lg text-sm transition-colors duration-300 ${
                    activeSection === index
                      ? isDarkMode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {q.question}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* En-tête du cas clinique */}
          <div 
            id="presentation"
            className={`p-8 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <h1 className={`text-3xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {clinicalCase.title}
            </h1>
            <p className={`text-lg leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {clinicalCase.presentation}
            </p>
          </div>

          {/* Questions et réponses */}
          <div className="space-y-4">
            {clinicalCase.questions.map((q, index) => (
              <motion.div
                key={q.id}
                ref={el => questionsRef.current[index] = el}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {q.question}
                    </h3>
                    {expandedQuestions.includes(q.id) ? (
                      <ChevronUp className={`h-5 w-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedQuestions.includes(q.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-4 pt-4 border-t ${
                        isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                      }`}>
                        <div className="whitespace-pre-line">{q.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Bouton Quiz */}
          {clinicalQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuiz(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                }`}
              >
                <ClipboardCheck className="h-5 w-5" />
                <span>Tester vos connaissances</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Quiz Modal */}
        {clinicalQuiz && (
          <QuizModal
            isOpen={showQuiz}
            onClose={() => setShowQuiz(false)}
            isDarkMode={isDarkMode}
            quizId={clinicalQuiz.id}
            title={clinicalQuiz.title}
            cases={clinicalQuiz.cases}
          />
        )}
      </div>
    </div>
  );
};

export default ClinicalCase;