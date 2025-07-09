//import motion from "./src/motion.js"
import { animate, easeInOut } from 'https://cdn.skypack.dev/popmotion';
import { hexToHsl, hslToHex } from '/libraries/utils/index.js';

/// Maintenant que c'est fait je réalise qu'il faudrait passer ca sous forme de module pour pouvoir l'appeler plus facilement... arf

const test = grid;

let instance = {};

const setting = {
  size: {
    min: { w: 100, h: 100 },
    max: { w: 400, h: 400 },
  },
};

window.setup = function () {
  createCanvas(1080 / 2, 1080 / 2);
  //frameRate(5)
  //motion.to(instance, { color: "#91E939" }, 3000)
  // console.log(motion.debug())
  // createBoxes(5);
  instance = {
    pos: {
      x: width / 2,
      y: height / 2,
    },
    size: {
      w: 300,
      h: 300,
    },
    depth: 15,
    colorForeground: '#0E2431',
    colorBackground: 'ECEFF2',
    pov: {
      x: 0,
      y: 0,
    },
  };

  // test.set({ width: windowWidth - 200, height: windowHeight - 200 });
};

window.draw = function () {
  background('#F8F9FA');
  // boxes.map((el) => drawBox(el.pos, el.size, el.pov, el.scale));
  drawBox({
    pos: instance.pos,
    size: instance.size,
    pov: instance.pov,
    depth: instance.depth,
    background: instance.colorBackground,
    foreground: instance.colorForeground,
  });
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
      to: random(-100, 100),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.pov.x = latest;
      },
    });

    animate({
      from: instance.pov.y,
      to: random(-100, 100),
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
      to: random(setting.size.min.w, setting.size.max.w),
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.size.w = latest;
      },
    });
    animate({
      from: instance.size.h,
      to: random(setting.size.min.h, setting.size.max.h),
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

  if (keyCode == 67) {
    animate({
      from: hexToHsl(instance.colorForeground).h,
      to: random(0, 255),
      duration: 1500,
      onUpdate: (latest) => {
        const cForeground = hslToHex(latest, 0.6, 0.9);
        const cbackground = hslToHex(latest, 0.1, 0.1);
        instance.colorForeground = cForeground;
        instance.colorBackground = cbackground;
      },
    });
  }

  if (keyCode == 71) {
    animate({
      from: instance.size.w,
      to: 1080 / 2,
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.size.w = latest;
      },
    });
    animate({
      from: instance.size.h,
      to: 1920 / 2,
      duration: 1500,
      ease: easeInOut,
      onUpdate: (latest) => {
        instance.size.h = latest;
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

function drawBox({ pos, size, pov, depth, background, foreground }) {
  push();
  rectMode(CENTER);
  beginClip();
  rect(pos.x, pos.y, size.w, size.h);
  endClip();
  fill('#F8F9FA');
  //stroke(0)
  noStroke();
  //rect(pos.x, pos.y, size.w, size.h)

  // Offset the focal point (POV) to be able to go outside the main frame.
  const offsetX = 20;
  const offsetY = 20;

  // Calculate the Point Of View (POV) postion.
  const povX = map(pov.x, -100, 100, -size.w / 2 - offsetX, size.w / 2 + offsetX);
  const povY = map(pov.y, -100, 100, -size.h / 2 - offsetY, size.h / 2 + offsetY);

  translate(pos.x, pos.y);

  push();
  for (let i = depth; i > 0; i--) {
    fill(lerpHex(background, foreground, map(i, 0, depth, 0, 1)));
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

function toHexColor(inputColor) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = inputColor; // CSS parser convertit
  const computed = ctx.fillStyle;

  // Si déjà hex
  if (computed.startsWith('#')) {
    if (computed.length === 4) {
      // Format #rgb → #rrggbb
      return '#' + computed[1].repeat(2) + computed[2].repeat(2) + computed[3].repeat(2);
    }
    return computed;
  }

  // Si rgb ou rgba → extraire et convertir
  const rgb = computed.match(/\d+/g).map(Number);
  return (
    '#' +
    rgb
      .slice(0, 3) // ignore alpha
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}
