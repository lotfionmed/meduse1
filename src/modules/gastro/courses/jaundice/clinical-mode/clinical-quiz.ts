export const clinicalQuiz = {
  id: 'clinical-jaundice-quiz',
  title: 'Quiz - Cas Cliniques de Icter',
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
};