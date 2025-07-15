import spline from './splineForge.js';

let points = new Array();
const drawPath = spline();

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
};

window.draw = function () {
  background(color('#F3F9F7'));
  if (mouseIsPressed) {
    // addPoint(mouseX, mouseY, 50);
    drawPath.add({ x: mouseX, y: mouseY });
  }

  drawPath.draw({ weight: 20 });

  // if (points.length > 60) {
  //   points = points.slice(1);
  // }

  // drawCurve(points, 20, 50, '#F3F9F7', '#3C615A');
};

window.mousePressed = function () {
  drawPath.clear();
};

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
