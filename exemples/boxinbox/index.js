//import motion from "./src/motion.js"


function setup() {
	createCanvas(windowWidth, windowHeight);
	//frameRate(5)
	//motion.to(instance, { color: "#91E939" }, 3000)
	// console.log(motion.debug())
	createBoxes(100)
}

function draw() {
	background("#F8F9FA");
	boxes.map(el => drawBox(el.pos, el.size, el.pov, el.scale))
	textSize(50)
	//textFont("Titillium Web")
	textFont("Josefin Sans")
	text('- Suis-je devenu fou ?', 100, 100)
	text('Oui je pense Chapelier.\n Mais je vais te dire un secret : la plupart des gens bien le sont.', 300, 200, 400)
	//drawBox(instance.pos, instance.size, instance.pov, 1.2)
	motion.play()
	//console.log(motion.debug())
}

function mousePressed() {
	//motion.to(instance, { color: getRandomHexColor() }, 3000)
	//motion.to(instance.size, { w: 400 }, 1500, { ease: "spring", strenght: 10, amplitude: 1.3, delay: 4000 })
	boxes.map(el => motion.to(el.pov, { x: random(0, 100), y: random(0, 100) }, 1500, { ease: "spring", strenght: 5, amplitude: 2, delay: random(0, 1000) }))

}

function drawBox(pos, size, pov, depth) {
	push()
	beginClip()
	rect(pos.x, pos.y, size.w, size.h)
	endClip()
	fill("#F8F9FA")
	stroke(0)
	rect(pos.x, pos.y, size.w, size.h)
	const offsetX = map(pov.x, 0, 100, -size.w / depth, size.w / depth) + pos.x
	const offsetY = map(pov.y, 0, 100, -size.h, size.h) + pos.y
	noFill()
	rect(offsetX, offsetY, size.w / depth, size.h / depth)
	line(pos.x, pos.y, offsetX, offsetY)
	line(pos.x + size.w, pos.y, offsetX + size.w / depth, offsetY)
	line(pos.x, pos.y + size.h, offsetX, offsetY + size.h / depth)
	line(pos.x + size.w, pos.y + size.h, offsetX + size.w / depth, offsetY + size.h / depth)
	pop()
}

let boxes = new Array()

function createBoxes(quantity) {
	for(let i = 0; i < quantity; i++) {
		const posX = random(20, windowWidth)
		const posY = random(20, windowHeight)
		const width = random(50, 200)
		const height = random(50, 200)
		boxes.push({
			pos: {
				x: posX,
				y: posY
			},
			size: {
				w: width,
				h: height
			},
			scale: random(0, 5),
			color: "#6472BA",
			pov: {
				x: random(0, 100),
				y: random(0, 100)
			}
		})
	}
}

function getRandomHexColor() {
	// Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
	const randomColor = Math.floor(Math.random() * 16777216)
		.toString(16);

	// Pad the color with zeros if needed
	return `#${randomColor.padStart(6, '0')}`;
}
