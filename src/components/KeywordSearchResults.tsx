import React from 'react';
import { motion } from 'framer-motion';
import { X, Key } from 'lucide-react';
import KeywordDefinitionModal from './CourseContent/KeywordDefinitionModal';

interface KeywordResult {
  term: string;
  definition: string;
  moduleTitle: string;
  courseTitle: string;
}

interface KeywordSearchResultsProps {
  results: KeywordResult[];
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const KeywordSearchResults: React.FC<KeywordSearchResultsProps> = ({
  results,
  isOpen,
  onClose,
  isDarkMode,
  searchValue,
  onSearchChange
}) => {
  const [selectedKeyword, setSelectedKeyword] = React.useState<KeywordResult | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-3xl rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recherche de mots-clés</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Key className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border text-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Rechercher un mot-clé..."
              />
            </div>
          </div>

          <div className="mb-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
            </p>
          </div>

          {results.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Key className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aucun mot-clé trouvé pour cette recherche.</p>
              <p className="text-sm mt-2">Essayez avec d'autres termes.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedKeyword(result)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h3 className="font-semibold mb-1">{result.term}</h3>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <p>Module: {result.moduleTitle}</p>
                    <p>Cours: {result.courseTitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedKeyword && (
            <KeywordDefinitionModal
              term={selectedKeyword.term}
              definition={selectedKeyword.definition}
              onClose={() => setSelectedKeyword(null)}
              isDarkMode={isDarkMode}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default KeywordSearchResults;