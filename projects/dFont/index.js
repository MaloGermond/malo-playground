import { animate } from 'https://cdn.skypack.dev/popmotion';

const config = {
  width: 1000,
  height: 800,
  letter: {
    x: 100,
    y: 50,
    xHeight: 20,
    unitWidth: 300,
    ascender: 400,
    barHeight: 200,
    weight: 50,
    contrast: 4,
  },
};

window.setup = function () {
  createCanvas(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  const { x, y, unitWidth, ascender, weight, barHeight, xHeight, contrast } = config.letter;
  config.letter.unitWidth = mouseX - x >= 0 ? mouseX - x : 0;
  config.letter.ascender = height - mouseY;
  push();
  translate(x, config.height - y);
  noStroke();
  fill('#000');
  rect(0, 0, unitWidth, -ascender, 0, 0, unitWidth, unitWidth);

  fill('#fff');
  rect(weight, 0, unitWidth - 2 * weight, -ascender + weight, 0, 0, unitWidth, unitWidth);

  fill('#000');
  rect(0, -((xHeight * ascender) / 100), unitWidth, weight / contrast);
  pop();
};
