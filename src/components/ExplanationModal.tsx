import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lightbulb, ExternalLink } from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
  isDarkMode: boolean;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  explanation,
  isDarkMode,
}) => {
  // Gérer la fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  // Formatter le texte d'explication pour gérer les points clés et les références
  const formatExplanation = (text: string) => {
    // Séparer les points clés s'ils sont présents
    const parts = text.split(/(?=Points clés:|Références:)/);
    return parts.map((part, index) => {
      if (part.startsWith('Points clés:')) {
        const points = part.replace('Points clés:', '').split('•').filter(p => p.trim());
        return (
          <div key={`points-${index}`} className="mt-4">
            <h4 className="flex items-center gap-2 font-semibold text-lg mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Points clés
            </h4>
            <ul className="space-y-2">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>{point.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      } else if (part.startsWith('Références:')) {
        const refs = part.replace('Références:', '').split('\n').filter(r => r.trim());
        return (
          <div key={`refs-${index}`} className="mt-4">
            <h4 className="flex items-center gap-2 font-semibold text-lg mb-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Références
            </h4>
            <ul className="space-y-2">
              {refs.map((ref, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <span>{ref.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <div key={`main-${index}`} className="prose dark:prose-invert max-w-none">
          {part}
        </div>
      );
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay avec effet de flou */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-2xl rounded-xl shadow-2xl ${
              isDarkMode 
                ? 'bg-gray-900 text-white border border-gray-800' 
                : 'bg-white text-gray-900'
            } overflow-hidden`}
          >
            {/* Header avec gradient */}
            <div className={`p-6 border-b ${
              isDarkMode ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Explication détaillée
                </h3>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 hover:text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content avec scroll personnalisé */}
            <div className={`p-6 max-h-[60vh] overflow-y-auto
              scrollbar-thin scrollbar-thumb-rounded-full
              ${isDarkMode 
                ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
                : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
              }`}
            >
              {formatExplanation(explanation)}
            </div>

            {/* Footer avec gradient inverse */}
            <div className={`p-6 border-t ${
              isDarkMode ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ExplanationModal;
