//import motion from "./src/motion.js"

let settings = {
	width: 500,
	height: 500,
	imageRatio: true,
	minDot: 0,
	maxDot: 1,
	offsetX: 5,
	offsetY: 5,
	offset: 5,
	dotSize: 5,
	grayscale: true,
	batchSize: 1000, // Taille du traitement par lot
	batchIndex: 0, // Stock l'étape (l'index) du traitement par lot
	distortion: 0 // Add random position to the dot
}

let pattern = new Array
let img
let render
let halftoneGrid = new Array()

function preload() {
	img = loadImage('./Mathou 1.png')
	loadGUI()
}

function setup() {
	const canvas = createCanvas(settings.width, settings.height);
	halftone()

	// console.log(halftone)

	canvas.drop(handleDrop);

	halftone()

}

function draw() {
	// noCursor()
	clear();

	noFill()
	noStroke()

	const endIndex = halftoneGrid.grid.length
	const elementsToDraw = halftoneGrid.grid.slice(0, settings.batchIndex);

	image(pg,0,0)

	// elementsToDraw.map(el => {
	// 	const size = map(el.brightness, 0, 255, settings.minDot * settings.dotSize, settings.maxDot * settings.dotSize)

	// 	if(settings.grayscale) {
	// 		fill(el.brightness)
	// 	} else {
	// 		fill(el.color)
	// 	}

	// 	circle(el.x, el.y, size, size)
	// })

	// if(settings.batchIndex <= endIndex) {
	// 	settings.batchIndex += settings.batchSize;
	// }

	

}

function halftone() {
	const cols = settings.width / settings.offsetX
	const rows = settings.height / settings.offsetY

	pattern = generatePattern(cols, rows, settings.offsetX, settings.offsetY, settings.offset)
	halftoneGrid = generateHalftoneGrid(img, pattern)
	renderHalftone(halftoneGrid)
}

//
//	Use PGraphic for performance
//

// Here I translate halftoneGrid into PGgraphic image

function renderHalftone(halftoneGrid){

  pg = createGraphics(settings.width, settings.height);
  pg.background(255)
  pg.noStroke()
  console.log(halftoneGrid)
  halftoneGrid.grid.map(el=>{
  	const size = map(el.brightness, 0, 255, settings.minDot * settings.dotSize, settings.maxDot * settings.dotSize)

  	if(settings.grayscale) {
			pg.fill(el.brightness)
		} else {
			pg.fill(el.color)
		}
    pg.circle(el.x,el.y,size,size)
  })
}


//
// MAIN FUNCTION
//

function generateHalftoneGrid(img, pattern) {
	// img.loadPixels()

	const grid = pattern.points.map(el => {
		const x = map(el.x, 0, pattern.cols * pattern.spacingX, 0, img.width - 1, true)
		const y = map(el.y, 0, pattern.rows * pattern.spacingY, 0, img.height - 1, true)

		const color = img.get(x, y)
		// const index = (y * img.width + x) * 4
		// console.log(x + "			" + y)

		const output = {
			x: el.x + random(0, settings.distortion),
			y: el.y + random(0, settings.distortion),
			color: color,
			brightness: brightness(color),
			imgX: x,
			imgY: y
		}

		return output
	})

	return {
		pattern: pattern,
		grid: grid
	}
}

function generatePattern(cols = 50, rows = 50, spacingX = 10, spacingY = 10, offset = 1) {

	let points = [];

	for(let row = 0; row < rows + 2; row++) {
		for(let col = 0; col < cols + 2; col++) {
			// Calcul des coordonnées x et y
			let x = col * spacingX;
			let y = row * spacingY;

			// Add offset
			x += (row % offset) * (spacingX / offset);
			// Offset the row to stay in rectangle selection
			x -= spacingX

			points.push({ x: x, y: y });
		}
	}

	return {
		cols: cols,
		rows: rows,
		spacingX: spacingX,
		spacingY: spacingY,
		offset: offset,
		points: points
	}
}

//
// GUI FUNCTION
//

function handleDrop(file) {
	if(file.type != "image") {
		return
	}
	img = loadImage(file.data);
	halftone()
}

const buttonWidth = document.getElementById("width")
const buttonHeight = document.getElementById("height")

const checkboxGrayscale = document.getElementById("dotGrayscale")
const inputDistortion = document.getElementById("distortion")

function loadGUI() {

	buttonWidth.oninput = function() {
		settings.width = this.value
		if(settings.imageRatio) {
			const ratio = img.height / img.width
			settings.height = this.value * ratio
			buttonHeight.value = settings.height
		}
		resizeCanvas(settings.width, settings.height);
		halftone()
	}
	buttonHeight.oninput = function() {
		settings.height = this.value
		if(settings.imageRatio) {
			const ratio = img.width / img.height
			settings.width = this.value * ratio
			buttonWidth.value = settings.width
		}
		resizeCanvas(settings.width, settings.height);
		halftone()
	}

	document.getElementById("imageRatio")
		.onchange = function() {
			settings.imageRatio = this.checked
		}
	document.getElementById("minDot")
		.oninput = function() {
			settings.minDot = this.value
			halftone()
		}
	document.getElementById("maxDot")
		.oninput = function() {
			settings.maxDot = this.value
			halftone()
		}

	checkboxGrayscale.onchange = function() {
		settings.grayscale = this.checked
		halftone()
	}
	document.getElementById("offsetX")
		.oninput = function() {
			settings.offsetX = this.value
			settings.batchIndex = 0
			halftone()
		}
	document.getElementById("offsetY")
		.oninput = function() {
			settings.offsetY = this.value
			settings.batchIndex = 0
			halftone()
		}
	document.getElementById("offset")
		.oninput = function() {
			settings.offset = this.value
			settings.batchIndex = 0
			halftone()
		}
	document.getElementById("dotSize")
		.oninput = function() {
			settings.dotSize = this.value
			halftone()
		}

	document.getElementById("buttonSave")
		.onclick = function() {
			saveCanvas('untitled.png');
		}

	inputDistortion.oninput = function() {
		settings.distortion = this.value
		halftone()
	}
}
