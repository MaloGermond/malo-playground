import { animate } from 'https://cdn.skypack.dev/popmotion';
import { windmap } from './windmap.js';
import { particleSystem } from './particule.js';

const field = windmap({ width: 500, height: 800, columns: 50, rows: 30 });
const bubble = particleSystem({
  lifespan: 1000,
  speedLimit: 20,
  boundary: { width: 500, height: 800, behaviour: 'wrap', x: 0, y: 0 },
  getForce: (x, y) => {
    const force = field.getWindForceAt(x, y);
    return { x: force.vector.x, y: force.vector.y };
  },
});

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
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
  fill('#0f0');
  bubble.draw((el) => {
    ellipse(el.x, el.y, 20, 20);
  });
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
    bubble.add(mouseX, mouseY);
    // console.log(bubble.getParticles());
  }
};
