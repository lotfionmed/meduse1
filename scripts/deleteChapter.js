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

async function deleteChapter(moduleId, chapterId) {
  try {
    // 1. Supprimer tous les cours associés
    const courses = await getChapterCourses(moduleId, chapterId);
    for (const courseId of courses) {
      const coursePath = path.join(MODULES_PATH, moduleId, 'courses', courseId);
      await fs.rm(coursePath, { recursive: true, force: true });

      // Supprimer le mindmap associé
      const mindmapPath = path.join(MODULES_PATH, 'mindmaps', `${courseId}-mindmap.ts`);
      try {
        await fs.unlink(mindmapPath);
      } catch {
        // Ignorer si le fichier n'existe pas
      }
    }

    // 2. Supprimer le fichier du chapitre
    const chapterPath = path.join(MODULES_PATH, moduleId, 'chapters', `${chapterId}.ts`);
    await fs.unlink(chapterPath);

    // 3. Mettre à jour le fichier index.ts du module
    const moduleIndexPath = path.join(MODULES_PATH, moduleId, 'index.ts');
    let moduleIndexContent = await fs.readFile(moduleIndexPath, 'utf-8');

    // Supprimer l'import du chapitre
    moduleIndexContent = moduleIndexContent.replace(
      new RegExp(`import\\s*{\\s*${chapterId}\\s*}\\s*from\\s*['"]./chapters/${chapterId}['"];?\n?`),
      ''
    );

    // Mettre à jour la liste des chapitres
    const chaptersMatch = moduleIndexContent.match(/chapters: \[([\s\S]*?)\]/);
    if (chaptersMatch) {
      const existingChapters = chaptersMatch[1]
        .split(',')
        .map(ch => ch.trim())
        .filter(ch => ch && ch !== chapterId);

      moduleIndexContent = moduleIndexContent.replace(
        /chapters: \[([\s\S]*?)\]/,
        `chapters: [${existingChapters.join(', ')}]`
      );
    }

    await fs.writeFile(moduleIndexPath, moduleIndexContent);

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du chapitre:', error);
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
        message: 'Sélectionnez le chapitre à supprimer :',
        choices: chapters.map(ch => ({
          name: `${ch.title} (${ch.id})`,
          value: ch.id
        }))
      }
    ]);

    // 3. Confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Êtes-vous sûr de vouloir supprimer le chapitre "${chapterId}" et tous ses cours ? Cette action est irréversible.`,
        default: false
      }
    ]);

    if (!confirm) {
      console.log('Opération annulée.');
      return;
    }

    // 4. Supprimer le chapitre
    const success = await deleteChapter(moduleId, chapterId);
    if (success) {
      console.log(`\n✓ Chapitre "${chapterId}" et tous ses cours supprimés avec succès !`);
    } else {
      console.error('\n✗ Erreur lors de la suppression du chapitre.');
    }

  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();
