import { animate } from 'https://cdn.skypack.dev/popmotion';
import { windmap } from './windmap.js';

const field = windmap({ columns: 5, rows: 2 });

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  field.addWind(20, 30, 200, 100);
  field.addWind(230, 190, 180, 160);
  field.create();
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  field.displayGrid();
  field.displayWinds();
  field.displayWindmap();
  // console.log(
  //   field.distanceToSegment({ x: mouseX, y: mouseY }, { x: 20, y: 30 }, { x: 200, y: 100 })
  // );
};
