//import motion from "./src/motion.js"

P5Capture.setDefaultOptions({
	format: "jpg",
	framerate: 30,
	quality: 1,
	width: 1080,
});

let gradient = {
	var1: {
		start: "#0E2431",
		end: "#ECEFF2"
	},
	var2: {
		start: "#F7F5FF",
		end: "#0A1E4C"
	}
}

function setup() {
	createCanvas((1080 / 4), (1920 / 4));
	createBoxes(1)

}

function draw() {
	background("#F8F9FA");
	boxes.map(el => drawBox(el.pos, el.size, el.pov, el.scale, "var2"))

	motion.play()

}

function keyPressed() {
	if(keyCode == 83) {
		boxes.map(el => motion.to(el, { scale: floor(random(10, 100)) }, 3000, { ease: "spring", strenght: 5, amplitude: 2, delay: random(0, 1000) }))
	}
}

function drawBox(pos, size, pov, depth, color) {
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
		fill(lerpHex(gradient[color].end, gradient[color].start, map(i, 0, depth, 0, 1)))
		rect(map(i, 0, depth, povX, 0), map(i, 0, depth, povY, 0), map(i, 0, depth, 0, size.w), map(i, 0, depth, 0, size.h))
	}
	pop()
	// line(0, 0, povX, povY)
	// line(0 + size.w, 0, povX, povY)
	// line(0, 0 + size.h, povX, povY)
	// line(0 + size.w, 0 + size.h, povX, povY)
	pop()
}

let boxes = new Array()

function createBoxes(quantity) {
	for(let i = 0; i < quantity; i++) {
		const posX = (width - (width / 2)) / 2
		const posY = (height - (height / 2)) / 2
		const w = width / 2
		const h = height / 2
		boxes.push({
			pos: {
				x: posX,
				y: posY
			},
			size: {
				w: w,
				h: h
			},
			scale: floor(10),
			color: "#6472BA",
			pov: {
				x: 50,
				y: 50
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
