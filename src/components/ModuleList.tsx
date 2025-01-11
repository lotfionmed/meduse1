import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Module } from '../types';
import SearchBar from './SearchBar';
import { Filter, BookOpen, Users, AlertTriangle, ChevronRight } from 'lucide-react';

interface ModuleListProps {
  modules: Module[];
  isDarkMode: boolean;
  onModuleSelect: (moduleId: string) => void;
  isClinicalMode?: boolean;
}

const ModuleList: React.FC<ModuleListProps> = ({ 
  modules, 
  isDarkMode, 
  onModuleSelect,
  isClinicalMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fundamental' | 'systems'>('all');
  const [moduleErrors, setModuleErrors] = useState<{[key: string]: boolean}>({});
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const handleCourseSelect = (moduleId: string, chapterId: string, courseId: string) => {
    const event = new CustomEvent('updateSelection', {
      detail: { moduleId, chapterId, courseId }
    });
    window.dispatchEvent(event);
  };

  const handleImageError = (moduleId: string) => {
    console.warn(`Failed to load icon for module: ${moduleId}`);
    setModuleErrors(prev => ({
      ...prev,
      [moduleId]: true
    }));
  };

  useEffect(() => {
    setModuleErrors({});
  }, [modules]);

  const fundamentalModules = [
    'anatomy', 'biochem', 'onco', 'biophys', 'cyto', 
    'embryo', 'physio', 'histo', 'genetics', 'microbio', 'parasito'
  ];
  
  const systemModules = [
    'gastro', 'cardio', 'infectious', 'hemato', 'pulmo', 'neuro',
    'locomotor', 'immuno', 'reproductive', 'urinary'
  ];

  const filteredModules = modules.filter(module => {
    if (isClinicalMode) {
      return systemModules.includes(module.id);
    }

    if (selectedCategory === 'fundamental') {
      return fundamentalModules.includes(module.id);
    } else if (selectedCategory === 'systems') {
      return systemModules.includes(module.id);
    }
    return true;
  });

  // Animation variants pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className={`text-4xl font-bold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {isClinicalMode ? 'Cas Cliniques par Système' : 'Explorez nos modules d\'apprentissage'}
        </h1>
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {isClinicalMode 
            ? 'Développez votre raisonnement clinique à travers des cas pratiques'
            : 'Découvrez notre collection complète de modules médicaux interactifs'}
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            isDarkMode={isDarkMode}
            modules={modules}
            onCourseSelect={handleCourseSelect}
            isClinicalMode={isClinicalMode}
          />

          {/* Filtres cachés */}
          <div className="hidden">
            <div className="flex items-center justify-center gap-4">
              <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'fundamental', label: 'Modules fondamentaux' },
                  { id: 'systems', label: 'Systèmes' }
                ].map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id as 'all' | 'fundamental' | 'systems')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? isDarkMode
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredModules.map((module, index) => (
          <motion.div
            key={module.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onHoverStart={() => setHoveredModule(module.id)}
            onHoverEnd={() => setHoveredModule(null)}
            onClick={() => onModuleSelect(module.id)}
            className={`relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl hover:shadow-primary-500/20' 
                : 'bg-white hover:shadow-xl hover:shadow-primary-500/20'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {moduleErrors[module.id] ? (
                  <AlertTriangle className={`h-10 w-10 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                ) : (
                  <img 
                    src={module.icon} 
                    alt={`${module.title} icon`}
                    onError={() => handleImageError(module.id)}
                    className="h-10 w-10 object-contain"
                  />
                )}
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {module.title}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className={`h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {module.chapters.length} chapitres
                  </span>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  fundamentalModules.includes(module.id)
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-blue-100 text-blue-800'
                    : isDarkMode
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {fundamentalModules.includes(module.id) ? 'Module fondamental' : 'Système'}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: hoveredModule === module.id ? 1 : 0,
                  x: hoveredModule === module.id ? 0 : -20
                }}
                className={`absolute bottom-6 right-6 p-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-primary-500/20 text-primary-300' 
                    : 'bg-primary-100 text-primary-600'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;