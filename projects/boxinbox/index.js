//import motion from "./src/motion.js"
import { animate, easeInOut } from 'https://cdn.skypack.dev/popmotion';

const test = grid;

let instance = {};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  //frameRate(5)
  //motion.to(instance, { color: "#91E939" }, 3000)
  // console.log(motion.debug())
  // createBoxes(5);
  instance = {
    pos: {
      x: 200,
      y: 200,
    },
    size: {
      w: 80,
      h: 200,
    },
    depth: 15,
    color: '#0E2431',
    pov: {
      x: random(0, 100),
      y: random(0, 100),
    },
  };
  // test.set({ width: windowWidth - 200, height: windowHeight - 200 });
};

window.draw = function () {
  background('#F8F9FA');
  // boxes.map((el) => drawBox(el.pos, el.size, el.pov, el.scale));
  drawBox({ pos: instance.pos, size: instance.size, pov: instance.pov, depth: instance.depth });
  motion.play();
  // console.log(motion.debug());
};

window.keyPressed = function () {
  // motion.to(instance.pov, { x: random(0, 100), y: random(0, 100) }, 1500, {
  //   ease: 'spring',
  //   strenght: 5,
  //   amplitude: 2,
  // });
  console.log({ keyCode });

  if (keyCode == 70) {
    animate({
      from: instance.pov.x,
      to: random(0, 100),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.pov.x = latest;
      },
    });

    animate({
      from: instance.pov.y,
      to: random(0, 100),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.pov.y = latest;
      },
    });
  }

  if (keyCode == 83) {
    animate({
      from: instance.size.w,
      to: random(40, 200),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.size.w = latest;
      },
    });
    animate({
      from: instance.size.h,
      to: random(40, 200),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.size.h = latest;
      },
    });
  }

  if (keyCode == 68) {
    animate({
      from: instance.depth,
      to: random(3, 20),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.depth = latest;
      },
    });
  }

  //console.log(instance.pov)
  // boxes.map((el) =>
  //   motion.to(el.pov, { x: random(0, 100), y: random(0, 100) }, 1500, {
  //     ease: 'spring',
  //     strenght: 5,
  //     amplitude: 2,
  //     delay: random(0, 1000),
  //   })
  // );
};

function drawBox({ pos, size, pov, depth }) {
  push();
  rectMode(CENTER);
  beginClip();
  rect(pos.x, pos.y, size.w, size.h);
  endClip();
  fill('#F8F9FA');
  //stroke(0)
  noStroke();
  //rect(pos.x, pos.y, size.w, size.h)

  // Calculate rectangle size when we apply depth
  const offsetW = map(depth, 0, 10, 0, size.w);
  const offsetH = map(depth, 0, 10, 0, size.h);

  // Allow a Point Of View (POV) offset to go father than inside the rectangle
  const offsetX = offsetW / 5;
  const offsetY = offsetH / 5;

  // Calculate the Point Of View (POV) postion.
  const povX = map(pov.x, 0, 100, -offsetX, size.w + offsetX);
  const povY = map(pov.y, 0, 100, -offsetY, size.h + offsetY);

  translate(pos.x, pos.y);

  push();
  for (let i = depth; i > 0; i--) {
    fill(lerpHex('#0E2431', '#ECEFF2', map(i, 0, depth, 0, 1)));
    rect(
      map(i, 0, depth, povX, 0),
      map(i, 0, depth, povY, 0),
      map(i, 0, depth, 0, size.w),
      map(i, 0, depth, 0, size.h)
    );
  }
  pop();
  // line(0, 0, povX, povY)
  // line(0 + size.w, 0, povX, povY)
  // line(0, 0 + size.h, povX, povY)
  // line(0 + size.w, 0 + size.h, povX, povY)
  pop();
}

let boxes = new Array();

function createBoxes(quantity) {
  for (let i = 0; i < quantity; i++) {
    const width = random(50, 200);
    const height = random(50, 200);
    const posX = random(20, windowWidth) - width / 2;
    const posY = random(20, windowHeight) - height / 2;

    // const width = 80;
    // const height = 200;
    // const posX = windowWidth / 2 - width / 2;
    // const posY = windowHeight / 2 - height / 2;

    boxes.push({
      pos: {
        x: posX,
        y: posY,
      },
      size: {
        w: width,
        h: height,
      },
      scale: floor(random(8, 15)),
      color: '#6472BA',
      pov: {
        x: random(0, 100),
        y: random(0, 100),
      },
    });
  }
}

function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
  const randomColor = Math.floor(Math.random() * 16777216).toString(16);

  // Pad the color with zeros if needed
  return `#${randomColor.padStart(6, '0')}`;
}
