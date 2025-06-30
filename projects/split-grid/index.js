import { animate } from 'https://cdn.skypack.dev/popmotion';
import { grid } from '/libraries/grid/index.js';

const settings = {
  displayGrid: true,
  width: 700,
  height: 500,
  columns: ['fr', 'fr', 100, 'fr', 22.4, '10%', 'fr'],
  rows: ['5%', 'fr', 50, 'fr', '8%'],
  rowGap: 3,
  columnGap: 5,
  marginTop: 10,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
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

const guiActions = {
  addColumn: function () {
    settings.columns.push('fr');
    renderGrid();
  },
  addRow: function () {
    settings.rows.push('fr');
    renderGrid();
  },
};

function loadGUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.add(settings, 'displayGrid').name('Show grid');
  gui
    .add(settings, 'width', 1, 1000, 1)
    .name('Width')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'height', 1, 1000, 1)
    .name('Height')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui.add(guiActions, 'addColumn').name('New Column');
  gui.add(guiActions, 'addRow').name('New Row');
  gui
    .add(settings, 'rowGap', 0, 30, 1)
    .name('Gap Row')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'columnGap', 0, 30, 1)
    .name('Gap Column')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'marginTop')
    .name('Margin Top')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'marginRight')
    .name('Margin Right')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'marginBottom')
    .name('Margin Bottom')
    .onChange((value) => {
      g.setConfig(settings);
    });
  gui
    .add(settings, 'marginLeft')
    .name('Margin Left')
    .onChange((value) => {
      g.setConfig(settings);
    });
}
