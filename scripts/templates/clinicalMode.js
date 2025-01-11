export function generateClinicalMode(courseId, courseTitle) {
  return {
    index: `import { cases } from './cases';
import { clinicalQuiz } from './clinical-quiz';

export const clinicalMode = {
  cases,
  clinicalQuiz
};`,

    cases: `export const cases = [
  {
    id: '${courseId}-case',
    title: 'Cas clinique : ${courseTitle}',
    presentation: \`Description détaillée du cas clinique avec :
- Motif de consultation
- Antécédents pertinents
- Histoire de la maladie
- Examen clinique initial\`,
    questions: [
      {
        id: 1,
        question: "Quels sont les éléments cliniques importants à rechercher ?",
        answer: \`Éléments cliniques à rechercher :
1. Signes fonctionnels
2. Signes physiques
3. Signes généraux
4. Signes associés\`
      },
      {
        id: 2,
        question: "Quels examens complémentaires demandez-vous ?",
        answer: \`Examens complémentaires :
1. Examens de première intention
- Examen 1
- Examen 2
- Examen 3

2. Examens de seconde intention
- Examen 4
- Examen 5
- Examen 6\`
      },
      {
        id: 3,
        question: "Quel est votre diagnostic et comment le confirmez-vous ?",
        answer: \`Démarche diagnostique :
1. Hypothèses diagnostiques
2. Arguments en faveur
3. Examens confirmant le diagnostic
4. Diagnostics différentiels à éliminer\`
      },
      {
        id: 4,
        question: "Quelle est votre prise en charge thérapeutique ?",
        answer: \`Stratégie thérapeutique :
1. Mesures immédiates
2. Traitement spécifique
3. Surveillance
4. Suivi à long terme\`
      }
    ]
  }
];`,

    quiz: `export const clinicalQuiz = {
  id: 'clinical-${courseId}-quiz',
  title: 'Quiz - Cas Cliniques de ${courseTitle}',
  cases: [
    {
      id: 'case1',
      title: 'Cas 1: Présentation typique',
      questions: [
        {
          id: 1,
          text: "Quel est le signe clinique le plus spécifique ?",
          options: [
            "Signe A",
            "Signe B",
            "Signe C",
            "Signe D"
          ],
          correctAnswer: 1,
          explanation: "Le signe B est le plus spécifique car..."
        },
        {
          id: 2,
          text: "Quel examen est indispensable en première intention ?",
          options: [
            "Examen A",
            "Examen B",
            "Examen C",
            "Examen D"
          ],
          correctAnswer: 0,
          explanation: "L'examen A est indispensable car..."
        }
      ]
    },
    {
      id: 'case2',
      title: 'Cas 2: Présentation atypique',
      questions: [
        {
          id: 1,
          text: "Quelle est la particularité de ce cas ?",
          options: [
            "Particularité A",
            "Particularité B",
            "Particularité C",
            "Particularité D"
          ],
          correctAnswer: 2,
          explanation: "La particularité C est importante car..."
        },
        {
          id: 2,
          text: "Quelle est la prise en charge spécifique ?",
          options: [
            "Prise en charge A",
            "Prise en charge B",
            "Prise en charge C",
            "Prise en charge D"
          ],
          correctAnswer: 1,
          explanation: "La prise en charge B est adaptée car..."
        }
      ]
    }
  ]
};`
  };
}