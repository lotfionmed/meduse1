interface MatchingItem {
  id: string;
  leftColumn: string;
  rightColumn: string;
}

interface MatchingExercise {
  id: string;
  title: string;
  description: string;
  items: MatchingItem[];
}

export const matchingExercises: MatchingExercise[] = [
  {
    id: "matching_1",
    title: "Types d'ictère et leurs caractéristiques",
    description: "Reliez chaque type d'ictère à sa caractéristique principale",
    items: [
      {
        id: "m1",
        leftColumn: "Ictère à bilirubine libre",
        rightColumn: "Augmentation de la bilirubine non conjuguée"
      },
      {
        id: "m2",
        leftColumn: "Ictère à bilirubine conjuguée",
        rightColumn: "Augmentation de la bilirubine directe"
      },
      {
        id: "m3",
        leftColumn: "Syndrome de Gilbert",
        rightColumn: "Déficit en glucuronyltransférase"
      },
      {
        id: "m4",
        leftColumn: "Cholestase",
        rightColumn: "Obstruction des voies biliaires"
      }
    ]
  },
  {
    id: "matching_2",
    title: "Signes cliniques et leurs significations",
    description: "Associez chaque signe clinique à sa signification diagnostique",
    items: [
      {
        id: "m5",
        leftColumn: "Prurit",
        rightColumn: "Cholestase chronique"
      },
      {
        id: "m6",
        leftColumn: "Selles décolorées",
        rightColumn: "Obstacle sur les voies biliaires"
      },
      {
        id: "m7",
        leftColumn: "Urines foncées",
        rightColumn: "Présence de bilirubine conjuguée"
      },
      {
        id: "m8",
        leftColumn: "Hépatomégalie",
        rightColumn: "Atteinte hépatique diffuse"
      }
    ]
  }
];
