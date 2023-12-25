//import motion from "./src/motion.js"

let instance = {
	pos: {
		x: 200,
		y: 200
	},
	size: {
		w: 50,
		h: 50
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(1)

}

function draw() {
	background("#F8F9FA");
	rectMode(CENTER)
	rect(instance.pos.x, instance.pos.y, instance.size.w, instance.size.h, 12);

	motion.motionHandler()
	//console.log(motion.debug())
}
