import { AES, enc } from 'crypto-js';

// Clé de chiffrement (à stocker dans les variables d'environnement)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

// Fonction de chiffrement des données sensibles
export const encryptData = (data: string): string => {
  try {
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Fonction de déchiffrement des données
export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Génération d'un token sécurisé
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hachage sécurisé des données sensibles
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validation de token
export const validateToken = (token: string): boolean => {
  // Vérification de la longueur minimale
  if (token.length < 32) return false;

  // Vérification du format hexadécimal
  const hexRegex = /^[0-9a-f]+$/i;
  if (!hexRegex.test(token)) return false;

  return true;
};

// Fonction pour comparer des chaînes de caractères de manière sécurisée
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};
