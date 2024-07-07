//import motion from "./src/motion.js"

const pattern = generatePattern(100, 50, 10, 6)
let img
let halftone = new Array()

function preload() {
	img = loadImage('https://plus.unsplash.com/premium_photo-1669839774770-df5a3d2da257?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	halftone = generateHalftone(img, pattern)
	console.log(halftone)
}

function draw() {
	// noCursor()
	background("#F8F9FA");
	noFill()
	stroke(255, 0, 0)
	ellipseMode(CORNER)
	rect(0, 0, 20 * 5, 10 * 5)

	noFill()
	stroke(150)
	halftone.grid.map(el => {
		fill(el.color)
		circle(el.x, el.y, 5, 5)
	})

	// fill(img.get(mouseX + 0, mouseY + 300))
	// noStroke()
	// rect(0, 300, 100, 100)

	// image(img, 350, 0)
}

function generateHalftone(img, pattern) {
	// img.loadPixels()

	const grid = pattern.points.map(el => {
		const x = map(el.x, 0, pattern.cols, 0, img.width - 1, true)
		const y = map(el.y, 0, pattern.rows, 0, img.height - 1, true)

		const color = img.get(x, y)
		// const index = (y * img.width + x) * 4
		// console.log(x + "			" + y)
		// console.log(r)

		const output = {
			x: el.x,
			y: el.y,
			color: color,
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

	const pattern = {
		cols: cols,
		rows: rows,
		spacing: spacing,
		offset: offset,
		points: points
	}

	return pattern
}
