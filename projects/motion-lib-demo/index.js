import { hexToHsl } from '/libraries/utils/index.js';
console.log('script has been load');

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  console.log('P5js has been load');
  console.log(hexToHsl('#123456'));
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
};
