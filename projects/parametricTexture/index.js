import { windmap, wind } from '/libraries/windmap/index.js';

const config = {
  width: 540,
  height: 540,
};
const field = windmap({ width: config.width, height: config.height, columns: 30, rows: 30 });

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

  field.setWinds(wind(10,20,20,400),wind(300, 300, mouseX, mouseY))

  field.getGrid().map((cell) => {
    const f = field.getWindForceAt(cell.center.x, cell.center.y);
    const d = map(f.angle, -PI, PI, 2, 10);
    displayHash(cell.x, cell.y, cell.width, cell.height, d, f.angle);
  });
};

function displayHash(x, y, width, height, density, angle) {
  if (density >= 200 || density <= 0) return;

  push();
  translate(x, y);
  beginClip();
  rect(0, 0, width, height);
  endClip();

  translate(width / 2, height / 2); // Centre du rectangle
  rotate(angle); // Rotation centrée
  translate(-width / 2, -height / 2); // Revenir au coin supérieur gauche du rect

  stroke('#000');
  for (let i = width * 1.5; i >= -width; i -= width / density) {
    line(i, -height, i, height * 1.5);
  }

  pop();
}

// let newVectorWind = {};
// window.mousePressed = function () {
//   newVectorWind = createVector(mouseX, mouseY);
// };

// window.mouseReleased = function () {
//   field.addWind(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
//   field.init();
// };
