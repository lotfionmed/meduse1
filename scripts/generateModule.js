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

async function createModuleDirectory(moduleId) {
  const modulePath = path.join(MODULES_PATH, moduleId);
  await fs.mkdir(modulePath);
  await fs.mkdir(path.join(modulePath, 'chapters'));
  await fs.mkdir(path.join(modulePath, 'courses'));
}

async function createModuleFiles(moduleId, moduleTitle, icon) {
  // Créer le fichier index.ts du module
  const moduleIndexContent = `import { ${icon} } from 'lucide-react';
import { symptoms } from './chapters/symptoms';

export const ${moduleId} = {
  id: '${moduleId.toLowerCase()}',
  title: '${moduleTitle}',
  icon: ${icon},
  chapters: [symptoms]
};`;

  await fs.writeFile(
    path.join(MODULES_PATH, moduleId, 'index.ts'),
    moduleIndexContent
  );

  // Créer le dossier et fichier symptoms
  const symptomsPath = path.join(MODULES_PATH, moduleId, 'chapters', 'symptoms.ts');
  const symptomsContent = `export const symptoms = {
  id: '${moduleId.toLowerCase()}-symptoms',
  title: 'Symptômes',
  courses: []
};`;

  await fs.writeFile(symptomsPath, symptomsContent);

  // Mettre à jour le fichier index.ts principal des modules
  const mainIndexPath = path.join(MODULES_PATH, 'index.ts');
  let mainIndexContent = await fs.readFile(mainIndexPath, 'utf-8');

  // Ajouter l'import du nouveau module
  if (!mainIndexContent.includes(`import { ${moduleId} }`)) {
    mainIndexContent = `import { ${moduleId} } from './${moduleId}';\n` + mainIndexContent;

    // Mettre à jour la liste des modules sans doublons
    const modulesMatch = mainIndexContent.match(/const \[modules\] = useState\(\[([\s\S]*?)\]\);/);
    if (modulesMatch) {
      const existingModules = modulesMatch[1]
        .split(',')
        .map(m => m.trim())
        .filter(m => m && m !== moduleId);
      
      existingModules.push(moduleId);
      
      mainIndexContent = mainIndexContent.replace(
        /const \[modules\] = useState\(\[[\s\S]*?\]\);/,
        `const [modules] = useState([${existingModules.join(', ')}]);`
      );
    }

    await fs.writeFile(mainIndexPath, mainIndexContent);
  }
}

async function main() {
  try {
    const { moduleId, moduleTitle, icon } = await inquirer.prompt([
      {
        type: 'input',
        name: 'moduleId',
        message: 'ID du nouveau module :',
        validate: async (input) => {
          if (!/^[a-zA-Z]+$/.test(input)) {
            return 'L\'ID doit contenir uniquement des lettres';
          }
          if (await moduleExists(input)) {
            return 'Ce module existe déjà';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'moduleTitle',
        message: 'Titre du module :',
        validate: input => input.length > 0 || 'Le titre est requis'
      },
      {
        type: 'list',
        name: 'icon',
        message: 'Icône du module :',
        choices: [
          'Heart',
          'Brain',
          'Lungs',
          'Stethoscope',
          'Activity',
          'ThermometerSun',
          'Microscope',
          'Flask'
        ]
      }
    ]);

    await createModuleDirectory(moduleId);
    await createModuleFiles(moduleId, moduleTitle, icon);

    console.log(`\n✓ Module ${moduleTitle} créé avec succès !`);

  } catch (error) {
    console.error('\n✗ Une erreur est survenue :', error.message);
    process.exit(1);
  }
}

main();