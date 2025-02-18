let points = new Array();

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 4; i++) {
    points.push(createVector(random(0, 400), random(0, 400)));
  }

  //strokeWeight(20);
  //points.map((p) => {
  //  ellipse(p.x, p.y, 10, 10);
  //});
}

function draw() {
  background(color('#F3F9F7'));
  addPoint(mouseX, mouseY, 50);

  if (points.length > 60) {
    points = points.slice(1);
  }

  drawCurve(points, 20, 50, '#F3F9F7', '#3C615A');
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
