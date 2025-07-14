import { windmap } from './windmap.js';
import { particuleSystem } from './particule.js';

const config = {
  width: 500,
  height: 500,
};
const field = windmap({ width: config.width, height: config.height, columns: 50, rows: 30 });
const bubble = particuleSystem({
  lifespan: 500,
  speedLimit: 20,
  boundary: { width: config.width, height: config.height, behaviour: 'wrap', x: 0, y: 0 },
  getForce: (x, y) => {
    const force = field.getWindForceAt(x, y);
    return { x: force.vector.x, y: force.vector.y };
  },
});

let foreground;

window.setup = function () {
  createCanvas(config.width, config.height);
  field.init();
  foreground = createGraphics(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  // field.displayGrid();
  // field.displayWinds();
  field.displayWindmap();

  bubble.update();
  foreground.push();
  foreground.noStroke();
  bubble.draw((el) => {
    const size = map(el.life, 0, 500, 100, 0);
    foreground.fill('#9CACDF');
    foreground.ellipse(el.x, el.y, size, size);
    foreground.fill('#35437D');
    foreground.ellipse(el.x + size / 2, el.y, size / 2, size / 2);
  });
  foreground.pop();
  foreground.filter(BLUR, 2);

  push();

  stroke('#D0D0D0');
  fill('#FFFFFF');
  rect(0, 0, 200, 200);
  image(foreground, 0, 0, 200, 200);

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
    // bubble.addSpawn({ x: mouseX, y: mouseY, rate: 5 });
    // console.log(bubble.getParticles());
  }
};
