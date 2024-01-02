//import motion from "./src/motion.js"

let instance = {
	pos: {
		x: 200,
		y: 230
	},
	size: {
		w: 300,
		h: 100
	},
	scale: 1,
	color: "#6472BA"
}

const sentence = "We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value."
const letters = sentence.split('')
const instLetter

function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(5)
	letter.map((l, index) => motion.to())

	motion.to(instance, { color: "#91E939" }, 3000)
	// console.log(motion.debug())
}

function draw() {
	background("#F8F9FA");
	// push()
	// beginClip()
	fill("#c0c0c0")
	noStroke()
	rect(200, 185, instance.size.w, 40)
	fill(instance.color)
	// endClip()

	textSize(20)
	letters.map((l, index) => text(l, instance.pos.x + index * 10, instance.pos.y, instance.size.w))
	//text(sentence, instance.pos.x, instance.pos.y, instance.size.w)
	// pop()
	motion.play()
	//console.log(motion.debug())
}

function mousePressed() {
	motion.to(instance, { color: getRandomHexColor() }, 3000)
	motion.to(instance.pos, { y: 200 }, 4000, { ease: "spring", strenght: 10, amplitude: 1.8 })
	//motion.to(instance.size, { w: 400 }, 1500, { ease: "spring", strenght: 10, amplitude: 1.3, delay: 4000 })
}

function getRandomHexColor() {
	// Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
	const randomColor = Math.floor(Math.random() * 16777216)
		.toString(16);

	// Pad the color with zeros if needed
	return `#${randomColor.padStart(6, '0')}`;
}
