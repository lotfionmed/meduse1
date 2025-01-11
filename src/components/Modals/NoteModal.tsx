import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, ListChecks, Info, ChevronRight, Search } from 'lucide-react';

interface Note {
  title: string;
  content: string;
  type: 'definition' | 'concept' | 'important' | 'summary';
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  notes: Note[];
}

const NoteModal: React.FC<NoteModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  notes
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredNotes = notes.filter(note => {
    const matchesType = !selectedType || note.type === selectedType;
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'definition':
        return <BookOpen className="h-6 w-6" />;
      case 'concept':
        return <FileText className="h-6 w-6" />;
      case 'important':
        return <ListChecks className="h-6 w-6" />;
      case 'summary':
        return <Info className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getTypeBackground = (type: string, isDark: boolean) => {
    switch (type) {
      case 'definition':
        return isDark ? 'bg-blue-900/20' : 'bg-blue-50';
      case 'concept':
        return isDark ? 'bg-green-900/20' : 'bg-green-50';
      case 'important':
        return isDark ? 'bg-amber-900/20' : 'bg-amber-50';
      case 'summary':
        return isDark ? 'bg-purple-900/20' : 'bg-purple-50';
      default:
        return '';
    }
  };

  const getTypeIconColor = (type: string, isDark: boolean) => {
    switch (type) {
      case 'definition':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'concept':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'important':
        return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'summary':
        return isDark ? 'text-purple-400' : 'text-purple-600';
      default:
        return '';
    }
  };

  const getBorderColor = (type: string, isDark: boolean) => {
    switch (type) {
      case 'definition':
        return isDark ? 'border-blue-500/20' : 'border-blue-200';
      case 'concept':
        return isDark ? 'border-green-500/20' : 'border-green-200';
      case 'important':
        return isDark ? 'border-amber-500/20' : 'border-amber-200';
      case 'summary':
        return isDark ? 'border-purple-500/20' : 'border-purple-200';
      default:
        return '';
    }
  };

  const typeFilters = [
    { id: 'definition', label: 'Définitions', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'concept', label: 'Concepts', icon: <FileText className="h-5 w-5" /> },
    { id: 'important', label: 'Points Importants', icon: <ListChecks className="h-5 w-5" /> },
    { id: 'summary', label: 'Résumés', icon: <Info className="h-5 w-5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className={`fixed inset-0 w-full h-full flex flex-col ${
          isDarkMode 
            ? 'bg-gray-900 text-gray-100' 
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b backdrop-blur-lg ${
          isDarkMode ? 'border-gray-800 bg-gray-900/90' : 'border-gray-200 bg-white/90'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${
              isDarkMode 
                ? 'bg-primary-900/30 text-primary-400' 
                : 'bg-primary-100 text-primary-600'
            }`}>
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Résumé du Cours</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredNotes.length} notes disponibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors duration-300 ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-black'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className={`hidden md:flex flex-col w-72 flex-shrink-0 border-r overflow-hidden ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {/* Search Bar */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent w-full outline-none ${
                    isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  !selectedType
                    ? isDarkMode
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : isDarkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Tout</span>
              </button>
              {typeFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedType(filter.id)}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                    selectedType === filter.id
                      ? isDarkMode
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                      : isDarkMode
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="h-5 w-5">{filter.icon}</span>
                  <span className="font-medium">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border backdrop-blur-sm ${
                    getTypeBackground(note.type, isDarkMode)
                  } ${getBorderColor(note.type, isDarkMode)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-800/80' : 'bg-white'
                    } backdrop-blur-sm`}>
                      <span className={getTypeIconColor(note.type, isDarkMode)}>
                        {getTypeIcon(note.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {note.title}
                      </h3>
                      <p className={`leading-relaxed whitespace-pre-line ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                        dangerouslySetInnerHTML={{
                          __html: note.content.split('\n').map(line => {
                            // Gestion des listes numérotées (1. 2. 3. etc)
                            if (/^\d+\.\s/.test(line.trim())) {
                              return `<div class="flex gap-2 my-1">
                                <span class="font-semibold">${line.match(/^\d+\./)[0]}</span>
                                <span>${line.replace(/^\d+\.\s/, '')}</span>
                              </div>`;
                            }
                            // Gestion des listes à puces (-)
                            else if (/^\s*-\s/.test(line)) {
                              return `<div class="flex gap-2 my-1 ml-4">
                                <span class="text-lg">•</span>
                                <span>${line.replace(/^\s*-\s/, '')}</span>
                              </div>`;
                            }
                            // Lignes normales
                            return line ? `<div class="my-1">${line}</div>` : '<div class="my-2"></div>';
                          }).join('')
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteModal;
