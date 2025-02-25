//import motion from "./src/motion.js"

const page = grid;
const settings = {
  displayGrid: false,
  column: 5,
  row: 3,
  rowGap: 3,
  columnGap: 5,
  marginTop: 20,
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 20,
};
let instance = {};
const images = new Array();

function preload() {
  loadImages(10);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  renderGrid();
  loadGUI();
}

function draw() {
  // noCursor()
  background('#F8F9FA');

  images.map((el) => {
    displayImage(el.src, page.getCell(el.x, el.y)[0]);
  });
  settings.displayGrid ? page.display() : null;
}

function mousePressed() {}

function renderGrid() {
  page.define({
    width: windowWidth - 15,
    height: windowHeight - 15,
    column: settings.column,
    row: settings.row,
    rowGap: settings.rowGap,
    columnGap: settings.columnGap,
    marginTop: settings.marginTop,
    marginLeft: settings.marginLeft,
    marginRight: settings.marginRight,
    marginBottom: settings.marginBottom,
  });
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
    .add(settings, 'column', 1, 30, 1)
    .name('Column')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'row', 1, 30, 1)
    .name('Row')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'rowGap', 1, 30, 1)
    .name('Gap Column')
    .onChange((value) => {
      renderGrid();
    });
  gui
    .add(settings, 'columnGap', 1, 30, 1)
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
    .add(settings, 'marginLeft')
    .name('Margin Left')
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
