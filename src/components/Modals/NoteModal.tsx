import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, ListChecks, Info, ChevronRight } from 'lucide-react';

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

  if (!isOpen) return null;

  const filteredNotes = notes.filter(note => 
    !selectedType || note.type === selectedType
  );

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
        return isDark ? 'bg-blue-500/10' : 'bg-blue-500/10';
      case 'concept':
        return isDark ? 'bg-green-500/10' : 'bg-green-500/10';
      case 'important':
        return isDark ? 'bg-amber-500/10' : 'bg-amber-500/10';
      case 'summary':
        return isDark ? 'bg-purple-500/10' : 'bg-purple-500/10';
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
            : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2 md:p-3 rounded-xl ${
              isDarkMode 
                ? 'bg-primary-800/30 text-primary-400' 
                : 'bg-primary-100 text-primary-600'
            }`}>
              <BookOpen className="h-5 w-5 md:h-7 md:w-7" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold">Résumé du Cours</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 md:p-2 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-black'
            }`}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Filters - Mobile Version */}
          <div className="md:hidden border-b sticky top-0 bg-inherit z-10">
            <div className="grid grid-cols-2 gap-2 p-3">
              <button
                onClick={() => setSelectedType(null)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  !selectedType
                    ? isDarkMode
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-primary-500 text-white shadow-md'
                    : isDarkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Tout</span>
              </button>
              {typeFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedType(filter.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    selectedType === filter.id
                      ? isDarkMode
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-primary-500 text-white shadow-md'
                      : isDarkMode
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="h-4 w-4">{filter.icon}</span>
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Filters - Desktop Version */}
          <div className={`hidden md:block w-64 flex-shrink-0 border-r overflow-y-auto ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="p-4 space-y-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  !selectedType
                    ? isDarkMode
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-primary-500 text-white shadow-md'
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
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-primary-500 text-white shadow-md'
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
            <div className="p-4 md:p-6 space-y-4">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl ${getTypeBackground(note.type, isDarkMode)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <span className={getTypeIconColor(note.type, isDarkMode)}>
                        {getTypeIcon(note.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {note.content}
                      </p>
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
