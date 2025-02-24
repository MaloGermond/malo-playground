//import motion from "./src/motion.js"

const page = grid;
const settings = {
  displayGrid: false,
};
let instance = {};
const images = new Array();

function preload() {
  loadImages(10);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  page.define({
    width: windowWidth - 15,
    height: windowHeight - 15,
    column: 5,
    row: 3,
    rowGap: 4,
    columnGap: 4,
  });
}

function draw() {
  // noCursor()
  background('#F8F9FA');

  images.map((el) => {
    displayImage(el.src, page.getCell(el.x, el.y)[0]);
  });
  settings.displayGrid ? page.display() : null;
}

function mousePressed() {
  settings.displayGrid = true;
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
