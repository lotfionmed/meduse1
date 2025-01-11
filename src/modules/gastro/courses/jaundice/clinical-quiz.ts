export const clinicalQuiz = {
  id: 'clinical-jaundice-quiz',
  title: 'Quiz - Cas Cliniques de Icter',
  cases: [
    {
      id: 'case1',
      title: 'Cas 1: Ictère Obstructif',
      presentation: "Un homme de 55 ans se présente aux urgences avec des douleurs abdominales dans la partie supérieure droite, des selles décolorées et un ictère. À l'examen, on note une jaunisse marquée et une sensibilité au niveau de l'hypochondre droit.",
      questions: [
        {
          id: 1,
          text: "Quel est le signe clinique le plus spécifique de l'ictère obstructif ?",
          options: [
            "Prurit",
            "Selles décolorées",
            "Urines foncées",
            "Douleur abdominale"
          ],
          correctAnswer: 1,
          explanation: "Les selles décolorées sont un signe spécifique de l'ictère obstructif, car cela indique une absence de bilirubine dans les selles due à un blocage des voies biliaires."
        },
        {
          id: 2,
          text: "Quel examen est indispensable en première intention pour confirmer l'ictère obstructif ?",
          options: [
            "Échographie abdominale",
            "Scanner abdominal",
            "IRM hépatique",
            "Radiographie"
          ],
          correctAnswer: 0,
          explanation: "L'échographie abdominale est l'examen de première intention pour évaluer les voies biliaires et détecter une obstruction."
        },
        {
          id: 3,
          text: "Quel est le traitement de première ligne pour l'ictère obstructif ?",
          options: [
            "Chirurgie",
            "Médicaments",
            "Observation",
            "Photothérapie"
          ],
          correctAnswer: 0,
          explanation: "La chirurgie peut être nécessaire pour enlever l'obstruction dans les cas d'ictère obstructif."
        },
        {
          id: 4,
          text: "Quels sont les risques associés à un ictère obstructif non traité ?",
          options: [
            "Insuffisance hépatique",
            "Infection",
            "Syndrome de sevrage",
            "Anémie"
          ],
          correctAnswer: 0,
          explanation: "Un ictère obstructif non traité peut entraîner une insuffisance hépatique en raison de la pression accrue sur le foie."
        }
      ]
    },
    {
      id: 'case2',
      title: 'Cas 2: Ictère Hémolytique',
      presentation: "Une femme de 30 ans se présente avec une jaunisse, une fatigue extrême et une pâleur. Elle a des antécédents d'anémie et a récemment eu une transfusion sanguine.",
      questions: [
        {
          id: 1,
          text: "Quelle est la cause la plus fréquente d'ictère hémolytique chez un adulte ?",
          options: [
            "Anémie ferriprive",
            "Syndrome de Gilbert",
            "Maladie auto-immune",
            "Hémolyse par transfusion"
          ],
          correctAnswer: 2,
          explanation: "Les maladies auto-immunes, comme le lupus, peuvent provoquer une hémolyse et un ictère hémolytique."
        },
        {
          id: 2,
          text: "Quel test sanguin est le plus utile pour évaluer l'hémolyse ?",
          options: [
            "Numération formule sanguine",
            "Dosage de la bilirubine totale",
            "Test de Coombs",
            "Taux de prothrombine"
          ],
          correctAnswer: 2,
          explanation: "Le test de Coombs permet de détecter la présence d'anticorps sur les globules rouges, ce qui est essentiel dans l'évaluation de l'hémolyse."
        },
        {
          id: 3,
          text: "Quels sont les signes cliniques typiques d'un ictère hémolytique ?",
          options: [
            "Selles décolorées et urines foncées",
            "Pâleur et fatigue",
            "Jaunisse et splénomégalie",
            "Douleur abdominale"
          ],
          correctAnswer: 2,
          explanation: "La jaunisse et la splénomégalie sont des signes cliniques typiques d'un ictère hémolytique dû à l'hémolyse des globules rouges."
        },
        {
          id: 4,
          text: "Quelle est la prise en charge initiale d'un patient présentant un ictère hémolytique ?",
          options: [
            "Transfusion sanguine",
            "Hydratation",
            "Observation",
            "Médicaments immunosuppresseurs"
          ],
          correctAnswer: 1,
          explanation: "L'hydratation est importante pour soutenir le patient pendant l'évaluation et le traitement de l'hémolyse."
        }
      ]
    },
    {
      id: 'case3',
      title: 'Cas 3: Ictère Hépatique',
      presentation: "Un homme de 45 ans avec des antécédents d'hépatite virale se présente avec une jaunisse, des urines foncées et des douleurs abdominales. Il a également perdu du poids récemment.",
      questions: [
        {
          id: 1,
          text: "Quel est le principal facteur de risque d'ictère hépatique ?",
          options: [
            "Consommation d'alcool",
            "Obésité",
            "Antécédents familiaux",
            "Voyages récents"
          ],
          correctAnswer: 0,
          explanation: "La consommation d'alcool est un facteur de risque majeur pour le développement d'ictère hépatique, en raison de son effet toxique sur le foie."
        },
        {
          id: 2,
          text: "Quel examen est le plus pertinent pour évaluer la fonction hépatique ?",
          options: [
            "Échographie abdominale",
            "Bilan hépatique (transaminases, bilirubine, etc.)",
            "Scanner abdominal",
            "Biopsie hépatique"
          ],
          correctAnswer: 1,
          explanation: "Le bilan hépatique permet d'évaluer la fonction du foie et d'identifier des anomalies."
        },
        {
          id: 3,
          text: "Quels sont les symptômes associés à l'ictère hépatique ?",
          options: [
            "Prurit et urines foncées",
            "Selles décolorées et douleurs abdominales",
            "Fatigue et jaunisse",
            "Perte de poids"
          ],
          correctAnswer: 2,
          explanation: "La fatigue et la jaunisse sont des symptômes courants associés à l'ictère hépatique."
        },
        {
          id: 4,
          text: "Quelle est la prise en charge d'un patient avec un ictère hépatique aigu ?",
          options: [
            "Surveillance et traitement de la cause sous-jacente",
            "Chirurgie immédiate",
            "Transfusion sanguine",
            "Observation uniquement"
          ],
          correctAnswer: 0,
          explanation: "La prise en charge dépend de la cause sous-jacente et nécessite une surveillance attentive."
        }
      ]
    },
    {
      id: 'case4',
      title: 'Cas 4: Ictère Physiologique du Nouveau-né',
      presentation: "Un nouveau-né de 3 jours présente une jaunisse légère. Les parents rapportent que la jaunisse est apparue 48 heures après la naissance.",
      questions: [
        {
          id: 1,
          text: "À quel moment l'ictère physiologique du nouveau-né apparaît-il généralement ?",
          options: [
            "À la naissance",
            "Entre 24 et 48 heures",
            "Après 1 semaine",
            "À 2 semaines"
          ],
          correctAnswer: 1,
          explanation: "L'ictère physiologique apparaît généralement entre 24 et 48 heures après la naissance, en raison de l'immaturité hépatique."
        },
        {
          id: 2,
          text: "Quelle est la prise en charge recommandée pour l'ictère physiologique ?",
          options: [
            "Photothérapie",
            "Transfusion sanguine",
            "Observation et suivi",
            "Médicaments"
          ],
          correctAnswer: 2,
          explanation: "L'ictère physiologique nécessite généralement une observation et un suivi, car il se résout spontanément dans la plupart des cas."
        },
        {
          id: 3,
          text: "Quels facteurs peuvent exacerber l'ictère physiologique chez le nouveau-né ?",
          options: [
            "Infection",
            "Déshydratation",
            "Hypoglycémie",
            "Tous les choix"
          ],
          correctAnswer: 3,
          explanation: "Tous ces facteurs peuvent exacerber l'ictère physiologique en augmentant la bilirubinémie."
        },
        {
          id: 4,
          text: "Quand faut-il s'inquiéter d'un ictère chez un nouveau-né ?",
          options: [
            "S'il apparaît après 2 semaines",
            "S'il est accompagné de fièvre",
            "S'il est très marqué",
            "Tous les choix"
          ],
          correctAnswer: 3,
          explanation: "Tous ces signes doivent être évalués par un professionnel de santé pour éviter des complications."
        }
      ]
    }
  ]
};