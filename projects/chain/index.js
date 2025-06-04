//import motion from "./src/motion.js"

let instance = {
  pos: {
    x: 250,
    y: 250,
  },
  size: {
    w: 100,
    h: 100,
  },
  scale: 1,
  color: '#6472BA',
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(5)
  motion.to(instance, { color: '#91E939' }, 3000);
  // console.log(motion.debug())
}

function draw() {
  background('#F8F9FA');
  rectMode(CENTER);
  noStroke();
  fill(instance.color);
  rect(
    instance.pos.x,
    instance.pos.y,
    instance.size.w * instance.scale,
    instance.size.h * instance.scale,
    12
  );

  motion.play();
  //console.log(motion.debug())
}

function mousePressed() {
  motion.to(instance, { color: getRandomHexColor() }, 3000);
  motion.to(instance, { scale: 2 }, 800, { ease: 'spring', strenght: 13, amplitude: 1.1 });
  motion.to(instance, { scale: 3 }, 800, {
    ease: 'spring',
    strenght: 13,
    amplitude: 1.1,
    delay: 1000,
  });
  motion.to(instance, { scale: 1 }, 1200, {
    ease: 'spring',
    strenght: 10,
    amplitude: 1.3,
    delay: 2000,
  });
}

function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
  const randomColor = Math.floor(Math.random() * 16777216).toString(16);

  // Pad the color with zeros if needed
  return `#${randomColor.padStart(6, '0')}`;
}
