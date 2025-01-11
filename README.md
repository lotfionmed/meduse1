# Meduse - Plateforme d'Apprentissage Interactive

## À propos

Meduse est une plateforme d'apprentissage moderne et interactive développée avec React et TypeScript. Elle offre une expérience d'apprentissage immersive grâce à différents modules interactifs comme des quiz, des cartes mentales, des chronologies et des notes structurées. La plateforme est conçue pour rendre l'apprentissage plus engageant et efficace grâce à une interface utilisateur intuitive et des fonctionnalités interactives avancées.

## Objectifs du Projet

- Faciliter l'apprentissage par l'interaction
- Offrir une expérience utilisateur fluide et moderne
- Proposer différents modes d'apprentissage adaptés à chaque utilisateur
- Garantir une accessibilité optimale sur tous les appareils
- Permettre une progression personnalisée

## Fonctionnalités Principales

### 1. Quiz Interactif (`QuizModal`)
- **Navigation**
  - Barre de progression interactive
  - Navigation libre entre les questions
  - Indicateurs visuels de progression
  - Boutons "Précédent" et "Suivant"

- **Interface**
  - Mode plein écran optimisé
  - Adaptation responsive
  - Transitions fluides entre les questions
  - Mode sombre/clair

- **Fonctionnalités**
  - Validation des réponses en temps réel
  - Affichage des explications post-réponse
  - Système de score
  - Possibilité de recommencer le quiz

### 2. Cartes Mentales (`MindMapModal`)
- **Visualisation**
  - Rendu dynamique des connexions
  - Zoom et pan intuitifs
  - Mise en évidence des relations
  - Adaptation automatique à l'écran

- **Interaction**
  - Navigation fluide
  - Sélection des nœuds
  - Expansion/réduction des branches
  - Mode plein écran

- **Personnalisation**
  - Thèmes de couleurs
  - Styles de connexions
  - Tailles des nœuds adaptatives
  - Disposition automatique optimisée

### 3. Chronologie Interactive (`ChronologyModal`)
- **Navigation**
  - Barre de progression avec points interactifs
  - Tooltips informatifs sur les dates
  - Navigation tactile sur mobile
  - Défilement fluide

- **Présentation**
  - Transitions animées entre les événements
  - Affichage adaptatif des images
  - Mise en page responsive
  - Hauteur constante des slides

- **Fonctionnalités**
  - Indicateur de progression
  - Étiquettes d'événements
  - Support d'images haute qualité
  - Mode plein écran optimisé

### 4. Notes Structurées (`NoteModal`)
- **Organisation**
  - Catégorisation par type
    - Définitions
    - Concepts
    - Points importants
    - Résumés

- **Interface**
  - Filtrage dynamique par catégorie
  - Barre latérale de navigation
  - Design adaptatif mobile/desktop
  - Mode plein écran

- **Fonctionnalités**
  - Recherche instantanée
  - Tri automatique
  - Mise en évidence du contenu important
  - Support du markdown

## Technologies Utilisées

### Frontend
- **React 18+**
  - Hooks personnalisés
  - Context API
  - Composants fonctionnels
  - Gestion optimisée du state

- **TypeScript**
  - Types stricts
  - Interfaces définies
  - Meilleure maintenabilité
  - Autocomplétion IDE

- **Tailwind CSS**
  - Styles responsifs
  - Thèmes personnalisables
  - Utilities classes
  - Dark mode natif

- **Framer Motion**
  - Animations fluides
  - Transitions personnalisées
  - Gestes tactiles
  - Performance optimisée

- **Lucide Icons**
  - Icônes vectorielles
  - Personnalisation facile
  - Support du dark mode
  - Chargement optimisé

### Outils de Développement
- **Vite**
  - Build rapide
  - Hot Module Replacement
  - Optimisation de production
  - Support des modules ES

- **ESLint & Prettier**
  - Code formatté
  - Règles personnalisées
  - Integration IDE
  - Qualité de code

## Configuration Requise

### Environnement de Développement
- Node.js (v14+)
- npm (v6+) ou yarn (v1.22+)
- Git
- VS Code (recommandé)

### Extensions VS Code Recommandées
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- GitLens

## Installation

1. **Clonez le repository**
```bash
git clone [URL_DU_REPO]
cd meduse
```

2. **Installez les dépendances**
```bash
npm install
# ou avec yarn
yarn install
```

3. **Configuration environnement**
```bash
cp .env.example .env
# Configurez les variables d'environnement
```

4. **Lancez en développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Build production**
```bash
npm run build
# ou
yarn build
```

## Compatibilité Mobile

### Appareils Supportés
- **Smartphones**
  - iOS 12+
  - Android 7+
  - Tous navigateurs modernes

- **Tablettes**
  - iPad (iOS 12+)
  - Android tablets
  - Surface & Windows tablets

- **Desktop**
  - Windows 10/11
  - macOS 10.14+
  - Linux (distributions modernes)

### Fonctionnalités Responsives
- Adaptation automatique de la mise en page
- Gestes tactiles optimisés
- Performance optimisée mobile
- Chargement d'images adaptatif

## Personnalisation

### Thèmes
- **Mode Clair/Sombre**
  - Détection automatique système
  - Transition fluide
  - Couleurs personnalisables
  - Contraste optimisé

- **Variables Tailwind**
  - Couleurs principales
  - Espacement
  - Typographie
  - Bordures et ombres

### Composants
Tous les composants acceptent des props de personnalisation :

- **QuizModal**
```typescript
interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  questions: Question[];
  onComplete?: (score: number) => void;
}
```

- **MindMapModal**
```typescript
interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  mindMap: MindMap;
  onNodeClick?: (node: Node) => void;
}
```

- **ChronologyModal**
```typescript
interface ChronologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  events: TimelineEvent[];
  title: string;
}
```

- **NoteModal**
```typescript
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  notes: Note[];
}
```

## Structure du Projet

```
src/
├── components/
│   ├── Modals/
│   │   ├── QuizModal.tsx
│   │   ├── MindMapModal.tsx
│   │   ├── ChronologyModal.tsx
│   │   └── NoteModal.tsx
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── ...
├── hooks/
│   ├── useTheme.ts
│   ├── useModal.ts
│   └── ...
├── modules/
│   ├── quiz/
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── mindmaps/
│   ├── chronology/
│   └── notes/
├── styles/
│   ├── tailwind.css
│   └── animations.css
├── utils/
│   ├── animations.ts
│   ├── formatting.ts
│   └── validation.ts
└── types/
    ├── quiz.ts
    ├── mindmap.ts
    └── ...
```

## Performance

### Optimisations
- Code splitting automatique
- Lazy loading des composants
- Optimisation des images
- Mise en cache intelligente

### Métriques
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Lighthouse Score > 90

## Sécurité

- Protection XSS
- Sanitization des entrées
- Validation des données
- Gestion sécurisée du state

## Contribution

### Process
1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines
- Tests requis pour les nouvelles fonctionnalités
- Documentation à jour
- Code formatté
- Commits conventionnels

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support & Contact

- **Issues GitHub**: Pour les bugs et suggestions
- **Discussions**: Pour les questions générales
- **Email**: support@meduse-learning.com

## Documentation Additionnelle

- [Guide de Contribution](CONTRIBUTING.md)
- [Guide de Style](STYLE_GUIDE.md)
- [Notes de Version](CHANGELOG.md)
- [FAQ](FAQ.md)

---

Développé avec ❤️ pour une expérience d'apprentissage optimale
