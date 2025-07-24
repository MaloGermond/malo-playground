import { windmap, wind } from '/libraries/windmap/index.js';
import { hslToHex } from '/libraries/utils/index.js';

const config = {
  width: 540,
  height: 540,
  minDef: 1,
  maxDef: 8
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

  // field.setWinds(wind(10,20,20,400),wind(300, 300, mouseX, mouseY))
  const f = [...winds,wind(posWindMouse.x,posWindMouse.y,mouseX,mouseY)]

  field.setWinds(...f);

  field.getGrid().map((cell) => {
    const f = field.getWindForceAt(cell.center.x, cell.center.y);
    const d = map(f.angle, -PI, PI, 0, 1);
    // displayHash(cell.x, cell.y, cell.width, cell.height, d, f.angle);
    displayColorRect(cell.x, cell.y, cell.width, cell.height, d, f.angle)
  });
};

function displayColorRect(x, y, width, height, density, angle){
  
  push();
  translate(x, y);
  noStroke()
  const hue = 150
  const sat = round(map(density,0,1,0.6,1,true),2)

  // const sat = 1
  // const light = 0.8
  const light = round(map(density,0,1,0.3,0.8,true),2)

  
  const col = hslToHex(hue,sat,light)
  fill(col)
  rect(0, 0, width, height);

  pop();

}

function displayHash(x, y, width, height, density, angle) {
  const d = map(density, 0,1,config.minDef,config.maxDef,true)


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

const winds = [];
const posWindMouse = {x:0,y:0}

window.keyPressed = function () {
  if (key === 'r') {
    winds.length = 0;
    for (let i = 0; i < round(random(1,4)); i++) {
      winds.push(wind(0, 0, random(0, window.width), random(0, window.height)));
    }

    // posWindMouse.x = random(0, window.width)
    // posWindMouse.y = random(0, window.height)
     posWindMouse.x = mouseX
    posWindMouse.y = mouseY

  }
};

// let newVectorWind = {};
// window.mousePressed = function () {
//   newVectorWind = createVector(mouseX, mouseY);
// };

// window.mouseReleased = function () {
//   field.addWind(newVectorWind.x, newVectorWind.y, mouseX, mouseY);
//   field.init();
// };
