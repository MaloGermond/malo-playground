//import motion from "./src/motion.js"

let instance = {
	pos: {
		x: 200,
		y: 200
	},
	size: {
		w: 50,
		h: 50
	},
	color: "#6472BA"
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(1)
	motion.to(instance.pos, { x: 250, y: 400 }, 1200, { ease: "easeInOut" })
	motion.to(instance, { color: "#91E939" }, 3000)

}

function draw() {
	background("#F8F9FA");
	rectMode(CENTER)
	fill(instance.color)
	rect(instance.pos.x, instance.pos.y, instance.size.w, instance.size.h, 12);

	motion.motionHandler()
	//console.log(motion.debug())
}
