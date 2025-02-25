let src;
let preview;

function preload() {
  src = loadImage('./stairs-clean.jpg');
  src.loadPixels();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  src.loadPixels();
  preview = src.get();

  updateImg(0);
}

function draw() {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  updateImg(map(mouseX, 0, windowWidth, -255, 255, true));
  image(preview, 100, 100, 300, 400);
  debug.displayHistograme(150);
}

function mousePressed() {}

function updateImg(value) {
  // console.log(value);
  preview.loadPixels();

  for (let i = 0; i < src.pixels.length; i += 4) {
    preview.pixels[i] = src.pixels[i] + value;
    preview.pixels[i + 1] = src.pixels[i + 1] + value;
    preview.pixels[i + 2] = src.pixels[i + 2] + value;
    preview.pixels[i + 3] = 255;
  }

  preview.updatePixels();
}
