const halftone = (function() {
	function test(){
		return true
	}

	function render(image,settings) {
		// Creation de la grille de points (pattern) qui contient couleur et effets.
		const pattern = convertImageToPattern(image,settings)
		const outputImage = generateImage(pattern)
		return outputImage
	}

	// This function convert an Image to an pattern Array
	function convertImageToPattern(image,settings){
			// Creation de la gille de position des points pour l'image final en demis ton.
			const grid = createHalftoneGrid(settings)

			// Création du schema à partir des points de la grille
			const scheme = grid.points.map(el => {

				// Calcul des positions relatives des points sur l'image (en tenant compte de l'échelle)
				// Ici on peut optimiser ce calcule par en travaillant avec des données d'image en format matriciel pré-chargé et évite le calcule avec un map. Globalement ca revient à dire que l'on peut charge les pixels de l'image dans le tableau `pixels` (sois en vecteur soit dans une array) et venir ensuite faire une approximation pour selectionné l'array le plus proche.

				const mappedX = map(el.x, 0, grid.cols * grid.spacingX, 0, image.width - 1, true)
				const mappedY = map(el.y, 0, grid.rows * grid.spacingY, 0, image.height - 1, true)

				// Récupération de la couleur du pixel sur l'image à la position calculée
				const color = image.get(mappedX, mappedY)

				 // Construction de l'objet de sortie, incluant les coordonnées, la couleur et la luminosité
				const output = {
            x: el.x + random(0, settings.distortion),    // Déformation aléatoire sur l'axe X
            y: el.y + random(0, settings.distortion),    // Déformation aléatoire sur l'axe Y
            color: color,                                // Couleur du pixel
            brightness: brightness(color),               // Luminosité de la couleur
            mappedX: mappedX,                            // Position X sur l'image
            mappedY: mappedY                             // Position Y sur l'image
        }

			return output
		})

		return	{
			settings: settings,
			grid: grid,
			scheme: scheme
		}
	}

	// This fonction create a grid of point
	function createHalftoneGrid(settings){
		const cols = settings.outputWidth / settings.spacingX
		const rows = settings.outputHeight / settings.spacingY

		// Espacement des points sur les axes X et Y
		const spacingX = settings.spacingX
		const spacingY = settings.spacingY

		// Décalage de lignes en lignes
		const offset = settings.offset
		
		// Array qui contiendra la grille de points
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

	// This funtion convert patter Array into an image
	function generateImage(pattern){
		// console.log(pattern)

		const settings = pattern.settings

		if(settings.outputWidth===undefined || settings.outputHeight===undefined){
			console.error("settings.imageWidth or settings.imageHeight is undefined")
		}
		
		const pg = createGraphics(settings.outputWidth, settings.outputHeight);
		pg.clear()
		pg.noStroke()
		pg.ellipseMode(CENTER)

		  pattern.scheme.map(el=>{
		  	const size = map(el.brightness, 0, 255, settings.minDot * settings.dotSize, settings.maxDot * settings.dotSize)

		  	if(settings.grayscale) {
					pg.fill(el.brightness)
				} else {
					pg.fill(el.color)
				}

		    pg.circle(el.x,el.y,size,size)

		  })
		return pg
	}

	return {
    test: test,
    render: render,
    createHalftoneGrid:createHalftoneGrid,
    convertImageToPattern: convertImageToPattern,
    generateImage: generateImage
  }
})()

// export default halftone