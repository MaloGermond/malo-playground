import { randomHex } from '/libraries/utils/index.js';
import { animate } from 'https://cdn.skypack.dev/popmotion';
window.setup = function () {
  createCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  fill(color);
  rect(posX, posY, 200, 200);
};

let color = '#009B77';
let posX = 0;
let posY = 0;

window.mousePressed = function () {
  animate({
    from: color,
    to: randomHex(),
    stiffness: 300,
    onUpdate: (latest) => {
      color = latest;
    },
  });
  animate({
    from: posX,
    to: random(0, windowWidth),
    damping: 50,
    onUpdate: (latest) => {
      posX = latest;
    },
  });
  animate({
    from: posY,
    to: random(0, windowHeight),
    mass: 100,
    delay: 200,
    onUpdate: (latest) => {
      posY = latest;
    },
  });
};
