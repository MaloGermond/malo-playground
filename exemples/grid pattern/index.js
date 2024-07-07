//import motion from "./src/motion.js"

let output = {
	width: 200,
	height: 200,
	minDot: 0,
	maxDot: 10,
	offsetX: 5,
	offsetY: 5,
	offset: 1
}


let pattern = new Array
let img
let halftone = new Array()

function preload() {
	img = loadImage('./Mathou 1.png')
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	halphtone()
	console.log(halftone)
}

function draw() {
	// noCursor()
	background("#F8F9FA");

	// Emcombrement de du halftone generer
	noFill()
	stroke(255, 0, 0)
	ellipseMode(CORNER)
	rect(0, 0, output.width, output.height)

	noFill()
	stroke(150)
	halftone.grid.map(el => {
		const size = map(el.brightness, 0, 255, output.minDot, output.maxDot)
		noStroke()
		fill(el.color)
		circle(el.x, el.y, size, size)
	})


}

function halphtone() {
	const cols = output.width / output.offsetX
	const rows = output.height / output.offsetY

	pattern = generatePattern(cols, rows, output.offsetX, output.offsetY, output.offset)
	halftone = generateHalftoneMap(img, pattern)
}

function generateHalftoneMap(img, pattern) {
	// img.loadPixels()

	const grid = pattern.points.map(el => {
		const x = map(el.x, 0, pattern.cols * pattern.spacingX, 0, img.width - 1, true)
		const y = map(el.y, 0, pattern.rows * pattern.spacingY, 0, img.height - 1, true)

		const color = img.get(x, y)
		// const index = (y * img.width + x) * 4
		// console.log(x + "			" + y)

		const output = {
			x: el.x,
			y: el.y,
			color: color,
			brightness: brightness(color),
			imgX: x,
			imgY: y
		}

		return output
	})

	const halftone = {
		pattern: pattern,
		grid: grid
	}
	return halftone
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

	const pattern = {
		cols: cols,
		rows: rows,
		spacingX: spacingX,
		spacingY: spacingY,
		offset: offset,
		points: points
	}

	return pattern
}
