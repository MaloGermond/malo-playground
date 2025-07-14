import { animate } from 'https://cdn.skypack.dev/popmotion';

const config = {
  width: 500,
  height: 500,
  letter: {
    x: 100,
    y: 480,
    xHeight: 300,
    unitWidth: 300,
    ascender: 400,
    barHeight: 200,
    weight: 50,
  },
};

window.setup = function () {
  createCanvas(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  noStroke();
  fill('#000');
  rect(
    config.letter.x,
    config.letter.y,
    config.letter.unitWidth,
    -config.letter.ascender,
    0,
    0,
    config.letter.unitWidth,
    config.letter.unitWidth
  );

  fill('#fff');
  rect(
    config.letter.x + config.letter.weight,
    config.letter.y,
    config.letter.xHeight - 2 * config.letter.weight,
    -config.letter.xHeight - config.letter.weight,
    0,
    0,
    config.letter.unitWidth,
    config.letter.unitWidth
  );
};
