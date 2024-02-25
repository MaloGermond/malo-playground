//import motion from "./src/motion.js"

const page = grid

let instance = {}

function setup() {
	createCanvas(windowWidth, windowHeight);
	page.define({ width: windowWidth - 200, height: windowHeight - 200, column: 15, row: 7, rowGap: 4, columnGap: 4 })
}

function draw() {
	noCursor()
	//page.define({ width: windowWidth - 200, height: windowHeight - 200, column: 20, row: 10, rowGap: map(mouseX, 0, windowWidth, 0, 20), columnGap: map(mouseY, 0, windowHeight, 0, 20) })
	background("#F8F9FA");
	page.getCell(mouseX, mouseY)
		.map(el => {
			//fill(150, 0, 0)
			//rect(el.position.x, el.position.y, el.width, el.height)
			drawBox({ x: el.position.x, y: el.position.y }, { w: el.width, h: el.height }, { x: map(mouseX, el.position.x, el.position.x + el.width, 0, 100), y: map(mouseY, el.position.y, el.position.y + el.height, 0, 100) }, 20)
		})
	page.display()
}

function mousePressed() {}

function drawBox(pos, size, pov, depth) {
	push()
	beginClip()
	rect(pos.x, pos.y, size.w, size.h)
	endClip()
	fill("#F8F9FA")
	//stroke(0)
	noStroke()
	//rect(pos.x, pos.y, size.w, size.h)

	// Calculate rectangle size when we apply depth
	const offsetW = map(depth, 0, 10, 0, size.w)
	const offsetH = map(depth, 0, 10, 0, size.h)

	// Allow a Point Of View (POV) offset to go father than inside the rectangle
	const offsetX = offsetW / 5
	const offsetY = offsetH / 5

	// Calculate the Point Of View (POV) postion.
	const povX = map(pov.x, 0, 100, -offsetX, size.w + offsetX)
	const povY = map(pov.y, 0, 100, -offsetY, size.h + offsetY)



	translate(pos.x, pos.y)

	push()
	for(let i = depth; i > 0; i--) {
		fill(lerpHex("#0E2431", "#ECEFF2", map(i, 0, depth, 0, 1)))
		rect(map(i, 0, depth, povX, 0), map(i, 0, depth, povY, 0), map(i, 0, depth, 0, size.w), map(i, 0, depth, 0, size.h))
	}
	pop()
	// line(0, 0, povX, povY)
	// line(0 + size.w, 0, povX, povY)
	// line(0, 0 + size.h, povX, povY)
	// line(0 + size.w, 0 + size.h, povX, povY)
	pop()
}
