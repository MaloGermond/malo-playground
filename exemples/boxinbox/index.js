//import motion from "./src/motion.js"

const test = grid;

let instance = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(5)
  //motion.to(instance, { color: "#91E939" }, 3000)
  // console.log(motion.debug())
  createBoxes(5);
  instance = {
    pos: {
      x: 200,
      y: 200,
    },
    size: {
      w: 300,
      h: 400,
    },
    depth: 10,
    color: '#0E2431',
    pov: {
      x: random(0, 100),
      y: random(0, 100),
    },
  };
  test.set({ width: windowWidth - 200, height: windowHeight - 200 });
}

function draw() {
  background('#F8F9FA');
  //test.display()
  boxes.map((el) => drawBox(el.pos, el.size, el.pov, el.scale));
  // textSize(50)
  // // textFont("Titillium Web")
  // textFont("Josefin Sans")
  // text('- Suis-je devenu fou ?', 100, 100)
  // textSize(30)
  // text('Oui je pense Chapelier.\n Mais je vais te dire un secret : la plupart des gens bien le sont.', 300, 200, 400)
  //drawBox(instance.pos, instance.size, { x: mouseX, y: mouseY }, instance.depth)
  motion.play();
  //console.log(motion.debug())
}

function mousePressed() {
  //motion.to(instance.pov, { x: random(0, 100), y: random(0, 100) }, 1500, { ease: "spring", strenght: 5, amplitude: 2 })
  //console.log(instance.pov)
  boxes.map((el) =>
    motion.to(el.pov, { x: random(0, 100), y: random(0, 100) }, 1500, {
      ease: 'spring',
      strenght: 5,
      amplitude: 2,
      delay: random(0, 1000),
    })
  );
}

function drawBox(pos, size, pov, depth) {
  push();
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
    const posX = random(20, windowWidth);
    const posY = random(20, windowHeight);
    const width = random(50, 200);
    const height = random(50, 200);
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
