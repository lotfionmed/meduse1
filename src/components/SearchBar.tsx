import React, { useState, useRef, useEffect } from 'react';
import { Search, Image, Key } from 'lucide-react';
import ImageSearchResults from './ImageSearchResults';
import KeywordSearchResults from './KeywordSearchResults';

interface Course {
  id: string;
  title: string;
  content?: {
    definition?: string;
    images?: Array<{
      url: string;
      title: string;
      description: string;
      structures?: Array<{
        name: string;
        description: string;
      }>;
    }>;
    normalMode?: {
      keywords?: Array<{
        term: string;
        definition: string;
      }>;
    };
  };
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  modules: any[];
  onCourseSelect: (moduleId: string, chapterId: string, courseId: string) => void;
  isClinicalMode?: boolean;
}

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

interface KeywordResult {
  term: string;
  definition: string;
  moduleTitle: string;
  courseTitle: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  isDarkMode, 
  modules, 
  onCourseSelect,
  isClinicalMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{
    moduleId: string,
    chapterId: string,
    course: Course
  }>>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);
  const [showImageResults, setShowImageResults] = useState(false);
  const [showKeywordResults, setShowKeywordResults] = useState(false);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [keywordResults, setKeywordResults] = useState<KeywordResult[]>([]);
  const [imageSearchValue, setImageSearchValue] = useState('');
  const [keywordSearchValue, setKeywordSearchValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const systemModules = [
    'gastro', 'cardio', 'infectious', 'hemato', 'pulmo', 'neuro',
    'locomotor', 'immuno', 'reproductive', 'urinary'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour obtenir 3 images aléatoires
  const getRandomImages = () => {
    const allImages: ImageResult[] = [];
    
    modules.forEach(module => {
      if (isClinicalMode && !systemModules.includes(module.id)) {
        return;
      }

      module.chapters.forEach(chapter => {
        chapter.courses.forEach(course => {
          if (course.content?.images) {
            course.content.images.forEach(image => {
              allImages.push({
                url: image.url,
                title: image.title,
                description: image.description,
                moduleTitle: module.title,
                courseTitle: course.title,
                structures: image.structures
              });
            });
          }
        });
      });
    });

    return allImages
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  // Fonction pour obtenir 3 mots-clés aléatoires
  const getRandomKeywords = () => {
    const allKeywords: KeywordResult[] = [];
    
    modules.forEach(module => {
      if (isClinicalMode && !systemModules.includes(module.id)) {
        return;
      }

      module.chapters.forEach(chapter => {
        chapter.courses.forEach(course => {
          if (course.content?.normalMode?.keywords) {
            course.content.normalMode.keywords.forEach(keyword => {
              allKeywords.push({
                term: keyword.term,
                definition: keyword.definition,
                moduleTitle: module.title,
                courseTitle: course.title
              });
            });
          }
        });
      });
    });

    return allKeywords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  // Initialiser les images au chargement de la recherche d'images
  useEffect(() => {
    if (isImageSearch) {
      setImageResults(getRandomImages());
      setShowImageResults(true);
    }
  }, [isImageSearch]);

  // Initialiser les mots-clés au chargement de la recherche de mots-clés
  useEffect(() => {
    if (isKeywordSearch) {
      setKeywordResults(getRandomKeywords());
      setShowKeywordResults(true);
    }
  }, [isKeywordSearch]);

  const searchImages = (searchTerm: string) => {
    const results: ImageResult[] = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    // Si la recherche est vide, afficher 3 suggestions aléatoires
    if (!searchTermLower.trim()) {
      setImageResults(getRandomImages());
      return;
    }
    
    modules.forEach(module => {
      if (isClinicalMode && !systemModules.includes(module.id)) {
        return;
      }

      module.chapters.forEach(chapter => {
        chapter.courses.forEach(course => {
          if (course.content?.images) {
            course.content.images.forEach(image => {
              const matchesTitle = image.title.toLowerCase().includes(searchTermLower);
              const matchesDescription = image.description.toLowerCase().includes(searchTermLower);
              const matchesStructures = image.structures?.some(structure => 
                structure.name.toLowerCase().includes(searchTermLower) ||
                structure.description.toLowerCase().includes(searchTermLower)
              );

              if (matchesTitle || matchesDescription || matchesStructures) {
                results.push({
                  url: image.url,
                  title: image.title,
                  description: image.description,
                  moduleTitle: module.title,
                  courseTitle: course.title,
                  structures: image.structures
                });
              }
            });
          }
        });
      });
    });

    // Limiter à 5 résultats pendant la recherche
    setImageResults(results.slice(0, 5));
  };

  const searchKeywords = (searchTerm: string) => {
    const results: KeywordResult[] = [];
    
    // Si la recherche est vide, afficher 3 suggestions aléatoires
    if (!searchTerm.trim()) {
      setKeywordResults(getRandomKeywords());
      return;
    }
    
    modules.forEach(module => {
      if (isClinicalMode && !systemModules.includes(module.id)) {
        return;
      }

      module.chapters.forEach(chapter => {
        chapter.courses.forEach(course => {
          if (course.content?.normalMode?.keywords) {
            course.content.normalMode.keywords.forEach(keyword => {
              if (
                keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                keyword.definition.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                results.push({
                  term: keyword.term,
                  definition: keyword.definition,
                  moduleTitle: module.title,
                  courseTitle: course.title
                });
              }
            });
          }
        });
      });
    });

    // Limiter à 5 résultats pendant la recherche
    setKeywordResults(results.slice(0, 5));
  };

  const handleInputChange = (searchTerm: string) => {
    if (isImageSearch) {
      setImageSearchValue(searchTerm);
      searchImages(searchTerm);
    } else if (isKeywordSearch) {
      setKeywordSearchValue(searchTerm);
      searchKeywords(searchTerm);
    } else {
      onChange(searchTerm);
      setFocusedIndex(-1);
      
      // Pour la recherche de cours, pas de suggestions si vide
      if (!searchTerm.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      
      if (searchTerm.length > 0) {
        const results: Array<{moduleId: string, chapterId: string, course: Course}> = [];
        
        modules.forEach(module => {
          if (isClinicalMode && !systemModules.includes(module.id)) {
            return;
          }

          module.chapters.forEach(chapter => {
            chapter.courses.forEach(course => {
              if (course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                  moduleId: module.id,
                  chapterId: chapter.id,
                  course
                });
              }
            });
          });
        });

        // Limiter à 5 suggestions pendant la recherche
        setSuggestions(results.slice(0, 5));
        setIsOpen(results.length > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }
  };

  const handleCourseSelect = (moduleId: string, chapterId: string, courseId: string) => {
    onCourseSelect(moduleId, chapterId, courseId);
    setIsOpen(false);
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[focusedIndex];
      handleCourseSelect(selected.moduleId, selected.chapterId, selected.course.id);
    }
  };

  const toggleImageSearch = () => {
    if (!isImageSearch) {
      setShowImageResults(true);
      setImageSearchValue('');
      searchImages('');
    } else {
      setShowImageResults(false);
    }
    setIsImageSearch(!isImageSearch);
    setIsKeywordSearch(false);
    onChange('');
    setIsOpen(false);
  };

  const toggleKeywordSearch = () => {
    if (!isKeywordSearch) {
      setShowKeywordResults(true);
      setKeywordSearchValue('');
      searchKeywords('');
    } else {
      setShowKeywordResults(false);
    }
    setIsKeywordSearch(!isKeywordSearch);
    setIsImageSearch(false);
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex gap-2">
        {!isImageSearch && !isKeywordSearch && (
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`block w-full pl-10 pr-3 py-2 border transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transform hover:scale-102`}
              placeholder="Rechercher un cours..."
            />
          </div>
        )}
        {!isClinicalMode && (
          <>
            <button
              onClick={toggleImageSearch}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? isImageSearch ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  : isImageSearch ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Image className="h-5 w-5" />
            </button>
            <button
              onClick={toggleKeywordSearch}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? isKeywordSearch ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'
                  : isKeywordSearch ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Key className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {isOpen && !isImageSearch && !isKeywordSearch && suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-md shadow-lg transition-all duration-300 transform ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <ul className="py-1">
            {suggestions.map(({ moduleId, chapterId, course }, index) => (
              <li key={course.id}>
                <button
                  onClick={() => handleCourseSelect(moduleId, chapterId, course.id)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`w-full text-left px-4 py-2 transition-all duration-300 ${
                    index === focusedIndex
                      ? isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDarkMode
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                  } transform hover:scale-102`}
                >
                  {course.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ImageSearchResults
        results={imageResults}
        isOpen={showImageResults}
        onClose={() => {
          setShowImageResults(false);
          setIsImageSearch(false);
        }}
        isDarkMode={isDarkMode}
        searchValue={imageSearchValue}
        onSearchChange={handleInputChange}
      />

      <KeywordSearchResults
        results={keywordResults}
        isOpen={showKeywordResults}
        onClose={() => {
          setShowKeywordResults(false);
          setIsKeywordSearch(false);
        }}
        isDarkMode={isDarkMode}
        searchValue={keywordSearchValue}
        onSearchChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;