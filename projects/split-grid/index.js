import { animate, easeInOut } from 'https://cdn.skypack.dev/popmotion';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import { grid } from '/libraries/grid/index.js';

const settings = {
  displayGrid: true,
  width: 700,
  height: 500,
  columns: ['fr', 'fr', 100, 'fr', 22.4, '10%', 'fr'],
  rows: ['5%', 'fr', 50, 'fr', '8%'],
  rowGap: 3,
  columnGap: 5,
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
};

const g = grid(settings);

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  loadGUI();
  g.computeGrid();
  g.setConfig(settings);
  console.log(g);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  g.display();
};

window.mousePressed = function () {
  console.log(g.getCell(mouseX, mouseY));
};

function animSetting(el, to) {
  animate({
    from: getNestedValue(g.config, el),
    to: to,
    duration: 300,
    ease: easeInOut,
    onUpdate: (latest) => {
      g.setConfig({ [el]: latest });
    },
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => {
    return acc ? acc[key] : undefined;
  }, obj);
}

const guiActions = {
  addColumn: function () {
    settings.columns.push('fr');
    g.setConfig(settings);
  },
  addRow: function () {
    settings.rows.push('fr');
    g.setConfig(settings);
  },
};

function loadGUI() {
  const gui = new GUI();

  gui.add(settings, 'displayGrid').name('Show grid');
  gui
    .add(settings, 'width', 1, 1000, 1)
    .name('Width')
    .onChange((value) => {
      animSetting('width', value);
    });
  gui
    .add(settings, 'height', 1, 1000, 1)
    .name('Height')
    .onChange((value) => {
      animSetting('height', value);
    });
  gui.add(guiActions, 'addColumn').name('New Column');
  gui.add(guiActions, 'addRow').name('New Row');
  gui
    .add(settings, 'rowGap', 0, 30, 1)
    .name('Gap Row')
    .onChange((value) => {
      animSetting('rowGap', value);
    });
  gui
    .add(settings, 'columnGap', 0, 30, 1)
    .name('Gap Column')
    .onChange((value) => {
      animSetting('columnGap', value);
    });
  gui
    .add(settings.margin, 'top')
    .name('Margin Top')
    .onChange((value) => {
      animSetting('margin.top', value);
    });
  gui
    .add(settings.margin, 'right')
    .name('Margin Right')
    .onChange((value) => {
      animSetting('margin.right', value);
    });
  gui
    .add(settings.margin, 'bottom')
    .name('Margin Bottom')
    .onChange((value) => {
      animSetting('margin.bottom', value);
    });
  gui
    .add(settings.margin, 'left')
    .name('Margin Left')
    .onChange((value) => {
      animSetting('margin.left', value);
    });
}
