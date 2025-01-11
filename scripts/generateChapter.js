import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_PATH = path.join(__dirname, '../src/modules');

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
    const filteredModules = [];
    
    for (const module of modules) {
      const stats = await fs.stat(path.join(MODULES_PATH, module));
      if (stats.isDirectory() && module !== 'mindmaps') {
        filteredModules.push(module);
      }
    }
    
    return filteredModules;
  } catch {
    return [];
  }
}

async function createChapterFile(moduleId, chapterId, chapterTitle) {
  // Créer le fichier du chapitre
  const chapterPath = path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`);
  const chapterContent = `export const ${chapterId} = {
  id: '${moduleId}-${chapterId}',
  title: '${chapterTitle}',
  courses: []
};`;

  await fs.writeFile(chapterPath, chapterContent);

  // Mettre à jour le fichier index.ts du module
  const moduleIndexPath = path.join(MODULES_PATH, moduleId, 'index.ts');
  let moduleIndexContent = await fs.readFile(moduleIndexPath, 'utf-8');

  // Ajouter l'import du nouveau chapitre s'il n'existe pas déjà
  if (!moduleIndexContent.includes(`import { ${chapterId} }`)) {
    const importStatement = `import { ${chapterId} } from './chapters/${chapterId}';\n`;
    moduleIndexContent = importStatement + moduleIndexContent;

    // Mettre à jour la liste des chapitres sans doublons
    const chaptersMatch = moduleIndexContent.match(/chapters: \[([\s\S]*?)\]/);
    if (chaptersMatch) {
      const existingChapters = chaptersMatch[1]
        .split(',')
        .map(ch => ch.trim())
        .filter(ch => ch && ch !== chapterId);
      
      existingChapters.push(chapterId);
      
      moduleIndexContent = moduleIndexContent.replace(
        /chapters: \[([\s\S]*?)\]/,
        `chapters: [${existingChapters.join(', ')}]`
      );
    }

    await fs.writeFile(moduleIndexPath, moduleIndexContent);
  }
}

async function main() {
  try {
    const modules = await getExistingModules();
    if (modules.length === 0) {
      console.error('Aucun module n\'existe. Veuillez d\'abord créer un module.');
      return;
    }

    // Sélection du module d'abord
    const moduleResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleId',
        message: 'Sélectionnez le module :',
        choices: modules
      }
    ]);

    const selectedModuleId = moduleResponse.moduleId;

    // Ensuite, demander les informations du chapitre
    const chapterResponse = await inquirer.prompt([
      {
        type: 'input',
        name: 'chapterId',
        message: 'ID du nouveau chapitre :',
        validate: async (input) => {
          if (!/^[a-zA-Z-]+$/.test(input)) {
            return 'L\'ID doit contenir uniquement des lettres et des tirets';
          }
          if (await chapterExists(selectedModuleId, input)) {
            return 'Ce chapitre existe déjà';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'chapterTitle',
        message: 'Titre du chapitre :',
        validate: input => input.length > 0 || 'Le titre est requis'
      }
    ]);

    await createChapterFile(
      selectedModuleId,
      chapterResponse.chapterId,
      chapterResponse.chapterTitle
    );

    console.log(`\n✓ Chapitre ${chapterResponse.chapterTitle} créé avec succès dans le module ${selectedModuleId} !`);

  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();