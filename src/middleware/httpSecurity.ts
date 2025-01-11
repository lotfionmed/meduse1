// Gestionnaire des en-têtes de sécurité HTTP
export const securityHeaders = {
  // Protection contre le clickjacking
  'X-Frame-Options': 'DENY',
  
  // Protection XSS
  'X-XSS-Protection': '1; mode=block',
  
  // Empêche le navigateur de MIME-sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Politique de sécurité du contenu
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://firestore.googleapis.com https://firebase.googleapis.com",
  ].join('; '),
  
  // Référer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (anciennement Feature-Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
  ].join(', '),
};

// Génération et validation de tokens CSRF
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly tokens = new Set<string>();

  // Génère un nouveau token CSRF
  static generateToken(): string {
    const array = new Uint8Array(this.TOKEN_LENGTH);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.tokens.add(token);
    return token;
  }

  // Valide un token CSRF
  static validateToken(token: string): boolean {
    if (this.tokens.has(token)) {
      this.tokens.delete(token); // Usage unique
      return true;
    }
    return false;
  }

  // Nettoie les vieux tokens (à appeler périodiquement)
  static cleanupTokens(): void {
    this.tokens.clear();
  }
}

// Rate Limiting
export class RateLimiter {
  private static readonly requests = new Map<string, number[]>();
  private static readonly WINDOW_MS = 60000; // 1 minute
  private static readonly MAX_REQUESTS = 100; // par fenêtre

  static checkLimit(ip: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(ip) || [];

    // Nettoyer les anciennes requêtes
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.WINDOW_MS
    );

    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false; // Limite atteinte
    }

    // Ajouter la nouvelle requête
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    return true;
  }

  // Nettoie les vieilles données
  static cleanup(): void {
    const now = Date.now();
    for (const [ip, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < this.WINDOW_MS
      );
      if (validTimestamps.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, validTimestamps);
      }
    }
  }
}

// Protection contre les attaques par énumération
export class EnumerationProtection {
  private static readonly attempts = new Map<string, number>();
  private static readonly RESET_AFTER_MS = 3600000; // 1 heure

  static checkAttempt(identifier: string): boolean {
    const now = Date.now();
    const lastAttempt = this.attempts.get(identifier) || 0;

    if (now - lastAttempt > this.RESET_AFTER_MS) {
      this.attempts.set(identifier, now);
      return true;
    }

    return false;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [identifier, timestamp] of this.attempts.entries()) {
      if (now - timestamp > this.RESET_AFTER_MS) {
        this.attempts.delete(identifier);
      }
    }
  }
}

// Validation d'URL
export const validateURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['https:', 'http:'];
    const allowedDomains = [
      'firestore.googleapis.com',
      'firebase.googleapis.com',
      // Ajoutez d'autres domaines autorisés
    ];

    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }

    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
