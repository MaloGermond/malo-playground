async function setup() {
  createCanvas(windowWidth, windowHeight);
  memory.setName('users');
  await loadMemory();
  console.log('Loaded');
  GUI();
}

async function loadMemory() {
  try {
    let data = await memory.get('Alain');
    console.log('Memory Loaded:', data);
  } catch (error) {
    console.warn('Error loading memory:', error);
  }
  return;
}

function draw() {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
}

const GUIactions = {
  purge: function () {
    memory.clear();
  },
  create: function () {
    memory.set(setting.key, setting.value, setting.version);
  },
};

let setting = {
  version: 1,
  key: 'Martha',
  value: '31',
};

function GUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.add(GUIactions, 'purge').name('Purge DB');
  gui.add(GUIactions, 'create').name('Create');
  gui.add(setting, 'key').name('Key');
  gui.add(setting, 'value').name('Value');
  gui.add(setting, 'version', 1, 100, 1).name('Version');
}
