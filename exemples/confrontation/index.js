//import motion from "./src/motion.js"

let instance = {
	pos: {
		x: 200,
		y: 200
	},
	size: {
		w: 200,
		h: 200
	},
	color: "#6472BA"
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(5)
	motion.to(instance.pos, { x: 500 }, 3000, { ease: "easeInOutElastic" })
	motion.to(instance, { color: "#91E939" }, 3000)
	motion.to(instance.pos, { y: 400 }, 3000, { ease: "easeInOut" })
	motion.to(instance, { color: "#F0F0F0" }, 1000)
	//console.log(motion.debug())
}

function draw() {
	background("#F8F9FA");
	rectMode(CENTER)
	noStroke()
	fill(instance.color)
	rect(instance.pos.x, instance.pos.y, instance.size.w, instance.size.h, 12);

	motion.motionHandler()
	//console.log(motion.debug())
}

function mousePressed() {
	motion.to(instance, { color: getRandomHexColor() }, 3000)
}

function getRandomHexColor() {
	// Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
	const randomColor = Math.floor(Math.random() * 16777216)
		.toString(16);

	// Pad the color with zeros if needed
	return `#${randomColor.padStart(6, '0')}`;
}
