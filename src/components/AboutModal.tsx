import React from 'react';
import { X, BookOpen, Users, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className={`relative w-full max-w-2xl rounded-xl shadow-2xl ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
              } p-6 overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                    }}
                    className="relative w-8 h-8"
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      className={`w-full h-full ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M12,2C7.58,2,4,5.58,4,10c0,4.42,3.58,8,8,8s8-3.58,8-8C20,5.58,16.42,2,12,2z"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M12,4c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S14.21,4,12,4z"
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.h2 
                    className="text-2xl font-bold"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    À Propos de MEDUSE
                  </motion.h2>
                </motion.div>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <motion.section
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    La Plateforme
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    MEDUSE est une plateforme éducative moderne dédiée à l'apprentissage de la médecine. 
                    Notre objectif est de fournir un contenu médical structuré et accessible à tous les étudiants 
                    en médecine et professionnels de santé.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Notre Contenu
                  </h3>
                  <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Actuellement, MEDUSE propose :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        8 modules spécialisés
                      </motion.li>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        24 cours détaillés
                      </motion.li>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        Contenus audio et textuels
                      </motion.li>
                      <motion.li
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        Mises à jour régulières
                      </motion.li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Globe2 className="h-5 w-5" />
                    Contact
                  </h3>
                  <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Pour toute question ou suggestion :</p>
                    <div className="space-y-2 pl-5">
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        <span className="font-medium">Email :</span>
                        <a 
                          href="mailto:contact@meduse.edu"
                          className={`hover:underline ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}
                        >
                          contact@meduse.edu
                        </a>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <span className="font-medium">Support :</span>
                        <a 
                          href="https://support.meduse.edu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`hover:underline ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}
                        >
                          support.meduse.edu
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </motion.section>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;