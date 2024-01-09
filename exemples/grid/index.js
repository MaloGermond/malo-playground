//import motion from "./src/motion.js"

const page = grid

let instance = {}

function setup() {
	createCanvas(windowWidth, windowHeight);
	page.define({ width: windowWidth - 200, height: windowHeight - 200, column: 15, row: 7, rowGap: 4, columnGap: 4 })
}

function draw() {
	//page.define({ width: windowWidth - 200, height: windowHeight - 200, column: 20, row: 10, rowGap: map(mouseX, 0, windowWidth, 0, 20), columnGap: map(mouseY, 0, windowHeight, 0, 20) })
	background("#F8F9FA");
	page.display()
}

function mousePressed() {}
