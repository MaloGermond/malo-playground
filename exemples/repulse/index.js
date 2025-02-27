//
//  SHADERS
//
//
//  Purpose of this place is to understand how works shaders
//

let src;
let preview;

function preload() {
  src = loadImage('./stairs-clean.jpg');
  src.loadPixels();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEGL);
}

function draw() {
  background('#F3F9F7'); //  Ajout d'un fond pour éviter les traînées
  debug.displayHistograme(150);
}

function mousePressed() {}

// Il se passe quoi si j'ai un tableau sous forme [pvector2 pos, pvector4 color]

function updateImg(value) {
  // console.log(value);
  //C'est le load et update pixels qui prends de la mémoire
  preview.loadPixels();

  for (let i = 0; i < src.pixels.length; i += 4) {
    preview.pixels[i] = src.pixels[i] + value;
    preview.pixels[i + 1] = src.pixels[i + 1] + value;
    preview.pixels[i + 2] = src.pixels[i + 2] + value;
    preview.pixels[i + 3] = 255;
  }

  preview.updatePixels();
}
