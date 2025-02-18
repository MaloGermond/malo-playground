//import motion from "./src/motion.js"

let instance = {
  pos: {
    x: 200,
    y: 200,
  },
  size: {
    w: 100,
    h: 100,
  },
  color: '#6472BA',
  gradient: {
    start: getRandomHexColor(),
    end: getRandomHexColor(),
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(1)
  //motion.to(instance.pos, { x: 250, y: 400 }, 1200, "easeInOut")
  //motion.to(instance, { color: "#91E939" }, 3000)
}

function draw() {
  background('#F8F9FA');
  rectMode(CENTER);
  //fill(instance.color)
  noStroke();
  linearGradient(
    instance.pos.x,
    instance.pos.y,
    instance.pos.x + instance.size.w,
    instance.pos.y + instance.size.h,
    instance.gradient.start,
    instance.color
  );
  rect(instance.pos.x, instance.pos.y, instance.size.w, instance.size.h, 12);

  motion.motionHandler();
  //console.log(motion.debug())
}

function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(sX, sY, eX, eY);
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
  // drawingContext.strokeStyle = gradient;
}

function mousePressed() {
  motion.to(instance.gradient, { start: getRandomHexColor() }, 3000, { ease: 'easeInOut' });
  motion.to(instance.gradient, { end: getRandomHexColor() }, 2000);
}

function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
  const randomColor = Math.floor(Math.random() * 16777216).toString(16);

  // Pad the color with zeros if needed
  return `#${randomColor.padStart(6, '0')}`;
}
