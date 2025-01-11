import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClinicalSplashscreenProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

const ClinicalSplashscreen: React.FC<ClinicalSplashscreenProps> = ({ onComplete, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(completeTimer);
    }, 3500);

    return () => clearTimeout(hideTimer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50'
          }`}
        >
          <div className="text-center relative">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2
              }}
              className="flex items-center justify-center mb-12 relative"
            >
              {/* Cercle lumineux d'arrière-plan */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className={`absolute w-32 h-32 rounded-full ${
                  isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-200/40'
                }`}
              />
              
              {/* Logo principal */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
                className="relative w-24 h-24"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  className={`w-full h-full ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
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

              {/* Particules flottantes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (i % 2 ? 50 : -50) * Math.random()],
                    y: [0, -50 * Math.random()],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
                  }`}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`text-6xl font-bold mb-8 bg-clip-text text-transparent ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300' 
                  : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600'
              }`}
            >
              MEDUSE CLINIC
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className={`text-xl mb-12 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Cas cliniques et situations pratiques
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="w-64 h-1.5 mx-auto overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-white opacity-30"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClinicalSplashscreen;