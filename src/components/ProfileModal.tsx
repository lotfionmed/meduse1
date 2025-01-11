import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, GraduationCap } from 'lucide-react';
import { auth } from '../firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const user = auth.currentUser;
  const userInfo = user?.photoURL ? JSON.parse(user.photoURL) : {};

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md rounded-xl shadow-2xl p-6 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profil</h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-full ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white'
                    }`}>
                      <User className={`h-6 w-6 ${
                        isDarkMode ? 'text-primary-400' : 'text-primary-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.displayName}</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Étudiant en médecine</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className={`h-5 w-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <GraduationCap className={`h-5 w-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span>{userInfo.studyYear || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;