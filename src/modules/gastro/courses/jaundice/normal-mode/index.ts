import { questions } from './questions';
import { quiz } from './quiz';
import { references } from './references';
import { videos } from './videos';
import { keywords } from './keywords';
import { notes } from './notes';
import { similarCourses } from './similar-courses';
import { jaundiceChronology } from './chronology';
import { matchingExercises } from './matching';
import { fillBlanksExercises } from './fill-blanks';

export const normalMode = {
  questions,
  quiz,
  references,
  videos,
  keywords,
  notes,
  similarCourses,
  matching: matchingExercises,
  chronology: jaundiceChronology,
  fillBlanks: fillBlanksExercises
};