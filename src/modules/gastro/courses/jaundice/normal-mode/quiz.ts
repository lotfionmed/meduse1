export const quiz = {
  id: 'jaundice-quiz',
  title: 'Quiz - Ictère',
  description: 'Testez vos connaissances sur l\'ictère, ses causes et sa prise en charge',
  questions: [
    {
      id: 1,
      text: "À partir de quelle valeur de bilirubinémie totale l'ictère devient-il cliniquement visible ?",
      options: [
        "20 μmol/L",
        "35 μmol/L",
        "50 μmol/L",
        "75 μmol/L"
      ],
      correctAnswer: 2,
      explanation: `La bilirubinémie totale devient cliniquement visible à partir de 50 μmol/L. Cette valeur seuil correspond au moment où la concentration de bilirubine est suffisante pour être détectable dans les tissus, en particulier au niveau des sclérotiques et de la peau.

Points clés:
• La bilirubine s'accumule d'abord dans les tissus riches en élastine
• Les sclérotiques sont les premières zones touchées en raison de leur forte affinité pour la bilirubine
• L'ictère cutané apparaît généralement après l'ictère scléral
• La progression de la coloration suit un gradient céphalo-caudal

Références:
Harrison's Principles of Internal Medicine, 20e édition
UpToDate: Clinical manifestations and diagnosis of unconjugated hyperbilirubinemia`,
      image: "https://example.com/jaundice-clinical-signs.jpg",
      difficulty: "easy"
    },
    {
      id: 2,
      text: "Quel est le premier signe clinique visible de l'ictère ?",
      options: [
        "Coloration jaune des paumes",
        "Coloration jaune des sclérotiques",
        "Coloration jaune des lèvres",
        "Coloration jaune des ongles"
      ],
      correctAnswer: 1,
      explanation: `La coloration jaune des sclérotiques est effectivement le premier signe visible de l'ictère. Cette manifestation précoce s'explique par l'affinité particulière de la bilirubine pour le tissu élastique des sclérotiques et leur couleur blanche qui rend le changement de coloration plus apparent.

Points clés:
• Les sclérotiques contiennent une grande quantité de tissu élastique qui fixe la bilirubine
• La coloration sclérale est visible dès 30-40 μmol/L de bilirubine
• La coloration cutanée n'apparaît que vers 50 μmol/L
• L'examen des sclérotiques doit être systématique en cas de suspicion d'ictère

Références:
Clinical Examination: A Systematic Guide to Physical Diagnosis, 8e édition
Journal of Hepatology: Guidelines for the evaluation of cholestatic liver disease`,
      difficulty: "easy"
    },
    {
      id: 3,
      text: "Dans l'ictère à bilirubine conjuguée, quel signe clinique est souvent présent et très évocateur ?",
      options: [
        "Urines foncées et selles décolorées",
        "Urines claires et selles normales",
        "Urines et selles normales",
        "Urines claires et selles foncées"
      ],
      correctAnswer: 0,
      explanation: `Dans l'ictère à bilirubine conjuguée (cholestatique), les urines foncées et les selles décolorées sont des signes caractéristiques. Ce tableau clinique s'explique par la physiologie de l'excrétion biliaire et ses perturbations en cas de cholestase.

Points clés:
• Les urines foncées sont dues à l'excrétion urinaire de bilirubine conjuguée (hydrosoluble)
• Les selles décolorées résultent de l'absence de stercobiline (produit de dégradation de la bilirubine)
• Ce tableau est très évocateur d'une obstruction des voies biliaires
• La présence de ces signes doit faire rechercher une cause de cholestase en urgence

Références:
EASL Clinical Practice Guidelines: Management of cholestatic liver diseases
New England Journal of Medicine: Mechanisms of Cholestasis`,
      difficulty: "medium"
    },
    {
      id: 4,
      text: "Quelle est la principale cause d'ictère pré-hépatique ?",
      options: [
        "Hépatite virale",
        "Hémolyse pathologique",
        "Obstruction des voies biliaires",
        "Cirrhose"
      ],
      correctAnswer: 1,
      explanation: `L'hémolyse pathologique est la principale cause d'ictère pré-hépatique. Elle entraîne une augmentation de la production de bilirubine qui dépasse les capacités de conjugaison du foie, conduisant à une hyperbilirubinémie non conjuguée.

Points clés:
• L'hémolyse augmente le catabolisme de l'hémoglobine
• La bilirubine produite est initialement non conjuguée
• Le foie peut être dépassé malgré une fonction hépatique normale
• L'anémie est souvent associée mais peut être masquée initialement

Références:
Blood Journal: Hemolytic Anemias and Jaundice
American Journal of Hematology: Diagnosis and treatment of autoimmune hemolytic anemia`,
      difficulty: "medium"
    },
    {
      id: 5,
      text: "Quel type d'ictère s'accompagne typiquement d'un prurit intense ?",
      options: [
        "Ictère pré-hépatique",
        "Ictère hépatique",
        "Ictère post-hépatique (cholestatique)",
        "Ictère physiologique du nouveau-né"
      ],
      correctAnswer: 2,
      explanation: `L'ictère post-hépatique (cholestatique) s'accompagne typiquement d'un prurit intense. Ce symptôme est dû à l'accumulation d'acides biliaires dans la peau, qui stimulent les terminaisons nerveuses cutanées.

Points clés:
• Le prurit peut précéder l'ictère dans certains cas
• L'intensité du prurit n'est pas corrélée au degré d'ictère
• Le prurit est souvent plus intense la nuit
• Le traitement de la cause sous-jacente est essentiel pour soulager le prurit

Références:
Journal of Hepatology: Pathogenesis and Management of Pruritus in Cholestatic Liver Disease
Clinics in Liver Disease: Management of Pruritus in Chronic Liver Disease`,
      difficulty: "medium"
    },
    {
      id: 6,
      text: "Dans le cadre d'un ictère, quelle situation nécessite une prise en charge urgente ?",
      options: [
        "Ictère isolé d'apparition progressive",
        "Ictère avec fièvre et douleur abdominale intense",
        "Ictère avec prurit modéré",
        "Ictère avec urines foncées isolées"
      ],
      correctAnswer: 1,
      explanation: `L'association d'un ictère avec fièvre et douleur abdominale intense évoque une angiocholite, qui est une urgence médicale absolue nécessitant une prise en charge immédiate.

Points clés:
• La triade de Charcot associe : ictère, fièvre et douleur de l'hypochondre droit
• Le risque de choc septique est élevé sans traitement rapide
• L'antibiothérapie doit être débutée en urgence
• Un geste de désobstruction peut être nécessaire dans les 24-48h

Références:
World Journal of Emergency Surgery: Tokyo Guidelines 2018
The Lancet: Acute Cholangitis - Diagnosis and Management`,
      difficulty: "hard"
    },
    {
      id: 7,
      text: "Quelle est la particularité de la bilirubine non conjuguée concernant son transport sanguin ?",
      options: [
        "Elle est liée aux globules rouges",
        "Elle est liée à l'albumine",
        "Elle circule sous forme libre",
        "Elle est liée aux plaquettes"
      ],
      correctAnswer: 1,
      explanation: `La bilirubine non conjuguée est transportée dans le sang liée à l'albumine. Cette liaison est cruciale car elle permet le transport d'une molécule non hydrosoluble et prévient sa toxicité, notamment neurologique.

Points clés:
• La liaison à l'albumine est réversible mais de haute affinité
• Une molécule d'albumine peut lier deux molécules de bilirubine
• L'hypoalbuminémie augmente le risque de toxicité
• Certains médicaments peuvent déplacer la bilirubine de sa liaison

Références:
Biochemical Journal: Bilirubin-Albumin Binding Mechanisms
Clinical Chemistry: Laboratory Assessment of Bilirubin Binding`,
      difficulty: "hard"
    },
    {
      id: 8,
      text: "Quel examen biologique permet de différencier un ictère à bilirubine libre d'un ictère à bilirubine conjuguée ?",
      options: [
        "Numération formule sanguine",
        "Taux de prothrombine",
        "Fractionnement de la bilirubine",
        "Ionogramme sanguin"
      ],
      correctAnswer: 2,
      explanation: `Le fractionnement de la bilirubine est l'examen clé qui permet de différencier un ictère à bilirubine libre (non conjuguée) d'un ictère à bilirubine conjuguée. Cette distinction est fondamentale car elle oriente vers des mécanismes physiopathologiques et des causes différentes.

Points clés:
• Le fractionnement permet de doser la bilirubine conjuguée et non conjuguée
• La bilirubine conjuguée est hydrosoluble et peut être éliminée par les urines
• La bilirubine non conjuguée est liposoluble et nécessite une conjugaison hépatique
• L'interprétation doit être faite en fonction du contexte clinique

Références:
Clinical Biochemistry: Bilirubin Metabolism and Transport
Journal of Clinical Pathology: Laboratory Tests for the Diagnosis of Liver Disease`,
      difficulty: "hard"
    },
    {
      id: 9,
      text: "Quelle est la principale enzyme hépatique impliquée dans la conjugaison de la bilirubine ?",
      options: [
        "UDP-glucuronosyltransférase",
        "Alanine aminotransférase",
        "Gamma-glutamyl transférase",
        "Phosphatase alcaline"
      ],
      correctAnswer: 0,
      explanation: `La UDP-glucuronosyltransférase (UGT) est l'enzyme clé qui conjugue la bilirubine avec l'acide glucuronique dans le foie. Un déficit en cette enzyme est responsable de la maladie de Gilbert, cause fréquente d'hyperbilirubinémie non conjuguée modérée.

Points clés:
• L'UGT est spécifique de la conjugaison de la bilirubine
• La maladie de Gilbert est une cause bénigne d'hyperbilirubinémie
• Le déficit en UGT peut être partiel ou total
• D'autres enzymes peuvent également être impliquées dans la conjugaison

Références:
Nature Reviews Gastroenterology & Hepatology: Genetic Liver Disease
Journal of Hepatology: UDP-glucuronosyltransferase and bilirubin conjugation`,
      difficulty: "hard"
    },
    {
      id: 10,
      text: "Quel syndrome est caractérisé par un ictère néonatal sévère nécessitant une photothérapie intensive ?",
      options: [
        "Syndrome de Gilbert",
        "Syndrome de Crigler-Najjar",
        "Syndrome de Dubin-Johnson",
        "Syndrome de Rotor"
      ],
      correctAnswer: 1,
      explanation: `Le syndrome de Crigler-Najjar est caractérisé par un déficit complet (type I) ou partiel (type II) en UDP-glucuronosyltransférase, entraînant un ictère néonatal sévère nécessitant une photothérapie intensive et parfois une transplantation hépatique.

Points clés:
• Le déficit en UGT est responsable de l'hyperbilirubinémie
• La photothérapie est le traitement de référence
• La transplantation hépatique peut être nécessaire dans les cas sévères
• Le syndrome de Crigler-Najjar est une cause rare d'ictère néonatal

Références:
Pediatrics: Management of Hyperbilirubinemia in the Newborn
Seminars in Fetal and Neonatal Medicine: Bilirubin-Induced Neurologic Dysfunction`,
      difficulty: "hard"
    },
    {
      id: 11,
      text: "Quelle est la principale cause d'ictère chez le nouveau-né à terme ?",
      options: [
        "Infection néonatale",
        "Incompatibilité ABO",
        "Ictère physiologique",
        "Atrésie des voies biliaires"
      ],
      correctAnswer: 2,
      explanation: `L'ictère physiologique du nouveau-né est la cause la plus fréquente d'ictère néonatal. Il est dû à l'immaturité hépatique transitoire et à l'hémolyse physiologique néonatale. Il apparaît vers le 2-3ème jour de vie et régresse spontanément en 1-2 semaines.

Points clés:
• L'ictère physiologique est une cause bénigne d'hyperbilirubinémie
• Il est dû à l'immaturité hépatique et à l'hémolyse physiologique
• Il apparaît vers le 2-3ème jour de vie et régresse en 1-2 semaines
• La photothérapie peut être nécessaire dans les cas sévères

Références:
American Academy of Pediatrics: Guidelines for Phototherapy
Archives of Disease in Childhood: Neonatal Jaundice Management`,
      difficulty: "medium"
    },
    {
      id: 12,
      text: "Quelle technique d'imagerie est la plus appropriée en première intention devant un ictère cholestatique ?",
      options: [
        "Scanner abdominal",
        "IRM hépatique",
        "Échographie abdominale",
        "Scintigraphie hépatique"
      ],
      correctAnswer: 2,
      explanation: `L'échographie abdominale est l'examen de première intention devant un ictère cholestatique. Elle permet de visualiser une dilatation des voies biliaires, d'éventuels calculs, et d'orienter vers une cause obstructive ou non obstructive.

Points clés:
• L'échographie est une technique non invasive et peu coûteuse
• Elle permet de visualiser les voies biliaires et les calculs
• Elle est sensible pour détecter une dilatation des voies biliaires
• Elle peut être complétée par d'autres examens en fonction du contexte

Références:
Radiology: Ultrasound of the Liver and Biliary Tract
Journal of Clinical Ultrasound: Diagnostic Ultrasound of the Liver and Biliary System`,
      difficulty: "medium"
    },
    {
      id: 13,
      text: "Quel médicament peut provoquer un ictère cholestatique médicamenteux ?",
      options: [
        "Paracétamol aux doses thérapeutiques",
        "Amoxicilline",
        "Chlorpromazine",
        "Metformine"
      ],
      correctAnswer: 2,
      explanation: `La chlorpromazine (neuroleptique) est un médicament classiquement responsable d'ictère cholestatique médicamenteux. Cette toxicité est idiosyncrasique (non dose-dépendante) et peut survenir même à doses thérapeutiques.

Points clés:
• La chlorpromazine est un médicament à risque d'ictère cholestatique
• La toxicité est idiosyncrasique et non dose-dépendante
• L'ictère peut être sévère et nécessiter une hospitalisation
• L'arrêt du médicament est essentiel pour résoudre l'ictère

Références:
New England Journal of Medicine: Drug-Induced Liver Injury
Journal of Clinical Psychopharmacology: Chlorpromazine-Induced Cholestatic Jaundice`,
      difficulty: "hard"
    },
    {
      id: 14,
      text: "Quelle est la principale complication neurologique de l'hyperbilirubinémie non conjuguée chez le nouveau-né ?",
      options: [
        "Ictère nucléaire (kernictère)",
        "Hémorragie cérébrale",
        "Hydrocéphalie",
        "Méningite"
      ],
      correctAnswer: 0,
      explanation: `L'ictère nucléaire (kernictère) est une complication neurologique grave où la bilirubine non conjuguée traverse la barrière hémato-encéphalique et cause des lésions cérébrales irréversibles.

Points clés:
• Le kernictère est une complication grave de l'hyperbilirubinémie
• Les lésions cérébrales sont irréversibles
• La prévention repose sur la photothérapie précoce
• Le seuil d'intervention dépend de l'âge et des facteurs de risque

Références:
Pediatrics: Management of Hyperbilirubinemia in the Newborn
Seminars in Fetal and Neonatal Medicine: Bilirubin-Induced Neurologic Dysfunction`,
      difficulty: "medium"
    },
    {
      id: 15,
      text: "Quelle est la conduite à tenir devant un ictère fébrile avec frissons ?",
      options: [
        "Surveillance simple à domicile",
        "Hospitalisation en urgence",
        "Traitement antipyrétique seul",
        "Consultation dans la semaine"
      ],
      correctAnswer: 1,
      explanation: `Un ictère fébrile avec frissons doit faire évoquer une angiocholite aiguë, qui est une urgence médicale nécessitant une hospitalisation immédiate pour antibiothérapie intraveineuse et éventuel drainage biliaire en urgence.

Points clés:
• La triade de Charcot associe : ictère, fièvre et douleur de l'hypochondre droit
• Le risque de choc septique est élevé sans traitement rapide
• L'antibiothérapie doit être débutée en urgence
• Un geste de désobstruction peut être nécessaire dans les 24-48h

Références:
World Journal of Emergency Surgery: Tokyo Guidelines 2018
The Lancet: Acute Cholangitis - Diagnosis and Management`,
      difficulty: "medium"
    },
    {
      id: 16,
      text: "Quel est le mécanisme principal du syndrome de Gilbert ?",
      options: [
        "Obstruction des voies biliaires",
        "Déficit partiel en UDP-glucuronosyltransférase",
        "Hémolyse chronique",
        "Inflammation hépatique"
      ],
      correctAnswer: 1,
      explanation: `Le syndrome de Gilbert est caractérisé par un déficit partiel en UDP-glucuronosyltransférase, l'enzyme responsable de la conjugaison de la bilirubine. Cette anomalie génétique bénigne entraîne une hyperbilirubinémie non conjuguée modérée.

Points clés:
• Affection génétique bénigne touchant 5-10% de la population
• L'hyperbilirubinémie est majorée par le jeûne et le stress
• Aucun traitement n'est nécessaire
• Le diagnostic est souvent fortuit

Références:
Orphanet Journal of Rare Diseases: Gilbert Syndrome
Nature Reviews Gastroenterology & Hepatology: Genetic Liver Disease`,
      difficulty: "hard"
    },
    {
      id: 17,
      text: "Quels sont les signes évocateurs d'une cholestase intra-hépatique gravidique ?",
      options: [
        "Ictère et fièvre",
        "Prurit isolé puis ictère modéré",
        "Douleur abdominale intense",
        "Splénomégalie"
      ],
      correctAnswer: 1,
      explanation: `La cholestase gravidique se manifeste typiquement par un prurit isolé qui précède l'apparition d'un ictère modéré. Cette pathologie du troisième trimestre nécessite une surveillance étroite en raison du risque fœtal.

Points clés:
• Survient généralement après 28 semaines de grossesse
• Le prurit palmoplantaire nocturne est caractéristique
• Risque accru de mort fœtale in utero
• Disparaît après l'accouchement mais peut récidiver

Références:
The Lancet: Intrahepatic Cholestasis of Pregnancy
BJOG: Guidelines for Obstetric Cholestasis Management`,
      difficulty: "medium"
    },
    {
      id: 18,
      text: "Quelle est la principale complication de l'ictère nucléaire chez le nouveau-né ?",
      options: [
        "Insuffisance hépatique",
        "Atteinte neurologique irréversible",
        "Insuffisance rénale",
        "Troubles digestifs chroniques"
      ],
      correctAnswer: 1,
      explanation: `L'ictère nucléaire (kernictère) est une complication neurologique grave où la bilirubine non conjuguée traverse la barrière hémato-encéphalique et cause des lésions cérébrales irréversibles.

Points clés:
• Le kernictère est une complication grave de l'hyperbilirubinémie
• Les lésions cérébrales sont irréversibles
• La prévention repose sur la photothérapie précoce
• Le seuil d'intervention dépend de l'âge et des facteurs de risque

Références:
Pediatrics: Management of Hyperbilirubinemia in the Newborn
Seminars in Fetal and Neonatal Medicine: Bilirubin-Induced Neurologic Dysfunction`,
      difficulty: "hard"
    },
    {
      id: 19,
      text: "Dans le cadre d'un ictère, quelle anomalie biologique évoque une hépatite alcoolique aiguë ?",
      options: [
        "ASAT/ALAT > 2",
        "Gamma-GT normale",
        "Bilirubine conjuguée exclusive",
        "Phosphatases alcalines normales"
      ],
      correctAnswer: 0,
      explanation: `Un rapport ASAT/ALAT supérieur à 2 est très évocateur d'une hépatite alcoolique aiguë. Cette caractéristique biologique, associée au contexte, est un élément important du diagnostic.

Points clés:
• Le rapport ASAT/ALAT > 2 est très spécifique de l'origine alcoolique
• Les ASAT sont principalement d'origine mitochondriale
• La sévérité est évaluée par le score de Maddrey
• L'abstinence est le pilier du traitement

Références:
New England Journal of Medicine: Alcoholic Hepatitis
Journal of Hepatology: EASL Clinical Practice Guidelines: Management of Alcohol-Related Liver Disease`,
      difficulty: "hard"
    },
    {
      id: 20,
      text: "Quelle est l'indication principale de la photothérapie ?",
      options: [
        "Ictère à bilirubine conjuguée",
        "Ictère du nouveau-né",
        "Ictère obstructif",
        "Ictère médicamenteux"
      ],
      correctAnswer: 1,
      explanation: `La photothérapie est le traitement de référence de l'ictère du nouveau-né. Elle permet la transformation de la bilirubine en isomères hydrosolubles qui peuvent être éliminés sans conjugaison hépatique.

Points clés:
• La lumière bleue (450-475 nm) est la plus efficace
• Le traitement est non invasif et bien toléré
• L'exposition doit être maximale (surface corporelle)
• La surveillance de la bilirubinémie guide la durée du traitement

Références:
American Academy of Pediatrics: Guidelines for Phototherapy
Archives of Disease in Childhood: Neonatal Jaundice Management`,
      difficulty: "medium"
    }
  ]
};