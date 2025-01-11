import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Layers } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  imageUrl: string;
  imageTitle: string;
  imageDescription: string;
  images?: Array<{
    url: string;
    title: string;
    description: string;
    structures?: Array<{
      name: string;
      description: string;
    }>;
  }>;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  imageUrl,
  imageTitle,
  imageDescription,
  images = []
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showStructures, setShowStructures] = useState(false);

  if (!isOpen) return null;

  const currentImage = images.length > 0 ? images[currentImageIndex] : { url: imageUrl, title: imageTitle, description: imageDescription };

  const paginate = (newDirection: number) => {
    if (images.length > 0) {
      setPage([page + newDirection, newDirection]);
      setCurrentImageIndex((prev) => (prev + newDirection + images.length) % images.length);
      setScale(1);
      setRotation(0);
      setIsImageLoaded(false);
      setShowStructures(false);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-3xl rounded-xl shadow-2xl p-4 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <motion.h2 
              key={currentImage.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold"
            >
              {currentImage.title}
            </motion.h2>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomIn}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ZoomIn className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomOut}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ZoomOut className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRotate}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <RotateCw className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full h-[400px] group overflow-hidden rounded-lg bg-black/10">
            {/* Loading Spinner */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 1000 : -1000, opacity: 0 }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  cursor: 'grab'
                }}
              >
                <motion.div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    opacity: isImageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <motion.img
                    src={currentImage.url}
                    alt={currentImage.title}
                    onLoad={() => setIsImageLoaded(true)}
                    drag
                    dragConstraints={{
                      top: -50,
                      left: -50,
                      right: 50,
                      bottom: 50
                    }}
                    dragElastic={0.1}
                    style={{
                      scale,
                      rotate: rotation,
                    }}
                    className="rounded-lg shadow-lg transition-transform duration-300 max-w-full max-h-full w-auto h-auto object-contain"
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description and Structures */}
          <motion.div
            key={currentImage.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <div className="flex items-start justify-between gap-4">
              <p className={`text-xs flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentImage.description}
              </p>
              {currentImage.structures && currentImage.structures.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStructures(!showStructures)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? showStructures
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                      : showStructures
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Structures</span>
                </motion.button>
              )}
            </div>

            {/* Structures List */}
            <AnimatePresence>
              {showStructures && currentImage.structures && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className="font-semibold mb-2">Structures anatomiques</h3>
                    <div className="space-y-2">
                      {currentImage.structures.map((structure, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{structure.name}:</span>
                          <span className={`ml-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {structure.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1 mt-3 overflow-x-auto py-1">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const direction = index > currentImageIndex ? 1 : -1;
                    setPage([index, direction]);
                    setCurrentImageIndex(index);
                    setScale(1);
                    setRotation(0);
                    setIsImageLoaded(false);
                    setShowStructures(false);
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                    index === currentImageIndex
                      ? 'ring-2 ring-offset-1 ' + (isDarkMode ? 'ring-white' : 'ring-gray-900')
                      : ''
                  }`}
                >
                  <div className="w-full h-full bg-black/10">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageModal;