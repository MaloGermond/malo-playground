import { animate } from 'https://cdn.skypack.dev/popmotion';
import { windmap } from './windmap.js';

const field = windmap({ columns: 5, rows: 2 });

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  field.create();
  field.addWind(20, 30, 200, 100);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  field.displayGrid();
  field.displayWinds();
};
