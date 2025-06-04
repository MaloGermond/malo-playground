//
//  GRID SHOWCASE
//
//
//  Here's a demonstration of what's possible with grid lib
//

//import motion from "./src/motion.js"

const settings = {
  displayGrid: true,
  width: 700,
  height: 500,
  columns: ['fr', 'fr', 100, 'fr', 22.4, '10%', 'fr'],
  rows: ['5%', 'fr', 50, 'fr', '5%'],
  rowGap: 3,
  columnGap: 5,
  marginTop: 10,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
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

let instance = {};
const images = new Array();

function preload() {
  // loadImages(10);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  renderGrid();
  loadGUI();
}

function draw() {
  // noCursor()
  background('#F8F9FA');

  // images.map((el) => {
  //   displayImage(el.src, grid.getCell(el.x, el.y)[0]);
  // });
  settings.displayGrid ? grid.display() : null;
  // console.log(grid.getCell(mouseX, mouseY));
  debug.displayHistograme(150);
}

function mousePressed() {
  // loadImages(10);
}

function renderGrid() {
  grid.create(settings);
}

function loadImages(size) {
  for (let i = 0; i < size; i++) {
    images.push({
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      src: loadImage('https://picsum.photos/' + round(random(300, 400))),
    });
  }
}

function displayImage(img, settings) {
  if (settings == undefined) {
    return;
  }
  // console.log(settings)
  push();
  beginClip();
  rect(settings.position.x, settings.position.y, settings.width, settings.height);
  endClip();
  image(img, settings.position.x, settings.position.y, img.width, img.height);
  pop();
}

function loadGUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.add(settings, 'displayGrid').name('Show grid');
  gui
    .add(settings, 'width', 1, 1000, 1)
    .name('Width')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'height', 1, 1000, 1)
    .name('Height')
    .onChange((value) => {
      renderGrid();
    });
  gui.add(guiActions, 'addColumn').name('New Column');
  gui.add(guiActions, 'addRow').name('New Row');
  gui
    .add(settings, 'rowGap', 0, 30, 1)
    .name('Gap Row')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'columnGap', 0, 30, 1)
    .name('Gap Column')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'marginTop')
    .name('Margin Top')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'marginRight')
    .name('Margin Right')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'marginBottom')
    .name('Margin Bottom')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'marginLeft')
    .name('Margin Left')
    .onChange((value) => {
      renderGrid();
    });
}
