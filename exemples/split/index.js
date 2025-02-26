const instance = {
  x: 100,
  y: 100,
  width: 200,
  height: 300,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
  displayShape(instance.x, instance.y, instance.width, instance.height);
  displayGuide(instance, mouseX, mouseY);
}

function displayShape(x, y, w, h) {
  noFill();
  stroke('#F48200');
  rect(x, y, w, h);
  //line(x, 0, x, windowHeight);
  //line(0, y, windowWidth, y);
}

function displayGuide(instance, x, y) {
  const direction = getOrientationSplit(instance, x, y);
  switch (direction) {
    case 'vertical':
      line(x, 0, x, windowHeight);
      break;
    case 'horizontal':
      line(0, y, windowWidth, y);
      break;
    case 'default':
  }
}

function split(instance, x, y) {
  const direction = getOrientationSplit(instance, x, y);
  switch (direction) {
    case 'vertical':
      // split in two vertical rect
      break;
    case 'horizontal':
      // split in two horizontal rect
      break;
    case 'default':
  }
}

function getOrientationSplit(instance, x, y) {
  if (
    x > instance.x &&
    y > instance.y &&
    x < instance.x + instance.width &&
    y < instance.y + instance.height
  ) {
    return 'inner';
  }
  if (x > instance.x && x < instance.x + instance.width) {
    return 'vertical';
  }
  if (y > instance.y && y < instance.y + instance.height) {
    return 'horizontal';
  }
}
