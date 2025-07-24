import spline from './splineForge.js';

const settings = {
  strokeColor: '#46384c',
  strokeSize: 4,
  mouseIsPressed:{
    x:0,y:0
  },
  penPos:{
    x:0,
    y:0
  }
};

let isMouseOverGUI = false;

let points = new Array();
const drawPath = spline();
const drawing = [];

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  loadGUI();
};

window.draw = function () {
  background(color('#F3F9F7'));

  // if(keyIsDown && keyCode ===91){
  //   console.log("hello")
  //   console.log(dist(settings.mouseIsPressed.x,settings.mouseIsPressed.y,mouseX.mouseY))
  // }

  settings.penPos = {x:mouseX,y:mouseY}

  if(keyIsDown(91)){
    const mouseDist = dist(settings.mouseIsPressed.x,settings.mouseIsPressed.y,mouseX,mouseY)
    const penSize = round(map(mouseDist,0,1000,1,100,true))
    newCurve()
    settings.penPos = settings.mouseIsPressed
    settings.strokeSize=penSize
  }

  if (mouseIsPressed && !isMouseOverGUI) {
    // addPoint(mouseX, mouseY, 50);
    drawPath.add({ x: mouseX, y: mouseY });
  }

  

  drawing.map((el) => {
    el.draw();
  });

  drawPath.setStyle({ weight: settings.strokeSize, stroke: settings.strokeColor });
  drawPath.draw();

  if (!isMouseOverGUI) {
    noCursor( );
    push();
    noFill();
    stroke('#F00');
    strokeWeight(1);
    circle(settings.penPos.x, settings.penPos.y, settings.strokeSize, settings.strokeSize);
    pop();
  }
};

window.keyPressed = function(){
 settings.mouseIsPressed.x = mouseX
 settings.mouseIsPressed.y = mouseY
}

window.mousePressed = function () {
  newCurve()

};

function loadGUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.domElement.addEventListener('mouseenter', () => (isMouseOverGUI = true));
  gui.domElement.addEventListener('mouseleave', () => (isMouseOverGUI = false));

  gui.title('Stroke Control');

  gui.addColor(settings, 'strokeColor').name('Stroke');
  gui.add(settings, 'strokeSize', 0, 100).name('Size').listen();
}


function newCurve(){
  if(drawPath.getPoints().length>10){
    console.log(drawPath.getPoints().length)
    drawing.push(drawPath.clone());
    drawPath.clear();
  }
  console.log(drawing);
}
