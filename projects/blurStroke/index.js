import { windmap } from './windmap.js';
import { particuleSystem } from './particule.js';
import path from '/libraries/pathForge/index.js';

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
let wave = path();

let background_img;
let foreground;

window.setup = function () {
  createCanvas(config.width, config.height);
  field.init();
  background_img = createGraphics(config.width, config.height);
  foreground = createGraphics(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  // field.displayGrid();
  // field.displayWinds();
  field.displayWindmap();

  bubble.update();

  wave = path({ points: bubble.getparticules() });

  wave.draw({ ctx: foreground, strokeColor: '#9CACDF', weight: 20 });
  // foreground.push();
  // background_img.push();
  // foreground.noStroke();
  // background_img.noStroke();
  // bubble.draw((el) => {
  //   // const size = map(el.life, 0, 500, 100, 0);
  //   const size = 80;
  //   const sizeLight = size / 3;
  //   background_img.fill(0, 0, 0, 125);
  //   background_img.ellipse(el.x, el.y + sizeLight, sizeLight, sizeLight);
  //   background_img.fill('#9CACDF');
  //   background_img.ellipse(el.x, el.y, size, size);
  //   foreground.fill(256, 256, 256, 200);
  //   foreground.ellipse(el.x, el.y - sizeLight, sizeLight, sizeLight);
  // });
  // foreground.pop();
  // foreground.filter(BLUR, 2);
  // background_img.pop();
  // background_img.filter(BLUR, 1);

  push();

  stroke('#D0D0D0');
  fill('#FFF');
  rect(0, 0, 200, 200);
  // image(background_img, 0, 0, 200, 200);
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
    // bubble.add(mouseX, mouseY);
    bubble.addSpawn({ x: mouseX, y: mouseY, rate: 50 });
    // console.log(bubble.getParticles());
  }
};
