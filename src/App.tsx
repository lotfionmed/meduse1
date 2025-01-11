import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, UserCircle, Sun, Moon } from 'lucide-react';
import Sidebar from '@components/Sidebar';
import CourseContent from '@components/CourseContent';
import ModuleList from '@components/ModuleList';
import ChapterList from '@components/ChapterList';
import CourseList from '@components/CourseList';
import Splashscreen from '@components/Splashscreen';
import ClinicalSplashscreen from '@components/ClinicalSplashscreen';
import AboutModal from '@components/AboutModal';
import AuthModal from '@components/AuthModal';
import ProfileModal from '@components/ProfileModal';

import { useModules } from '@modules/index';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showSplashscreen, setShowSplashscreen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [isClinicalMode, setIsClinicalMode] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { modules } = useModules();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleUpdateSelection = (event: CustomEvent) => {
      const { moduleId, chapterId, courseId } = event.detail;
      setSelectedModule(moduleId);
      setSelectedChapter(chapterId);
      setSelectedCourse(courseId);
      setShowAudio(false);
      if (isMobile) setSidebarOpen(false);
    };

    window.addEventListener('updateSelection', handleUpdateSelection as EventListener);

    return () => {
      window.removeEventListener('updateSelection', handleUpdateSelection as EventListener);
    };
  }, [isMobile]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleModuleSelect = useCallback((moduleId: string, chapterId?: string, courseId?: string) => {
    console.log('Module selected:', moduleId, 'Chapter:', chapterId, 'Course:', courseId);
    const selectedModule = modules.find(m => m.id === moduleId);
    
    if (!selectedModule) {
      console.error(`Module with ID ${moduleId} not found`);
      return;
    }

    setSelectedModule(moduleId);

    if (chapterId) {
      const chapter = selectedModule.chapters.find(c => c.id === chapterId);
      if (chapter) {
        setSelectedChapter(chapterId);
        if (courseId) {
          const course = chapter.courses.find(c => c.id === courseId);
          if (course) {
            setSelectedCourse(courseId);
          }
        }
      }
    } else {
      setSelectedChapter(null);
      setSelectedCourse(null);
    }
    
    setShowAudio(false);
  }, [modules]);

  const handleChapterSelect = useCallback((chapterId: string, courseId?: string) => {
    setSelectedChapter(chapterId);
    if (courseId) {
      setSelectedCourse(courseId);
    } else {
      setSelectedCourse(null);
    }
    setShowAudio(false);
  }, []);

  const handleCourseSelect = useCallback((courseId: string) => {
    setSelectedCourse(courseId);
    setShowAudio(false);
  }, []);

  const goHome = () => {
    setSelectedModule(null);
    setSelectedChapter(null);
    setSelectedCourse(null);
    setShowAudio(false);
  };

  const getCurrentModule = () => {
    return selectedModule ? modules.find(m => m.id === selectedModule) : null;
  };

  const getCurrentChapter = () => {
    const module = getCurrentModule();
    return module && selectedChapter 
      ? module.chapters.find(c => c.id === selectedChapter)
      : null;
  };

  const toggleClinicalMode = () => {
    setIsClinicalMode(!isClinicalMode);
    setShowSplashscreen(true);
    goHome();
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (showSplashscreen) {
    return isClinicalMode ? (
      <ClinicalSplashscreen onComplete={() => setShowSplashscreen(false)} isDarkMode={isDarkMode} />
    ) : (
      <Splashscreen onComplete={() => setShowSplashscreen(false)} isDarkMode={isDarkMode} />
    );
  }

  const renderContent = () => {
    const currentModule = getCurrentModule();
    const currentChapter = getCurrentChapter();

    if (selectedCourse && currentModule && currentChapter) {
      return (
        <CourseContent
          modules={modules}
          selectedModule={selectedModule}
          selectedChapter={selectedChapter}
          selectedCourse={selectedCourse}
          isDarkMode={isDarkMode}
          onModuleSelect={(moduleId, chapterId, courseId) => handleModuleSelect(moduleId, chapterId, courseId)}
          onChapterSelect={(chapterId, courseId) => handleChapterSelect(chapterId, courseId)}
          onCourseSelect={handleCourseSelect}
          showAudio={showAudio}
          setShowAudio={setShowAudio}
          isClinicalMode={isClinicalMode}
        />
      );
    }

    if (selectedChapter && currentModule) {
      return (
        <CourseList
          module={currentModule}
          chapter={currentChapter!}
          isDarkMode={isDarkMode}
          onCourseSelect={(courseId) => handleCourseSelect(courseId)}
          onBack={() => setSelectedChapter(null)}
          isClinicalMode={isClinicalMode}
        />
      );
    }

    if (selectedModule && currentModule) {
      return (
        <ChapterList
          module={currentModule}
          isDarkMode={isDarkMode}
          onChapterSelect={(chapterId) => handleChapterSelect(chapterId)}
          onBack={() => setSelectedModule(null)}
          isClinicalMode={isClinicalMode}
        />
      );
    }

    return (
      <ModuleList
        modules={modules}
        isDarkMode={isDarkMode}
        onModuleSelect={(moduleId) => handleModuleSelect(moduleId)}
        isClinicalMode={isClinicalMode}
      />
    );
  };

  return (
    <div className={`h-screen flex ${isDarkMode ? 'dark bg-gray-900' : isClinicalMode ? 'bg-emerald-50' : 'bg-primary-50'}`}>
      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`h-16 ${
            isDarkMode 
              ? 'bg-gray-800 border-b border-gray-700' 
              : isClinicalMode 
                ? 'bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100' 
                : 'bg-gradient-to-r from-primary-50 to-white border-b border-primary-100'
          } shadow-lg flex items-center justify-between px-6 sticky top-0 z-30`}
        >
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative w-10 h-10">
                <motion.svg
                  viewBox="0 0 24 24"
                  className={`w-full h-full transform group-hover:rotate-180 transition-transform duration-500 ${
                    isDarkMode 
                      ? isClinicalMode ? 'text-emerald-400' : 'text-primary-400'
                      : isClinicalMode ? 'text-emerald-600' : 'text-primary-600'
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <path fill="currentColor" d="M12,2C7.58,2,4,5.58,4,10c0,4.42,3.58,8,8,8s8-3.58,8-8C20,5.58,16.42,2,12,2z" />
                  <path fill="currentColor" d="M12,4c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S14.21,4,12,4z" />
                </motion.svg>
              </div>
              <motion.span
                className={`ml-3 text-xl font-extrabold hidden sm:inline ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } tracking-wide`}
              >
                {isClinicalMode ? 'MEDUSE CLINIC' : 'MEDUSE'}
              </motion.span>
            </motion.div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedModule(null)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : isClinicalMode
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                Accueil
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAboutOpen(true)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : isClinicalMode
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                À propos
              </motion.button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleClinicalMode}
              className={`hidden items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : isClinicalMode
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {isClinicalMode ? 'Mode Standard' : 'Mode Clinique'}
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => user ? setShowUserMenu(!showUserMenu) : setIsAuthOpen(true)}
                className={`p-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                  isDarkMode 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : isClinicalMode
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-primary-600 hover:bg-primary-50'
                }`}
              >
                <UserCircle className="h-6 w-6" />
                {user && (
                  <span className="hidden sm:inline font-medium">
                    {user.displayName || 'Utilisateur'}
                  </span>
                )}
              </motion.button>

              {showUserMenu && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl ${
                    isDarkMode 
                      ? 'bg-gray-800 ring-1 ring-gray-700' 
                      : 'bg-white ring-1 ring-black ring-opacity-5'
                  }`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setShowUserMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        signOut(auth);
                        setShowUserMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Déconnexion
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Menu Toggle for Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : isClinicalMode
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 overflow-auto p-4 md:p-6 ${isSidebarOpen ? 'mr-0 md:mr-64' : 'mr-0'}`}
        >
          {renderContent()}
        </motion.main>
      </div>

      {/* Overlay pour la version mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Barre latérale */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={`fixed top-0 right-0 h-full z-50 ${isMobile ? 'w-64' : 'w-64'}`}
          >
            <Sidebar
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              brightness={brightness}
              setBrightness={setBrightness}
              onAboutClick={() => setIsAboutOpen(true)}
              onClose={() => setSidebarOpen(false)}
              isClinicalMode={isClinicalMode}
              toggleClinicalMode={toggleClinicalMode}
              modules={modules}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        isDarkMode={isDarkMode}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        isDarkMode={isDarkMode}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isDarkMode={isDarkMode}
      />

    </div>
  );
};

export default App;