import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_PATH = path.join(__dirname, '../src/modules');
const ICONS_PATH = path.join(__dirname, '../src/assets/icons');

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
          const titleMatch = indexContent.match(/title: ['"](.+?)['"]/)
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

async function selectIconFile() {
  return new Promise((resolve, reject) => {
    const electronPath = require.resolve('electron/cli.js');
    const dialogScriptPath = path.join(__dirname, 'electron-dialog.js');
    
    const electronProcess = spawn('node', [electronPath, dialogScriptPath], {
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    electronProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    electronProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    electronProcess.on('close', (code) => {
      if (code === 0 && output.trim()) {
        resolve(output.trim());
      } else {
        reject(new Error(error || 'Aucun fichier sélectionné'));
      }
    });
  });
}

async function validateIconFile(iconPath) {
  try {
    const stats = await fs.stat(iconPath);
    if (!stats.isFile()) return 'Le chemin spécifié n\'est pas un fichier';
    
    const ext = path.extname(iconPath).toLowerCase();
    const allowedExtensions = ['.svg', '.png'];
    if (!allowedExtensions.includes(ext)) {
      return 'Le fichier doit être au format SVG ou PNG';
    }
    
    return true;
  } catch {
    return 'Le fichier n\'existe pas';
  }
}

async function importIcon(moduleId, iconPath) {
  try {
    // Créer le dossier icons s'il n'existe pas
    try {
      await fs.mkdir(ICONS_PATH, { recursive: true });
    } catch {}

    // Copier l'icône dans le dossier des icônes
    const ext = path.extname(iconPath).toLowerCase();
    const iconFileName = `${moduleId}-icon${ext}`;
    const destPath = path.join(ICONS_PATH, iconFileName);
    await fs.copyFile(iconPath, destPath);

    // Mettre à jour le fichier index.ts du module
    const moduleIndexPath = path.join(MODULES_PATH, moduleId, 'index.ts');
    let indexContent = await fs.readFile(moduleIndexPath, 'utf-8');
    
    // Supprimer l'ancienne importation lucide-react
    indexContent = indexContent.replace(/import \{[^}]+\} from ['"]lucide-react['"];?\n?/, '');
    
    // Ajouter la nouvelle importation
    const importStatement = `import icon from '../../assets/icons/${iconFileName}';\n`;
    indexContent = importStatement + indexContent;
    
    // Remplacer l'ancienne référence d'icône
    indexContent = indexContent.replace(/icon: \w+,/, `icon: icon,`);
    
    await fs.writeFile(moduleIndexPath, indexContent);
    
    console.log(`✅ Icône importée avec succès pour le module ${moduleId}`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation de l\'icône:', error);
    throw error;
  }
}

async function main() {
  try {
    // 1. Obtenir la liste des modules
    const modules = await getExistingModules();
    if (modules.length === 0) {
      console.log('❌ Aucun module trouvé');
      return;
    }

    // 2. Demander à l'utilisateur de choisir un module
    const { moduleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleId',
        message: 'Pour quel module souhaitez-vous importer une icône ?',
        choices: modules.map(m => ({
          name: m.title,
          value: m.id
        }))
      }
    ]);

    // 3. Ouvrir la boîte de dialogue de sélection de fichier
    console.log('📂 Veuillez sélectionner votre fichier icône SVG...');
    const iconPath = await selectIconFile();

    // 4. Valider le fichier sélectionné
    const validationResult = await validateIconFile(iconPath);
    if (validationResult !== true) {
      throw new Error(validationResult);
    }

    // 5. Importer l'icône
    await importIcon(moduleId, iconPath);

  } catch (error) {
    console.error('❌ Une erreur est survenue:', error);
  }
}

main();
