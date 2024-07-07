//import motion from "./src/motion.js"

const pattern = generatePattern(20, 10, 15, 8)

function preload() {

}

function setup() {
	createCanvas(windowWidth, windowHeight);

}

function draw() {
	// noCursor()
	background("#F8F9FA");
	noFill()
	stroke(255, 0, 0)
	ellipseMode(CORNER)
	rect(0, 0, 20 * 15, 10 * 15)

	noFill()
	stroke(0)
	pattern.map(el => circle(el.x, el.y, 10, 10))
}



function generatePattern(cols, rows, spacing, offset = 1) {

	let points = [];

	for(let row = 0; row < rows + 1; row++) {
		for(let col = 0; col < cols + 1; col++) {
			// Calcul des coordonnées x et y
			let x = col * spacing;
			let y = row * spacing;

			// Add offset
			x += (row % offset) * (spacing / offset);
			// Offset the row to stay in rectangle selection
			x -= spacing

			points.push({ x: x, y: y });
		}
	}

	return points
}
