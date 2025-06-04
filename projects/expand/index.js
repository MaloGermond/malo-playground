//import motion from "./src/motion.js"

let instance = {
  opened: false,
  pos: {
    x: 200,
    y: 200,
  },
  size: {
    w: 50,
    h: 50,
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(1)
}

function draw() {
  background('#F8F9FA');
  rectMode(CENTER);
  rect(instance.pos.x, instance.pos.y, instance.size.w, instance.size.h);

  motion.motionHandler();
  //console.log(motion.debug())
}

function mousePressed() {
  openObject();
  moveObject();
}

function moveObject() {
  if (onMouseHover(instance.pos, instance.size)) {
    return;
  }
  motion.to(instance.pos, { x: mouseX, y: mouseY }, 800, 'easeOutBounce');
}

function openObject() {
  if (onMouseHover(instance.pos, instance.size)) {
    console.log('open');
    if (instance.opened) {
      motion.to(instance.size, { w: 50, h: 50 }, 500, 'easeOutBounce');
      instance.opened = false;
    } else {
      motion.to(instance.size, { w: 130, h: 230 }, 1300, 'easeInOutElastic');
      instance.opened = true;
    }
  }
}

function onMouseHover(pos, size) {
  if (
    mouseX > pos.x - size.w / 2 &&
    mouseX < pos.x + size.w / 2 &&
    mouseY > pos.y - size.h / 2 &&
    mouseY < pos.y + size.h
  ) {
    return true;
  }

  return false;
}
