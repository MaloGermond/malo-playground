//import motion from "./src/motion.js"

const sentences = "La plupart des gens bien le sont."

const group = new Array()

function setup() {
	createCanvas(windowWidth, windowHeight);
	createGroup(20)
}

function draw() {
	background("#F8F9FA");
	beginClip()
	rect(100, 0, 200, 300)
	endClip()
	textSize(20)
	group.map(el => {
		text(sentences, el.x, el.y)
	})

}

function mousePressed() {

}

function createGroup(size) {

	for(let i = 0; i < size; i++) {
		group.push({
			x: i * 10,
			y: i * 18
		})
	}

}
