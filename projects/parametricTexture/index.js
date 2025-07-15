import { windmap } from '/libraries/windmap/index.js';

const config = {
  width: 500,
  height: 500,
};
const field = windmap({ width: config.width, height: config.height, columns: 20, rows: 20 });

window.setup = function () {
  createCanvas(config.width, config.height);
  field.init();
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  // field.displayWindmap();
  // field.displayGrid();
  // field.displayWinds();
  // console.log(field.getWindmap());
  field.getGrid().map((cell) => {
    const f = field.getWindForceAt(cell.center.x, cell.center.y);
    const d = map(f.angle, -PI, PI, 2, 20);
    displayHash(cell.x, cell.y, cell.width, cell.height, d, f.angle);
  });
};

function displayHash(x, y, width, height, density, angle) {
  if (density >= 200 || density <= 0) return;

  push();
  translate(x, y);
  // beginClip();
  // rect(0, 0, width, height);
  // endClip();

  // translate(-width / 2, -height / 2);
  // rotate(angle);
  stroke('#000');
  for (var i = width - 1; i >= 0; i -= width / density) {
    line(i, 0, i, height);
  }

  pop();
}

let newVectorWind = {};
window.mousePressed = function () {
  newVectorWind = createVector(mouseX, mouseY);
};

window.mouseReleased = function () {
  field.addWind(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
  field.init();
};
