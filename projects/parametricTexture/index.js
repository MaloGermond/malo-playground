import { windmap, wind } from '/libraries/windmap/index.js';
import { hslToHex } from '/libraries/utils/index.js';
import { particuleSystem } from '/libraries/particules/index.js';

const canvas = {
  width: 540,
  height: 540,
};

const config = {
  width: 300,
  height: 300,
  x: 120,
  y: 120,
  minDef: 1,
  maxDef: 5,
  magMax: 20,
  winds: [],
};

const settings = {
  followMouse: true,
  mouse: {
    px: undefined, // Previous mouse position
    py: undefined,
  },
};

// Et un autre champs pour l'affichage
const field = windmap({ width: config.width, height: config.height, columns: 30, rows: 20 });

// Il y a un champs pour le déplacement des points
const bubblesField = windmap({
  width: config.width,
  height: config.height,
  columns: 10,
  rows: 10,
});

const bubble = particuleSystem({
  lifespan: 500,
  speedLimit: 3,
  friction: 0.4,
  boundary: {
    width: config.width,
    height: config.height,
    behaviour: 'wrap',
    x: 0,
    y: 0,
  },
  getForce: (x, y) => {
    const force = bubblesField.getWindForceAt(x, y);
    return { x: force.vector.x, y: force.vector.y };
  },
});

window.setup = function () {
  createCanvas(canvas.width, canvas.height);

  // bubblesField.addWind(
  //   random(config.x, config.width),
  //   random(config.y, config.height),
  //   random(config.x, config.width),
  //   random(config.y, config.height)
  // );
  bubblesField.init();
  resetWinds(0);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  translate(config.x, config.y);
  push();
  // bubblesField.displayGrid();
  // bubblesField.displayWinds();
  bubblesField.displayWindmap();

  bubble.update();

  bubble.draw((el) => {
    const size = map(el.life, 0, 500, 100, 0);
    fill('#9CACDF');
    ellipse(el.x, el.y, 10, 10);
  });
  // displayParametricTexture();
  pop();
  displayDragMouse();
};

window.keyPressed = function () {
  if (key === 'n') {
    resetWinds(6);
  }
  if (key === 'r') {
    resetWinds(0);
  }

  if (key === 'b') {
    bubblesField.addWind(
      random(0, config.width),
      random(0, config.height),
      random(0, config.width),
      random(0, config.height)
    );
    bubblesField.init();
  }
  if (key === ' ') {
    bubble.add(relativeCanvas(mouseX, mouseY).x, relativeCanvas(mouseX, mouseY).y);
  }
};

window.mousePressed = function () {
  settings.mouse.px = mouseX;
  settings.mouse.py = mouseY;
};

window.mouseReleased = function () {
  if (!settings.mouse.px && !settings.mouse.py) return;

  const { px, py } = settings.mouse;

  const previous = relativeCanvas(px, py);
  const current = relativeCanvas();

  if (!settings.followMouse) {
    bubblesField.addWind(previous.x, previous.y, current.x, current.y);
    bubblesField.init();
  }
};

//
// Relative Mouse Management
//

function relativeCanvas(x = mouseX, y = mouseY) {
  return { x: x - config.x, y: y - config.y };
}

//
//  Winds management
//

function displayDragMouse() {
  if (!mouseIsPressed) {
    return;
  }
  const { px, py } = settings.mouse;

  const previous = relativeCanvas(px, py);
  const current = relativeCanvas();
  push();
  stroke(0);
  line(previous.x, previous.y, current.x, current.y);
  pop();
}

function resetWinds(length = 4) {
  const { winds } = config;
  winds.length = 0;
  for (let i = 0; i < length; i++) {
    winds.push(
      wind(
        random(config.x, config.width),
        random(config.y, config.height),
        random(config.x, config.width),
        random(config.y, config.height)
      )
    );
  }

  field.setWinds(...winds);
  field.init();
}

function displayParametricTexture() {
  // console.log(winds)

  if (settings.followMouse) {
    const current = relativeCanvas();
    field.setWinds(wind(config.width / 2, config.height / 2, current.x, current.y));
    field.init();
  }

  field.getGrid().map((cell) => {
    const f = field.getWindForceAt(cell.center.x, cell.center.y);
    const d = map(f.angle, -PI, PI, 0, 1);

    // displayHash(cell.x, cell.y, cell.width, cell.height, f, f.angle);

    displayColorDots(cell.x, cell.y, cell.width, cell.height, f, f.angle);
    // displayColorRect(cell.x, cell.y, cell.width, cell.height, f, f.angle)
  });

  // field.displayWinds();

  // field.displayWindmap();
  // field.displayGrid();

  // console.log(field.getWindmap());
}

function displayColorDots(x, y, width, height, force, angle) {
  push();
  translate(x + width / 2, y + height / 2);
  noStroke();
  rotate(angle);

  const offset = map(force.magnitude, 0, config.magMax, 0, width / 3, true);
  const size = map(force.magnitude, config.magMax, 0, width / 8, width, true);

  fill('#00F6FF');
  circle(0, offset, size, size);

  fill('#F600FF');
  circle(0, -offset, size, size);

  fill('#00F6FF80');
  circle(0, offset, size, size);

  pop();
}

function displayColorRect(x, y, width, height, force, angle) {
  const density = map(force.magnitude, 0, config.magMax, 0, 1, true);

  push();
  translate(x, y);
  rotate(angle);

  const hue = map(density, 0, 1, 100, 150);
  const sat = map(density, 0, 1, 1, 0.7);

  // const sat = 1
  // const light = 0.8
  const light = map(density, 0, 1, 0.6, 0.4);

  const col = hslToHex(hue, sat, light);
  stroke(col);
  noFill();
  rect(0, 0, width, height);

  pop();
}

function displayHash(x, y, width, height, force, angle) {
  const d = map(force.magnitude, 0, config.magMax, config.minDef, config.maxDef, true);

  push();
  translate(x, y);
  beginClip();
  rect(0, 0, width, height);
  endClip();

  translate(width / 2, height / 2); // Centre du rectangle
  rotate(angle); // Rotation centrée
  translate(-width / 2, -height / 2); // Revenir au coin supérieur gauche du rect

  stroke('#000');
  for (let i = width * 1.5; i >= -width; i -= width / d) {
    line(i, -height, i, height * 1.5);
  }

  pop();
}
