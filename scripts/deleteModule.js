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
    const moduleInfos = [];
    
    for (const module of modules) {
      const stats = await fs.stat(path.join(MODULES_PATH, module));
      if (stats.isDirectory() && module !== 'mindmaps') {
        try {
          const indexContent = await fs.readFile(
            path.join(MODULES_PATH, module, 'index.ts'),
            'utf-8'
          );
          const titleMatch = indexContent.match(/title: ['"](.+?)['"]/);
          moduleInfos.push({
            id: module,
            title: titleMatch ? titleMatch[1] : module
          });
        } catch {
          moduleInfos.push({
            id: module,
            title: module
          });
        }
      }
    }
    
    return moduleInfos;
  } catch {
    return [];
  }
}

async function getModuleChapters(moduleId) {
  try {
    const chaptersPath = path.join(MODULES_PATH, moduleId, 'chapters');
    const files = await fs.readdir(chaptersPath);
    return files.filter(file => file.endsWith('.ts')).map(file => path.basename(file, '.ts'));
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

async function deleteModule(moduleId) {
  try {
    // 1. Récupérer tous les chapitres et cours pour supprimer les mindmaps
    const chapters = await getModuleChapters(moduleId);
    for (const chapterId of chapters) {
      const courses = await getChapterCourses(moduleId, chapterId);
      // Supprimer les mindmaps associés aux cours
      for (const courseId of courses) {
        const mindmapPath = path.join(MODULES_PATH, 'mindmaps', `${courseId}-mindmap.ts`);
        try {
          await fs.unlink(mindmapPath);
        } catch {
          // Ignorer si le fichier n'existe pas
        }
      }
    }

    // 2. Supprimer le dossier du module
    const modulePath = path.join(MODULES_PATH, moduleId);
    await fs.rm(modulePath, { recursive: true, force: true });

    // 3. Mettre à jour le fichier index.ts principal
    const mainIndexPath = path.join(MODULES_PATH, 'index.ts');
    let mainIndexContent = await fs.readFile(mainIndexPath, 'utf-8');

    // Supprimer l'import du module
    mainIndexContent = mainIndexContent.replace(
      new RegExp(`import\\s*{\\s*${moduleId}\\s*}\\s*from\\s*['"]\\./${moduleId}['"];?\n?`),
      ''
    );

    // Mettre à jour la liste des modules
    const modulesMatch = mainIndexContent.match(/const \[modules\] = useState\(\[([\s\S]*?)\]\);/);
    if (modulesMatch) {
      const existingModules = modulesMatch[1]
        .split(',')
        .map(m => m.trim())
        .filter(m => m && m !== moduleId);

      mainIndexContent = mainIndexContent.replace(
        /const \[modules\] = useState\(\[[\s\S]*?\]\);/,
        `const [modules] = useState([${existingModules.join(', ')}]);`
      );
    }

    await fs.writeFile(mainIndexPath, mainIndexContent);

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error);
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
        message: 'Sélectionnez le module à supprimer :',
        choices: modules.map(m => ({
          name: `${m.title} (${m.id})`,
          value: m.id
        }))
      }
    ]);

    // 2. Confirmation avec le nom du module en majuscules
    const { confirm } = await inquirer.prompt([
      {
        type: 'input',
        name: 'confirm',
        message: `Cette action est IRRÉVERSIBLE ! Pour confirmer la suppression du module "${moduleId}", tapez son nom en MAJUSCULES :`,
        validate: input => input === moduleId.toUpperCase() || 'Le nom ne correspond pas'
      }
    ]);

    // 3. Supprimer le module
    const success = await deleteModule(moduleId);
    if (success) {
      console.log(`\n✓ Module "${moduleId}" supprimé avec succès !`);
    } else {
      console.error('\n✗ Erreur lors de la suppression du module.');
    }

  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();
