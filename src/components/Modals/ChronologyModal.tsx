import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Clock, Image as ImageIcon } from 'lucide-react';

interface TimelineEvent {
  time: string;
  event: string;
  description: string;
  image?: string; // URL de l'image optionnelle
}

interface ChronologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  events: TimelineEvent[];
  title: string;
}

const ChronologyModal: React.FC<ChronologyModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  events,
  title
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [direction, setDirection] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (activeStep < events.length - 1) {
      setDirection(1);
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setDirection(-1);
      setActiveStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setDirection(index > activeStep ? 1 : -1);
    setActiveStep(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className={`fixed inset-0 w-full h-full flex flex-col ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h2 className="text-xl md:text-2xl font-bold pr-8">{title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-black'
            }`}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {/* Progress Bar - Scrollable on mobile */}
            <div className="relative flex flex-col space-y-2 mb-6">
              {/* Progress Line */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-4 scrollbar-hide">
                {events.map((event, index) => (
                  <div key={index} className="flex-shrink-0 flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(index)}
                      className="group relative flex flex-col items-center"
                    >
                      {/* Time Tooltip */}
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-200' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {event.time}
                      </div>
                      
                      {/* Progress Point */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === activeStep
                          ? isDarkMode
                            ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                            : 'bg-yellow-600 shadow-lg shadow-yellow-600/50'
                          : index < activeStep
                          ? isDarkMode
                            ? 'bg-yellow-500/50'
                            : 'bg-yellow-600/50'
                          : isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                      }`}>
                        {index === activeStep ? (
                          <Clock className="w-4 h-4 text-white animate-pulse" />
                        ) : index < activeStep ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                        )}
                      </div>

                      {/* Connection Line */}
                      {index < events.length - 1 && (
                        <div className={`absolute top-1/2 left-[calc(100%-1px)] w-[calc(2rem+0.5rem)] h-0.5 -translate-y-1/2 ${
                          index < activeStep
                            ? isDarkMode
                              ? 'bg-yellow-500/50'
                              : 'bg-yellow-600/50'
                            : isDarkMode
                            ? 'bg-gray-700'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </button>

                    {/* Event Label */}
                    <span className={`mt-2 text-xs text-center max-w-[100px] truncate ${
                      index === activeStep
                        ? isDarkMode
                          ? 'text-yellow-400'
                          : 'text-yellow-600'
                        : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      {event.event}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile Indicator */}
              <div className="md:hidden flex justify-center items-center text-xs text-gray-500">
                <span>{activeStep + 1}</span>
                <span className="mx-1">/</span>
                <span>{events.length}</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[400px] md:min-h-[500px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full"
                >
                  <div className={`h-full p-4 md:p-6 rounded-xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="flex flex-col h-full">
                      {/* Time */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${
                          isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                        }`}
                      >
                        {events[activeStep].time}
                      </motion.div>

                      {/* Event Title */}
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl font-semibold mb-3 md:mb-4"
                      >
                        {events[activeStep].event}
                      </motion.h3>

                      {/* Content Container */}
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1">
                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: showDescription ? 1 : 0.7, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className={`flex-1 text-sm md:text-base ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {events[activeStep].description}
                        </motion.div>

                        {/* Image Section */}
                        {events[activeStep].image && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full md:w-1/2 h-[200px] md:h-[300px] flex-shrink-0"
                          >
                            <div className="relative h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <img
                                src={events[activeStep].image}
                                alt={events[activeStep].event}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4 md:mt-6">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeStep === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden md:inline">Précédent</span>
              </button>
              <button
                onClick={handleNext}
                disabled={activeStep === events.length - 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeStep === events.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="hidden md:inline">Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChronologyModal;
