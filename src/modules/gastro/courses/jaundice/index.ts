import { normalMode } from './normal-mode';
import { clinicalMode } from './clinical-mode';
import { media } from './media';
import { clinicalQuiz } from './clinical-quiz';

const jaundice = {
  id: 'jaundice',
  title: 'Icter',
  content: {
    definition: "L'ictère, ou jaunisse, se manifeste par une coloration jaune de la peau, des sclérotiques (le blanc des yeux) et des muqueuses. Cette coloration est due à une accumulation excessive de **bilirubine**, un pigment jaune produit lors de la dégradation normale des globules rouges. Cette hyperbilirubinémie peut être détectée dans le sang",
    normalMode: {
      ...normalMode,
      chronology: normalMode.chronology
    },
    clinicalMode,
    clinicalQuiz,
    ...media
  }
};

export { jaundice };