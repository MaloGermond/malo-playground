import { animate } from 'https://cdn.skypack.dev/popmotion';

window.setup = function () {
  createCanvas(500, 500);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  displayHash(200, 200, 200, 200, map(mouseX, 0, 500, 0, 100), map(mouseX, 0, 500, 0, 2 * PI));
};

function displayHash(x, y, width, height, density, angle) {
  if (density >= 200) return;
  translate(x, y);
  push();
  rotate(angle);
  translate(-width / 2, -height / 2);

  stroke('#000');
  // rect(0, 0, width, height);

  for (var i = width - 1; i >= 0; i -= width / density) {
    line(i, 0, i, height);
  }
  pop();
}
