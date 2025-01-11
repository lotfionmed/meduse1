interface Note {
  title: string;
  content: string;
  type: 'definition' | 'concept' | 'important' | 'summary';
}

export const notes: Note[] = [
  {
    title: "Définition de l'ictère",
    content: "L'ictère, ou jaunisse, est une coloration jaune des téguments et des muqueuses due à l'accumulation de bilirubine dans les tissus. Il devient cliniquement décelable lorsque la bilirubinémie totale dépasse 50 μmol/L.",
    type: "definition"
  },
  {
    title: "Métabolisme de la bilirubine",
    content: `La bilirubine provient principalement (80%) de la dégradation de l'hémoglobine des globules rouges sénescents.
    
1. Production : 250-300 mg/jour
2. Transport : Liée à l'albumine (bilirubine libre)
3. Conjugaison hépatique : Transformation en bilirubine conjugée
4. Excrétion : Dans la bile puis dans les selles`,
    type: "concept"
  },
  {
    title: "Classification physiopathologique",
    content: `Trois grands mécanismes de l'ictère :

1. Ictère à bilirubine libre (non conjuguée) :
   - Hémolyse excessive
   - Défaut de conjugaison hépatique

2. Ictère à bilirubine conjuguée :
   - Obstacle sur les voies biliaires
   - Défaut d'excrétion hépatique

3. Ictère mixte :
   - Atteinte hépatocellulaire globale`,
    type: "important"
  },
  {
    title: "Signes cliniques essentiels",
    content: `Manifestations principales :

1. Coloration jaune :
   - Peau
   - Sclérotiques (premier signe)
   - Muqueuses

2. Signes associés variables :
   - Prurit (ictère cholestatique)
   - Urines foncées
   - Selles décolorées
   - Syndrome hémorragique`,
    type: "important"
  },
  {
    title: "Examens biologiques de première intention",
    content: `Bilan initial devant un ictère :

1. Bilirubine totale et conjuguée
2. Transaminases (ASAT, ALAT)
3. γGT et Phosphatases alcalines
4. NFS-plaquettes
5. TP, facteur V
6. Sérologies virales (hépatites)`,
    type: "concept"
  },
  {
    title: "Principales étiologies",
    content: `Causes fréquentes selon le type d'ictère :

1. Ictère à bilirubine libre :
   - Hémolyse constitutionnelle ou acquise
   - Syndrome de Gilbert

2. Ictère à bilirubine conjuguée :
   - Lithiase de la voie biliaire principale
   - Cancer du pancréas
   - Cirrhose

3. Ictère mixte :
   - Hépatites virales
   - Hépatites médicamenteuses
   - Cirrhose décompensée`,
    type: "important"
  },
  {
    title: "Conduite à tenir diagnostique",
    content: `Démarche systématique :

1. Interrogatoire :
   - Antécédents
   - Médicaments
   - Mode d'installation

2. Examen clinique complet
3. Bilan biologique initial
4. Imagerie adaptée :
   - Échographie abdominale
   - Scanner/IRM si nécessaire

5. Examens spécialisés selon orientation`,
    type: "concept"
  },
  {
    title: "Points clés de la prise en charge",
    content: `Éléments essentiels à retenir :

1. L'ictère est un signe clinique, pas une maladie
2. L'orientation étiologique repose sur :
   - Le type de bilirubine augmentée
   - Le contexte clinique
   - Les examens complémentaires

3. L'échographie est l'examen de première intention
4. Certaines causes nécessitent une prise en charge urgente
5. Le pronostic dépend de l'étiologie`,
    type: "summary"
  },
  {
    title: "Critères de gravité",
    content: `Signes d'alarme à rechercher :

1. Insuffisance hépatocellulaire :
   - TP < 50%
   - Facteur V < 50%
   - Encéphalopathie

2. Complications :
   - Hémorragies
   - Infection
   - Insuffisance rénale

3. Terrain :
   - Âge
   - Comorbidités
   - État général`,
    type: "important"
  }
];
