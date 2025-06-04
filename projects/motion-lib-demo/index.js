import { hexToHsl, hslToHex, lerpHex } from '/libraries/utils/index.js';

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
};
