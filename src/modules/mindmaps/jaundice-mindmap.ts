import { MindMapNode, MindMapEdge } from './types';

export const jaundiceMindMap = {
  interactive: true,
  title: 'Mind Map - Ictère (Jaunisse)',
  nodes: [
    // Nœud principal
    {
      id: '1',
      type: 'input',
      data: { 
        label: 'Ictère',
        content: 'Coloration jaune des téguments et des muqueuses due à l\'accumulation de bilirubine. Visible cliniquement quand la bilirubinémie > 50 μmol/L. Peut être un signe de pathologies sous-jacentes graves.'
      },
      position: { x: 400, y: 0 },
      style: {
        light: 'bg-yellow-100 border-2 border-yellow-500 font-bold',
        dark: 'bg-yellow-600 text-white font-bold'
      }
    },

    // Types d'ictère
    {
      id: '2',
      data: { 
        label: 'Types d\'ictère',
        content: '1. Ictère à bilirubine libre (pré-hépatique): causé par l\'hémolyse.\n2. Ictère à bilirubine conjuguée (hépatique): causé par des lésions hépatiques.\n3. Ictère mixte: combinaison des deux.\n4. Ictère post-hépatique (cholestase): obstruction des voies biliaires.'
      },
      position: { x: 100, y: 100 },
      style: {
        light: 'bg-blue-100 border-2 border-blue-400',
        dark: 'bg-blue-700 text-white'
      }
    },

    // Physiopathologie
    {
      id: '3',
      data: { 
        label: 'Physiopathologie',
        content: '• Métabolisme de la bilirubine: formation, conjugaison, et excrétion.\n• Hémolyse → ↑ bilirubine libre: causée par des maladies comme la drépanocytose.\n• Dysfonction hépatique → ↓ conjugaison: hépatites, cirrhose.\n• Obstruction biliaire → ↑ bilirubine conjuguée: calculs biliaires, tumeurs.'
      },
      position: { x: 700, y: 100 },
      style: {
        light: 'bg-emerald-100 border-2 border-emerald-400',
        dark: 'bg-emerald-700 text-white'
      }
    },

    // Signes cliniques
    {
      id: '4',
      data: { 
        label: 'Signes cliniques',
        content: '• Coloration jaune progressive des yeux et de la peau.\n• Urines foncées (ictère conjugué): due à l\'excrétion de bilirubine.\n• Selles décolorées (cholestase): absence de bilirubine dans les selles.\n• Prurit (cholestase): démangeaisons dues à l\'accumulation de sels biliaires.\n• Signes d\'hépatopathie associés: hépatomégalie, ascite.'
      },
      position: { x: 400, y: 250 },
      style: {
        light: 'bg-amber-100 border-2 border-amber-400',
        dark: 'bg-amber-700 text-white'
      }
    },

    // Diagnostic
    {
      id: '5',
      data: { 
        label: 'Diagnostic',
        content: '1. Bilan hépatique complet: transaminases, bilirubine totale et fractionnée.\n2. NFS, réticulocytes: pour évaluer l\'hémolyse.\n3. Échographie hépatobiliaire: pour visualiser les voies biliaires.\n4. Tests spécifiques selon orientation: sérologies virales, tests auto-immuns.'
      },
      position: { x: 100, y: 400 },
      style: {
        light: 'bg-purple-100 border-2 border-purple-400',
        dark: 'bg-purple-700 text-white'
      }
    },

    // Étiologies
    {
      id: '7',
      data: {
        label: 'Étiologies',
        content: '• Pré-hépatique: hémolyse, inefficacité érythropoïèse (ex: anémie hémolytique).\n• Hépatique: hépatites virales, cirrhose, médicaments.\n• Post-hépatique: lithiase biliaire, tumeur, sténose des voies biliaires.'
      },
      position: { x: 400, y: 400 },
      style: {
        light: 'bg-indigo-100 border-2 border-indigo-400',
        dark: 'bg-indigo-700 text-white'
      }
    },

    // Traitement
    {
      id: '6',
      data: { 
        label: 'Traitement',
        content: '• Traitement étiologique: traiter la cause sous-jacente.\n• Prise en charge spécifique selon cause: transfusions pour hémolyse, antiviraux pour hépatites.\n• Surveillance biologique: bilirubine, transaminases.\n• Prévention des complications: suivi régulier en cas de cirrhose.'
      },
      position: { x: 700, y: 400 },
      style: {
        light: 'bg-rose-100 border-2 border-rose-400',
        dark: 'bg-rose-700 text-white'
      }
    },

    // Complications
    {
      id: '8',
      data: {
        label: 'Complications',
        content: '• Encéphalopathie hépatique: troubles neurologiques dus à l\'insuffisance hépatique.\n• Hémorragies: due à une coagulopathie.\n• Insuffisance hépatique: défaillance du foie.\n• Complications de l\'hypertension portale: varices, ascite.'
      },
      position: { x: 400, y: 550 },
      style: {
        light: 'bg-red-100 border-2 border-red-400',
        dark: 'bg-red-700 text-white'
      }
    },

    // Sous-nœuds pour les types d'ictère
    {
      id: '2a',
      data: { 
        label: 'Ictère à bilirubine libre',
        content: 'Causé par l\'hémolyse. Exemples: drépanocytose, anémie hémolytique.\nTraitement: transfusions, corticostéroïdes selon la cause.'
      },
      position: { x: 100, y: 200 },
      style: {
        light: 'bg-blue-200 border-2 border-blue-500',
        dark: 'bg-blue-800 text-white'
      }
    },
    {
      id: '2b',
      data: { 
        label: 'Ictère à bilirubine conjuguée',
        content: 'Causé par des lésions hépatiques. Exemples: hépatites, cirrhose.\nTraitement: antiviraux, soins de support.'
      },
      position: { x: 100, y: 300 },
      style: {
        light: 'bg-blue-200 border-2 border-blue-500',
        dark: 'bg-blue-800 text-white'
      }
    },
    {
      id: '2c',
      data: { 
        label: 'Ictère mixte',
        content: 'Combinaison des deux types. Nécessite une évaluation approfondie.'
      },
      position: { x: 100, y: 400 },
      style: {
        light: 'bg-blue-200 border-2 border-blue-500',
        dark: 'bg-blue-800 text-white'
      }
    },
    {
      id: '2d',
      data: { 
        label: 'Ictère post-hépatique',
        content: 'Obstruction des voies biliaires. Exemples: lithiase biliaire, tumeurs.\nTraitement: intervention chirurgicale, endoscopie.'
      },
      position: { x: 100, y: 500 },
      style: {
        light: 'bg-blue-200 border-2 border-blue-500',
        dark: 'bg-blue-800 text-white'
      }
    }
  ],
  edges: [
    // Connexions principales
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      label: 'Classification des types',
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      animated: true,
      label: 'Mécanismes physiopathologiques',
      style: {
        light: '#10b981',
        dark: '#34d399'
      }
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      animated: true,
      label: 'Manifestations cliniques',
      style: {
        light: '#d97706',
        dark: '#fbbf24'
      }
    },

    // Connexions secondaires
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      label: 'Exploration diagnostique',
      style: {
        light: '#8b5cf6',
        dark: '#a78bfa'
      }
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      label: 'Causes possibles',
      style: {
        light: '#6366f1',
        dark: '#818cf8'
      }
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      label: 'Stratégies de traitement',
      style: {
        light: '#f43f5e',
        dark: '#fb7185'
      }
    },
    {
      id: 'e7-8',
      source: '7',
      target: '8',
      label: 'Conséquences',
      style: {
        light: '#ef4444',
        dark: '#f87171'
      }
    },

    // Connexions pour les sous-nœuds
    {
      id: 'e2-2a',
      source: '2',
      target: '2a',
      label: 'Exemple',
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    },
    {
      id: 'e2-2b',
      source: '2',
      target: '2b',
      label: 'Exemple',
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    },
    {
      id: 'e2-2c',
      source: '2',
      target: '2c',
      label: 'Exemple',
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    },
    {
      id: 'e2-2d',
      source: '2',
      target: '2d',
      label: 'Exemple',
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    }
  ]
};