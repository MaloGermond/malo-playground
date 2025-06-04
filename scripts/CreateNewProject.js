import fs from 'fs-extra';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Veuillez fournir un nom de projet. Ex: yarn new mon_projet');
  process.exit(1);
}

const projectName = args[0];
const sourceDir = path.join(process.cwd(), 'scripts', 'starter');
const targetDir = path.join(process.cwd(), 'projects', projectName);

async function createProject() {
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Le projet "${projectName}" existe déjà.`);
    process.exit(1);
  }

  try {
    await fs.copy(sourceDir, targetDir);
    console.log(`✅ Projet "${projectName}" créé avec succès !`);
  } catch (err) {
    console.error('❌ Erreur lors de la copie du projet :', err);
  }
}

createProject();
