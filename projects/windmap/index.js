import { animate } from 'https://cdn.skypack.dev/popmotion';
import { windmap } from './windmap.js';

const field = windmap({ width: 500, height: 800, columns: 50, rows: 30 });

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  field.create();
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  // field.displayGrid();
  // field.displayWinds();
  field.displayWindmap();
  // console.log(
  //   field.distanceToSegment({ x: mouseX, y: mouseY }, { x: 20, y: 30 }, { x: 200, y: 100 })
  // );

  if (mouseIsPressed) {
    push();
    stroke('#000');
    line(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
    pop();
  }
};

let newVectorWind = {};
window.mousePressed = function () {
  newVectorWind = createVector(mouseX, mouseY);
};

window.mouseReleased = function () {
  field.addWind(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
  field.create();
};
