import { windmap } from './windmap.js';
import { particuleSystem } from './particule.js';

const config = {
  width: 500,
  height: 500,
};
const field = windmap({ width: config.width, height: config.height, columns: 50, rows: 30 });
const bubble = particuleSystem({
  lifespan: 500,
  friction: 10,
  boundary: { width: config.width, height: config.height, behaviour: 'wrap', x: 0, y: 0 },
  getForce: (x, y) => {
    const force = field.getWindForceAt(x, y);
    return { x: force.vector.x, y: force.vector.y };
  },
});

window.setup = function () {
  createCanvas(config.width, config.height);
  field.init();
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  // field.displayGrid();
  // field.displayWinds();
  field.displayWindmap();

  bubble.update();
  push();
  noStroke();
  bubble.draw((el) => {
    const size = map(el.life, 0, 500, 100, 0);
    fill('#9CACDF');
    ellipse(el.x, el.y, size, size);
  });
  pop();

  push();

  pop();
  // console.log(
  //   field.distanceToSegment({ x: mouseX, y: mouseY }, { x: 20, y: 30 }, { x: 200, y: 100 })
  // );

  if (mouseIsPressed) {
    push();
    stroke('#000');
    line(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
    pop();
  }

  if (keyIsDown(16)) {
    const force = field.getWindForceAt(mouseX, mouseY);
    push();
    translate(mouseX, mouseY);
    rotate(force.angle);
    stroke('#f00');
    line(0, 0, force.magnitude, 0);
    pop();
  }
};

let newVectorWind = {};
window.mousePressed = function () {
  newVectorWind = createVector(mouseX, mouseY);
};

window.mouseReleased = function () {
  field.addWind(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
  field.init();
};

window.keyPressed = function () {
  console.log({ keyCode });

  if (keyCode === 32) {
    // bubble.add(mouseX, mouseY);
    bubble.addSpawn({ x: mouseX, y: mouseY, rate: 20 });
    // console.log(bubble.getParticles());
  }
};
