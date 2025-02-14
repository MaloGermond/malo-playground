//  Double-click to draw the contents of the graphics buffer.

let settings = {
  width: 500,
  height: 500,
  imageRatio: true,
  minDot: 0,
  maxDot: 1,
  offsetX: 5,
  offsetY: 5,
  offset: 5,
  dotSize: 5,
  grayscale: true,
  batchSize: 1000, // Taille du traitement par lot
  batchIndex: 0, // Stock l'étape (l'index) du traitement par lot
  distortion: 0 // Add random position to the dot
}

let pg;

function setup() {
 
  // Create the p5.Graphics object.
  pg = createGraphics(50, 50);

  // Draw to the graphics buffer.
  pg.background(100);

}

function draw(){
   createCanvas(windowWidth, windowHeight);

  clear();

  image(pg, 0, 0);
}

function mousePressed(){
  genImage()
}

function genImage(){
  const grid = generatePattern(100,100)
  console.log(grid)
  pg = createGraphics(windowWidth, windowHeight);
  grid.points.map(el=>{
    pg.circle(el.x,el.y,10,10)
  })
}

function generatePattern(cols = 50, rows = 50, spacingX = 10, spacingY = 10, offset = 1) {

  let points = [];

  for(let row = 0; row < rows + 2; row++) {
    for(let col = 0; col < cols + 2; col++) {
      // Calcul des coordonnées x et y
      let x = col * spacingX;
      let y = row * spacingY;

      // Add offset
      x += (row % offset) * (spacingX / offset);
      // Offset the row to stay in rectangle selection
      x -= spacingX

      points.push({ x: x, y: y });
    }
  }

  return {
    cols: cols,
    rows: rows,
    spacingX: spacingX,
    spacingY: spacingY,
    offset: offset,
    points: points
  }
}

