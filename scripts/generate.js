import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateNormalMode } from './templates/normalMode.js';
import { generateClinicalMode } from './templates/clinicalMode.js';
import { generateMindMap } from './templates/mindMap.js';
import { generateMedia } from './templates/media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_PATH = path.join(__dirname, '../src/modules');

// Liste des modules fondamentaux et systèmes
const fundamentalModules = [
  'anatomy', 'biochem', 'onco', 'biophys', 'cyto', 
  'embryo', 'physio', 'histo', 'genetics', 'microbio', 'parasito'
];

const systemModules = [
  'gastro', 'cardio', 'infectious', 'hemato', 'pulmo', 'neuro',
  'locomotor', 'immuno', 'reproductive', 'urinary'
];

async function moduleExists(moduleId) {
  try {
    await fs.access(path.join(MODULES_PATH, moduleId));
    return true;
  } catch {
    return false;
  }
}

async function chapterExists(moduleId, chapterId) {
  try {
    await fs.access(path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`));
    return true;
  } catch {
    return false;
  }
}

async function getExistingModules() {
  try {
    const modules = await fs.readdir(MODULES_PATH);
    return modules.filter(async (module) => {
      const stats = await fs.stat(path.join(MODULES_PATH, module));
      return stats.isDirectory();
    });
  } catch {
    return [];
  }
}

async function getModuleChapters(moduleId) {
  try {
    const chaptersPath = path.join(MODULES_PATH, moduleId, 'chapters');
    const files = await fs.readdir(chaptersPath);
    const chapters = files
      .filter(file => file.endsWith('.ts'))
      .map(file => ({
        id: path.basename(file, '.ts'),
        title: ''
      }));

    for (const chapter of chapters) {
      const content = await fs.readFile(path.join(chaptersPath, `${chapter.id}.ts`), 'utf-8');
      const titleMatch = content.match(/title: ['"](.+?)['"]/);
      if (titleMatch) {
        chapter.title = titleMatch[1];
      }
    }

    return chapters;
  } catch (error) {
    console.error('Erreur lors de la lecture des chapitres:', error);
    return [];
  }
}

async function createCourseFiles(moduleId, chapterId, courseId, courseTitle) {
  const coursePath = path.join(MODULES_PATH, moduleId, 'courses', courseId);
  await fs.mkdir(coursePath, { recursive: true });

  // Déterminer le type de module
  const isSystemModule = systemModules.includes(moduleId);
  const isFundamentalModule = fundamentalModules.includes(moduleId);

  // Générer le contenu normal mode
  const normalModeContent = generateNormalMode(courseId, courseTitle);
  await fs.mkdir(path.join(coursePath, 'normal-mode'), { recursive: true });
  
  // Créer les fichiers du mode normal
  const normalModeFiles = {
    'index.ts': normalModeContent.index,
    'questions.ts': normalModeContent.questions,
    'quiz.ts': normalModeContent.quiz,
    'keywords.ts': normalModeContent.keywords,
    'references.ts': normalModeContent.references,
    'videos.ts': normalModeContent.videos
  };

  for (const [filename, content] of Object.entries(normalModeFiles)) {
    await fs.writeFile(path.join(coursePath, 'normal-mode', filename), content);
  }

  // Générer le mode clinique uniquement pour les modules systèmes
  if (isSystemModule) {
    const clinicalModeContent = generateClinicalMode(courseId, courseTitle);
    await fs.mkdir(path.join(coursePath, 'clinical-mode'), { recursive: true });
    
    const clinicalModeFiles = {
      'index.ts': clinicalModeContent.index,
      'cases.ts': clinicalModeContent.cases,
      'clinical-quiz.ts': clinicalModeContent.quiz
    };

    for (const [filename, content] of Object.entries(clinicalModeFiles)) {
      await fs.writeFile(path.join(coursePath, 'clinical-mode', filename), content);
    }
  }

  // Générer le mindmap
  const mindMapContent = generateMindMap(courseId, courseTitle);
  await fs.writeFile(
    path.join(MODULES_PATH, 'mindmaps', `${courseId}-mindmap.ts`),
    mindMapContent
  );

  // Générer le fichier media.ts
  const mediaContent = generateMedia(courseId, courseTitle, isSystemModule);
  await fs.writeFile(path.join(coursePath, 'media.ts'), mediaContent);

  // Générer le fichier index.ts du cours
  const indexContent = `import { normalMode } from './normal-mode';
${isSystemModule ? "import { clinicalMode } from './clinical-mode';" : ''}
import { media } from './media';

const ${courseId} = {
  id: '${courseId}',
  title: '${courseTitle}',
  content: {
    definition: '${courseTitle}',
    normalMode,
    ${isSystemModule ? 'clinicalMode,' : ''}
    ...media
  }
};

export { ${courseId} };`;

  await fs.writeFile(path.join(coursePath, 'index.ts'), indexContent);

  // Mettre à jour le fichier du chapitre
  await updateChapterFile(moduleId, chapterId, courseId);
}

async function updateChapterFile(moduleId, chapterId, courseId) {
  const chapterPath = path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`);
  let content = await fs.readFile(chapterPath, 'utf-8');
  
  if (!content.includes(`import { ${courseId} }`)) {
    content = `import { ${courseId} } from '../courses/${courseId}';\n` + content;
    
    const coursesMatch = content.match(/courses: \[(.*?)\]/s);
    if (coursesMatch) {
      const existingCourses = coursesMatch[1].split(',').map(c => c.trim()).filter(c => c);
      if (!existingCourses.includes(courseId)) {
        existingCourses.push(courseId);
      }
      content = content.replace(
        /courses: \[.*?\]/s,
        `courses: [${existingCourses.join(', ')}]`
      );
    }
    
    await fs.writeFile(chapterPath, content);
  }
}

async function main() {
  try {
    const modules = await getExistingModules();
    if (modules.length === 0) {
      console.error('Aucun module n\'existe. Veuillez d\'abord créer un module.');
      return;
    }

    // Sélection du module
    const { moduleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleId',
        message: 'Sélectionnez le module :',
        choices: modules
      }
    ]);

    // Récupérer et afficher les chapitres du module sélectionné
    const chapters = await getModuleChapters(moduleId);
    if (chapters.length === 0) {
      console.error(`Aucun chapitre trouvé dans le module ${moduleId}`);
      return;
    }

    // Sélection du chapitre
    const { chapterId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chapterId',
        message: 'Sélectionnez le chapitre :',
        choices: chapters.map(chapter => ({
          name: `${chapter.id} - ${chapter.title}`,
          value: chapter.id
        }))
      }
    ]);

    // Demander les informations du nouveau cours
    const courseInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'courseId',
        message: 'ID du nouveau cours :',
        validate: input => /^[a-zA-Z-]+$/.test(input) || 'L\'ID doit contenir uniquement des lettres et des tirets'
      },
      {
        type: 'input',
        name: 'courseTitle',
        message: 'Titre du cours :',
        validate: input => input.length > 0 || 'Le titre est requis'
      }
    ]);

    await createCourseFiles(
      moduleId,
      chapterId,
      courseInfo.courseId,
      courseInfo.courseTitle
    );

    console.log('\n✓ Génération du cours terminée avec succès !');
  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();