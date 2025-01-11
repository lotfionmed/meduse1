import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashscreenProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

const Splashscreen: React.FC<SplashscreenProps> = ({ onComplete, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const letters = "MEDUSE".split("");

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(completeTimer);
    }, 4500); // Increased time to allow for letter animations

    return () => clearTimeout(hideTimer);
  }, [onComplete]);

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 1 + (i * 0.1),
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-primary-50 via-white to-primary-50'
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
              className="flex items-center justify-center mb-16 relative"
            >
              {/* Enhanced background glow effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className={`absolute w-40 h-40 rounded-full blur-2xl ${
                  isDarkMode ? 'bg-primary-500/20' : 'bg-primary-200/40'
                }`}
              />

              {/* Pulsating circle effect */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute w-32 h-32 rounded-full ${
                  isDarkMode 
                    ? 'bg-primary-400/30' 
                    : 'bg-primary-300/40'
                }`}
              />

              {/* Second pulsating circle with different timing */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.4, 0.8],
                  opacity: [0, 0.3, 0],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className={`absolute w-32 h-32 rounded-full ${
                  isDarkMode 
                    ? 'bg-primary-400/20' 
                    : 'bg-primary-300/30'
                }`}
              />
              
              {/* Enhanced logo animation */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
                className="relative w-28 h-28"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  className={`w-full h-full drop-shadow-xl ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12,2C7.58,2,4,5.58,4,10c0,4.42,3.58,8,8,8s8-3.58,8-8C20,5.58,16.42,2,12,2z"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12,4c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S14.21,4,12,4z"
                  />
                </motion.svg>
              </motion.div>

              {/* Floating particles/bubbles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.7, 0],
                    x: [0, (i % 2 ? 60 : -60) * Math.random()],
                    y: [0, -70 * Math.random()],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                  className={`absolute w-${Math.floor(Math.random() * 2) + 2} h-${Math.floor(Math.random() * 2) + 2} rounded-full 
                    ${isDarkMode 
                      ? 'bg-primary-400/60 blur-sm' 
                      : 'bg-primary-500/40 blur-sm'
                    }`}
                  style={{
                    left: '50%',
                    top: '50%',
                    filter: `blur(${Math.random() * 2}px)`,
                  }}
                />
              ))}

              {/* Additional decorative rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeInOut"
                  }}
                  className={`absolute rounded-full border-2 ${
                    isDarkMode 
                      ? 'border-primary-400/20' 
                      : 'border-primary-500/20'
                  }`}
                  style={{
                    width: `${120 + i * 40}px`,
                    height: `${120 + i * 40}px`,
                  }}
                />
              ))}
            </motion.div>

            {/* Letter by letter animation for MEDUSE */}
            <div className="flex justify-center mb-8 relative">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-7xl font-black mx-1 ${
                    isDarkMode 
                      ? 'text-primary-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                      : 'text-primary-600 drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  }`}
                  style={{
                    textShadow: isDarkMode 
                      ? '0 0 20px rgba(99,102,241,0.3)' 
                      : '0 0 20px rgba(79,70,229,0.2)'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              className={`text-xl font-medium tracking-wide mb-12 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Votre plateforme d'apprentissage médical
            </motion.p>

            {/* Enhanced loading bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 2.2 }}
              className="w-72 h-2 mx-auto overflow-hidden rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 shadow-lg"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-white/30 blur-sm"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splashscreen;