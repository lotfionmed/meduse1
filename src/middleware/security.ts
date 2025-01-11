import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Types pour la gestion des sessions
interface SessionData {
  lastActivity: number;
  loginAttempts: number;
  isBlocked: boolean;
}

// Gestionnaire de session en mémoire
const sessions = new Map<string, SessionData>();

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PASSWORD_MIN_LENGTH: 12,
  REQUIRE_SPECIAL_CHARS: true,
};

// Middleware de validation des entrées
export const validateInput = (input: string): boolean => {
  // Protection contre XSS
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (xssPattern.test(input)) {
    return false;
  }

  // Protection contre les injections SQL
  const sqlPattern = /(\b(select|insert|update|delete|drop|union|exec|declare)\b)/gi;
  if (sqlPattern.test(input)) {
    return false;
  }

  return true;
};

// Gestionnaire de tentatives de connexion
export const handleLoginAttempt = (userId: string): boolean => {
  const session = sessions.get(userId) || {
    lastActivity: Date.now(),
    loginAttempts: 0,
    isBlocked: false,
  };

  if (session.isBlocked) {
    const blockTimeElapsed = Date.now() - session.lastActivity;
    if (blockTimeElapsed < SECURITY_CONFIG.BLOCK_DURATION) {
      return false;
    }
    session.isBlocked = false;
    session.loginAttempts = 0;
  }

  session.loginAttempts += 1;
  session.lastActivity = Date.now();

  if (session.loginAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    session.isBlocked = true;
  }

  sessions.set(userId, session);
  return !session.isBlocked;
};

// Validation du mot de passe
export const validatePassword = (password: string): boolean => {
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return false;
  }

  if (SECURITY_CONFIG.REQUIRE_SPECIAL_CHARS) {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChars.test(password)) {
      return false;
    }
  }

  // Vérifier la complexité du mot de passe
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers;
};

// Middleware de session
export const sessionMiddleware = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const session = sessions.get(user.uid);
      if (session) {
        const timeElapsed = Date.now() - session.lastActivity;
        if (timeElapsed > SECURITY_CONFIG.SESSION_TIMEOUT) {
          // Session expirée, déconnexion de l'utilisateur
          auth.signOut();
          sessions.delete(user.uid);
        } else {
          // Mise à jour du timestamp d'activité
          session.lastActivity = Date.now();
          sessions.set(user.uid, session);
        }
      }
    }
  });
};

// Fonction de nettoyage des entrées
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Fonction de validation des fichiers
export const validateFile = (file: File): boolean => {
  // Liste des extensions autorisées
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
  
  // Taille maximale (5MB)
  const maxSize = 5 * 1024 * 1024;

  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
};

// Gestionnaire d'erreurs de sécurité
export const handleSecurityError = (error: Error): void => {
  // Log de l'erreur de sécurité
  console.error('Security Error:', {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
  });

  // Ici, vous pourriez implémenter une notification à un service de monitoring
  // ou envoyer une alerte aux administrateurs
};
