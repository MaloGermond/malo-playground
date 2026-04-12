// import { animate } from 'https://cdn.skypack.dev/popmotion';

let myShader


window.setup = function () {
  createCanvas(windowWidth, windowHeight, WEBGL);
  myShader = loadShader('./shader.vert', './shader.frag');
  console.log(myShader)
};

window.draw = function () {
  background('#F3F9F7');
  shader(myShader);
  myShader.setUniform('myColor', [
  map(mouseX, 0, width, 0, 1, true), // Red
  map(mouseY, 0, width, 0, 1, true), // Green
  0, // Blue
  1 // Alpha
]);
  myShader.setUniform('time', millis());
  
  plane(100, 100,100,100);
};
