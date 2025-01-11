import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../firebase';

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: number;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000;
  private readonly analytics = getAnalytics(app);

  private constructor() {
    // Initialisation du moniteur
    this.startPeriodicCheck();
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  // Enregistre un événement de sécurité
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);

    // Garder seulement les derniers événements
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Envoyer à Firebase Analytics pour les événements critiques
    if (event.severity === 'critical' || event.severity === 'high') {
      logEvent(this.analytics, 'security_event', {
        event_type: event.type,
        severity: event.severity,
        ...event.details
      });
    }
  }

  // Analyse les patterns d'attaque
  private analyzePatterns(): void {
    const window = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    const recentEvents = this.events.filter(e => now - e.timestamp < window);

    // Détecter les attaques par force brute
    const loginAttempts = recentEvents.filter(e => e.type === 'failed_login');
    if (loginAttempts.length > 10) {
      this.logSecurityEvent({
        type: 'brute_force_detected',
        severity: 'high',
        details: {
          attempts: loginAttempts.length,
          timeWindow: window
        }
      });
    }

    // Détecter les tentatives d'injection
    const injectionAttempts = recentEvents.filter(e => 
      e.type === 'invalid_input' && e.details.reason === 'potential_injection'
    );
    if (injectionAttempts.length > 5) {
      this.logSecurityEvent({
        type: 'injection_attack_detected',
        severity: 'critical',
        details: {
          attempts: injectionAttempts.length,
          timeWindow: window
        }
      });
    }
  }

  // Vérification périodique des événements de sécurité
  private startPeriodicCheck(): void {
    setInterval(() => {
      this.analyzePatterns();
      this.cleanupOldEvents();
    }, 60000); // Vérification toutes les minutes
  }

  // Nettoie les anciens événements
  private cleanupOldEvents(): void {
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures
    const now = Date.now();
    this.events = this.events.filter(e => now - e.timestamp < maxAge);
  }

  // Obtenir les statistiques de sécurité
  getSecurityStats(): Record<string, any> {
    const now = Date.now();
    const last24h = this.events.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000);

    return {
      total_events: this.events.length,
      events_24h: last24h.length,
      critical_events: last24h.filter(e => e.severity === 'critical').length,
      high_severity_events: last24h.filter(e => e.severity === 'high').length,
      most_common_type: this.getMostCommonEventType(last24h)
    };
  }

  private getMostCommonEventType(events: SecurityEvent[]): string {
    const typeCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
