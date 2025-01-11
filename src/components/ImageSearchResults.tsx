import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, Image, Layers } from 'lucide-react';

interface ImageResult {
  url: string;
  title: string;
  description: string;
  moduleTitle: string;
  courseTitle: string;
  structures?: Array<{
    name: string;
    description: string;
  }>;
}

interface ImageSearchResultsProps {
  results: ImageResult[];
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({
  results,
  isOpen,
  onClose,
  isDarkMode,
  searchValue,
  onSearchChange
}) => {
  const [selectedStructures, setSelectedStructures] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-6xl rounded-xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recherche d'images</h2>
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border text-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Rechercher dans les images ou les structures anatomiques..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Image className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
            </p>
          </div>

          {results.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aucune image trouvée pour cette recherche.</p>
              <p className="text-sm mt-2">Essayez avec d'autres mots-clés ou structures anatomiques.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg overflow-hidden shadow-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={result.url}
                      alt={result.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{result.title}</h3>
                    <p className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {result.description}
                    </p>
                    {result.structures && result.structures.length > 0 && (
                      <div className="mb-3">
                        <button
                          onClick={() => setSelectedStructures(selectedStructures === result.url ? null : result.url)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-300 ${
                            isDarkMode
                              ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        >
                          <Layers className="h-4 w-4" />
                          <span>Structures anatomiques</span>
                        </button>
                        {selectedStructures === result.url && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 space-y-2"
                          >
                            {result.structures.map((structure, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{structure.name}:</span>
                                <span className={`ml-1 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {structure.description}
                                </span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    )}
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <p>Module: {result.moduleTitle}</p>
                      <p>Cours: {result.courseTitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageSearchResults;