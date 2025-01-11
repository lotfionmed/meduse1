import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_PATH = path.join(__dirname, '../src/modules');

async function getExistingModules() {
  try {
    const modules = await fs.readdir(MODULES_PATH);
    return modules.filter(async (module) => {
      const stats = await fs.stat(path.join(MODULES_PATH, module));
      return stats.isDirectory() && module !== 'mindmaps';
    });
  } catch {
    return [];
  }
}

async function getModuleChapters(moduleId) {
  try {
    const chaptersPath = path.join(MODULES_PATH, moduleId, 'chapters');
    const files = await fs.readdir(chaptersPath);
    return files
      .filter(file => file.endsWith('.ts'))
      .map(file => path.basename(file, '.ts'));
  } catch {
    return [];
  }
}

async function getChapterCourses(moduleId, chapterId) {
  try {
    const chapterPath = path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`);
    const content = await fs.readFile(chapterPath, 'utf-8');
    const coursesMatch = content.match(/courses: \[(.*?)\]/s);
    if (coursesMatch) {
      return coursesMatch[1]
        .split(',')
        .map(c => c.trim())
        .filter(c => c);
    }
    return [];
  } catch {
    return [];
  }
}

async function deleteCourse(moduleId, chapterId, courseId) {
  try {
    // 1. Supprimer le dossier du cours
    const coursePath = path.join(MODULES_PATH, moduleId, 'courses', courseId);
    await fs.rm(coursePath, { recursive: true, force: true });

    // 2. Supprimer la référence dans le fichier du chapitre
    const chapterPath = path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`);
    let chapterContent = await fs.readFile(chapterPath, 'utf-8');
    
    // Supprimer l'import du cours
    chapterContent = chapterContent.replace(
      new RegExp(`import\\s*{\\s*${courseId}\\s*}\\s*from\\s*['"]../courses/${courseId}['"];?\n?`),
      ''
    );

    // Mettre à jour la liste des cours
    const courses = await getChapterCourses(moduleId, chapterId);
    const updatedCourses = courses.filter(c => c !== courseId);
    chapterContent = chapterContent.replace(
      /courses: \[.*?\]/s,
      `courses: [${updatedCourses.join(', ')}]`
    );

    await fs.writeFile(chapterPath, chapterContent);

    // 3. Supprimer le fichier mindmap associé s'il existe
    const mindmapPath = path.join(MODULES_PATH, 'mindmaps', `${courseId}-mindmap.ts`);
    try {
      await fs.unlink(mindmapPath);
    } catch {
      // Ignorer si le fichier mindmap n'existe pas
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    return false;
  }
}

async function main() {
  try {
    // 1. Sélectionner le module
    const modules = await getExistingModules();
    if (modules.length === 0) {
      console.error('Aucun module trouvé.');
      return;
    }

    const { moduleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleId',
        message: 'Sélectionnez le module :',
        choices: modules
      }
    ]);

    // 2. Sélectionner le chapitre
    const chapters = await getModuleChapters(moduleId);
    if (chapters.length === 0) {
      console.error('Aucun chapitre trouvé dans ce module.');
      return;
    }

    const { chapterId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chapterId',
        message: 'Sélectionnez le chapitre :',
        choices: chapters
      }
    ]);

    // 3. Sélectionner le cours
    const courses = await getChapterCourses(moduleId, chapterId);
    if (courses.length === 0) {
      console.error('Aucun cours trouvé dans ce chapitre.');
      return;
    }

    const { courseId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'courseId',
        message: 'Sélectionnez le cours à supprimer :',
        choices: courses
      }
    ]);

    // 4. Confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Êtes-vous sûr de vouloir supprimer le cours "${courseId}" ? Cette action est irréversible.`,
        default: false
      }
    ]);

    if (!confirm) {
      console.log('Opération annulée.');
      return;
    }

    // 5. Supprimer le cours
    const success = await deleteCourse(moduleId, chapterId, courseId);
    if (success) {
      console.log(`\n✓ Cours "${courseId}" supprimé avec succès !`);
    } else {
      console.error('\n✗ Erreur lors de la suppression du cours.');
    }

  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();
