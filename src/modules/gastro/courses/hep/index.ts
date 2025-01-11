import { normalMode } from './normal-mode';
import { clinicalMode } from './clinical-mode';
import { media } from './media';

const hep = {
  id: 'hep',
  title: 'Hepatit Viral',
  content: {
    definition: 'Hepatit Viral',
    normalMode,
    clinicalMode,
    ...media
  }
};

export { hep };