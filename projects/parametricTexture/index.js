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
  x: 100,
  y: 100,
  minDef: 1,
  maxDef: 5,
  magMax: 20,
};

// Et un autre champs pour l'affichage
const field = windmap({ width: config.width, height: config.height, columns: 30, rows: 30 });

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
    x: config.x,
    y: config.y,
  },
  getForce: (x, y) => {
    const force = bubblesField.getWindForceAt(x, y);
    return { x: force.vector.x, y: force.vector.y };
  },
});

window.setup = function () {
  createCanvas(canvas.width, canvas.height);

  bubblesField.addWind(
    random(config.x, config.width),
    random(config.y, config.height),
    random(config.x, config.width),
    random(config.y, config.height)
  );
  bubblesField.init();
  // resetWinds(6);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  translate(config.x, config.y);
  push();
  bubblesField.displayGrid();
  bubblesField.displayWinds();
  bubblesField.displayWindmap();

  bubble.update();

  bubble.draw((el) => {
    const size = map(el.life, 0, 500, 100, 0);
    fill('#9CACDF');
    ellipse(el.x, el.y, 10, 10);
  });
  // displayParametricTexture();
  pop();
};

const winds = [];
const posWindMouse = { x: 0, y: 0 };

window.keyPressed = function () {
  if (key === 'r') {
    posWindMouse.x = mouseX - config.x;
    posWindMouse.y = mouseY - config.y;
  }

  if (key === 'n') {
    resetWinds();
  }

  if (key === 'B') {
    bubblesField.addWind(
      random(0, config.width),
      random(0, config.height),
      random(0, config.width),
      random(0, config.height)
    );
    bubblesField.init();
  }
  if (key === 'b') {
    bubble.add(mouseX - config.x, mouseY - config.y);
  }
};

function resetWinds(length = 4) {
  winds.length = 0;
  for (let i = 0; i < length; i++) {
    winds.push(
      wind(
        random(0, window.width),
        random(0, window.height),
        random(0, window.width),
        random(0, window.height)
      )
    );
  }
}

function displayParametricTexture() {
  const f = [...winds, wind(posWindMouse.x, posWindMouse.y, mouseX - config.x, mouseY - config.y)];
  // const f= [...winds]
  field.setWinds(...f);

  // console.log(winds)

  field.getGrid().map((cell) => {
    const f = field.getWindForceAt(cell.center.x, cell.center.y);
    const d = map(f.angle, -PI, PI, 0, 1);

    displayHash(cell.x, cell.y, cell.width, cell.height, f, f.angle);

    // displayColorDots(cell.x, cell.y, cell.width, cell.height, f, f.angle);
    // displayColorRect(cell.x, cell.y, cell.width, cell.height, f, f.angle)
  });

  // field.displayWinds();

  // field.displayWindmap();
  // field.displayGrid();
  // field.displayWinds();
  // console.log(field.getWindmap());
}

function displayColorDots(x, y, width, height, force, angle) {
  push();
  translate(x + width / 2, y + height / 2);
  noStroke();
  rotate(angle);

  const offset = map(force.magnitude, 0, config.magMax, 0, width / 3, true);
  const size = map(force.magnitude, 0, config.magMax, width / 4, width, true);

  fill(255, 0, 0);
  circle(0, offset, size, size);

  fill(0, 0, 255);
  circle(0, -offset, size, size);

  fill(255, 0, 0, 125);
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
