export function generateNormalMode(courseId, courseTitle) {
  return {
    index: `import { questions } from './questions';
import { quiz } from './quiz';
import { references } from './references';
import { videos } from './videos';
import { keywords } from './keywords';

export const normalMode = {
  questions,
  quiz,
  references,
  videos,
  keywords
};`,

    questions: `export const questions = [
  {
    id: 1,
    question: "Quelle est la définition de ${courseTitle} ?",
    answer: \`La définition complète comprend :
- Point clé 1
- Point clé 2
- Point clé 3\`
  },
  {
    id: 2,
    question: "Quels sont les mécanismes physiopathologiques ?",
    answer: \`Les mécanismes principaux sont :
1. Mécanisme 1
2. Mécanisme 2
3. Mécanisme 3\`
  },
  {
    id: 3,
    question: "Quels sont les signes cliniques ?",
    answer: \`Les signes cliniques incluent :
- Signe 1
- Signe 2
- Signe 3\`
  },
  {
    id: 4,
    question: "Comment faire le diagnostic ?",
    answer: \`Le diagnostic repose sur :
1. Examen clinique
2. Examens complémentaires
3. Critères diagnostiques\`
  },
  {
    id: 5,
    question: "Quel est le traitement ?",
    answer: \`La prise en charge comprend :
1. Traitement médicamenteux
2. Traitement non médicamenteux
3. Suivi et surveillance\`
  }
];`,

    quiz: `export const quiz = {
  id: '${courseId}-quiz',
  title: 'Quiz - ${courseTitle}',
  questions: [
    {
      id: 1,
      text: "Question 1 sur ${courseTitle} ?",
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: 0,
      explanation: "Explication détaillée de la réponse A"
    },
    {
      id: 2,
      text: "Question 2 sur ${courseTitle} ?",
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: 1,
      explanation: "Explication détaillée de la réponse B"
    },
    {
      id: 3,
      text: "Question 3 sur ${courseTitle} ?",
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: 2,
      explanation: "Explication détaillée de la réponse C"
    }
  ]
};`,

    keywords: `interface Keyword {
  term: string;
  definition: string;
}

export const keywords: Keyword[] = [
  {
    term: 'Terme 1',
    definition: 'Définition détaillée du terme 1'
  },
  {
    term: 'Terme 2',
    definition: 'Définition détaillée du terme 2'
  },
  {
    term: 'Terme 3',
    definition: 'Définition détaillée du terme 3'
  },
  {
    term: 'Terme 4',
    definition: 'Définition détaillée du terme 4'
  },
  {
    term: 'Terme 5',
    definition: 'Définition détaillée du terme 5'
  }
];`,

    references: `export const references = [
  {
    title: "Référence 1",
    edition: "Dernière édition",
    pages: "Chapitre pertinent"
  },
  {
    title: "Référence 2",
    edition: "Dernière édition",
    pages: "Chapitre pertinent"
  },
  {
    title: "Référence 3",
    edition: "Dernière édition",
    pages: "Chapitre pertinent"
  }
];`,

    videos: `export const videos = [
  {
    title: "${courseTitle} - Partie 1",
    url: "https://youtu.be/example1"
  },
  {
    title: "${courseTitle} - Partie 2",
    url: "https://youtu.be/example2"
  },
  {
    title: "${courseTitle} - Partie 3",
    url: "https://youtu.be/example3"
  }
];`
  };
}