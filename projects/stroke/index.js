import spline from './splineForge.js';

const settings = {
  strokeColor: '#46384c',
  strokeSize: 4,
};

let points = new Array();
const drawPath = spline();
const drawing = [];

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  loadGUI();
};

window.draw = function () {
  background(color('#F3F9F7'));
  if (mouseIsPressed) {
    // addPoint(mouseX, mouseY, 50);
    drawPath.add({ x: mouseX, y: mouseY });
  }

  push();
  noFill();
  stroke('#F00');
  strokeWeight(1);
  circle(mouseX, mouseY, settings.strokeSize, settings.strokeSize);
  pop();
  drawing.map((el) => {
    el.draw();
  });

  drawPath.setStyle({ weight: settings.strokeSize, stroke: settings.strokeColor });
  drawPath.draw();

  // if (points.length > 60) {
  //   points = points.slice(1);
  // }

  // drawCurve(points, 20, 50, '#F3F9F7', '#3C615A');
};

window.mousePressed = function () {
  drawing.push(drawPath.clone());
  drawPath.clear();
  console.log(drawing);
};

function loadGUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.title('Stroke Control');

  gui.addColor(settings, 'strokeColor').name('Stroke');
  gui.add(settings, 'strokeSize', 0, 100).name('Size');
}

function addPoint(x, y, d) {
  const distance = dist(points[points.length - 1].x, points[points.length - 1].y, x, y);
  if (distance > d) {
    points.push(createVector(x, y));
  }
}
function drawCurve(points, swStart, swEnd, cStart, cEnd) {
  noFill();
  strokeWeight(swStart);
  stroke(cStart);
  curve(
    points[0].x,
    points[0].y,
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y
  );
  for (let p = 0; p < points.length - 3; p++) {
    const progress = strokeWeight(map(p, 0, points.length - 3, swStart, swEnd));
    stroke(lerpColor(color(cStart), color(cEnd), map(p, 0, points.length - 3, 0, 1)));
    curve(
      points[p].x,
      points[p].y,
      points[p + 1].x,
      points[p + 1].y,
      points[p + 2].x,
      points[p + 2].y,
      points[p + 3].x,
      points[p + 3].y
    );
  }
  strokeWeight(swEnd);
  stroke(cEnd);
  curve(
    points[points.length - 3].x,
    points[points.length - 3].y,
    points[points.length - 2].x,
    points[points.length - 2].y,
    points[points.length - 1].x,
    points[points.length - 1].y,
    points[points.length - 1].x,
    points[points.length - 1].y
  );
}
