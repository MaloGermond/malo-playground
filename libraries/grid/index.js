//
//  GRID LIBRARIES
//

//
//  An easy way to manage complex layout.
//

// TO DO
//
// [] pourvoir créer une grille avec margin/padding
// [] la grille doit pouvoir avec des colonnes et des lignes de taille (width/height) variable
// [] les col/lignes doivent pouvoir avec un margin propre à elle
// [] on doit pouvoir spliter une colonne ou un ligne
// [] on doit pouvoir "resize" "deplacer" la valeur d'une ligne/colonne
// [] on doit pouvoir placer des éléments de taille variable dans la grille (de n col et n row)
//
// [] getCell(x,y) retourne la cellule situer en position dans le canvas en x,y
// [] getCell(col,row) retourne la cellule situer en position dans la grille en col,row
// [] getFreeSpace(col=1,row=1) retroune une/des cellules libres pour un element de taille col/row
// [] split(x,y,vertical/horizontal) split la colonne ou la ligne. Ca revient pour un split à 30% à faire rows: ['fr'] -> ['30%','70%']
// [] resize(col/row, newSize) resize la taille d'une colonne ou d'une ligne.
// [] pouvoir definir les marges et padding de la "page" et de chaque colonne / ligne individuellement. Genre il y a une régle generale qui peut-être surcharger par une regle locale.
// [] permettre d'animer la grille avec POP motion. Il vaut mieux que ce soit la lib qui s'occupe de l'animation pour que ca reste performant. Ca évite de bouriner setConfig et tout recalculer. Ensuite est-ce que l'on peut faire ca sans tout recalculer ?...

export const grid = function (settings) {
	let config = {
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		innerWidth: undefined,
		innerHeight: undefined,
		marginTop: 20,
		marginLeft: 20,
		marginBottom: 20,
		marginRight: 20,
		rowGap: 4,
		columnGap: 4,
		rows: ['fr', 'fr'],
		columns: ['fr', 'fr', 'fr'],
		cells: [],
		...settings,
	};

	let updateRequired = true;

	function setConfig(newConfig) {
		Object.assign(config, newConfig);
		updateRequired = true;
	}

	function computeGrid() {
		if (!updateRequired) return;

		config.innerWidth = config.width - config.marginLeft - config.marginRight;
		config.innerHeight = config.height - config.marginTop - config.marginBottom;

		config.cells = computeCells();

		updateRequired = false;
	}

	function computeCells() {
		const cells = new Array();

		let x = 0;
		let y = 0;

		// C'est ici que l'on fait le calcule de la taille des cells.
		// Comment on calcule l'espace restant
		// il y a fr, %, px
		const columns = computeSizes(config.innerWidth, config.columns, config.columnGap);
		const rows = computeSizes(config.innerHeight, config.rows, config.rowGap);

		for (let j = 0; j < config.rows.length; j++) {
			x = 0;
			for (let i = 0; i < config.columns.length; i++) {
				cells.push({
					index: i + j * config.columns.length,
					column: i,
					row: j,
					position: {
						x: x + config.marginLeft,
						y: y + config.marginTop,
					},
					width: columns.cellsLength[i],
					height: rows.cellsLength[j],
					isEmpty: true,
				});
				x += columns.cellsLength[i] + config.columnGap;
			}
			y += rows.cellsLength[j] + config.rowGap;
		}
		return cells;
	}

	function display() {
		computeGrid();

		// Background color
		fill('#fff');

		// Display cells
		push();
		config.cells.map((el) => {
			rect(el.position.x, el.position.y, el.width, el.height);
		});
		pop();

		// Display Page area
		push();
		noFill();
		stroke('#3FBCE7');
		rect(0, 0, config.width, config.height);
		pop();

		// Display innerArea
		push();
		translate(config.marginLeft, config.marginTop);
		noFill();
		stroke('#2DC9FF');
		rect(0, 0, config.innerWidth, config.innerHeight);
		pop();
	}

	return {
		setConfig,
		computeGrid,
		config,
		display,
	};
};

// Fonction combinée pour calculer la taille des cellules
// Pour ca on doit calculer la tailel des fractions/frac/fr
export function computeSizes(areaLength, track, gap) {
	const gapTotal = gap * (track.length - 1);
	const length = areaLength - gapTotal;

	// Nombre d'éléments en fractionnelle
	const totalFrac = track.reduce((acc, cur) => acc + (cur === 'fr' ? 1 : 0), 0);

	// Taille occupé par des éléments en pixel
	const fixedSize = track.reduce((acc, cur) => acc + (typeof cur === 'number' ? cur : 0), 0);

	// Espace restance pour le calule des poucentages
	// On prend le nombre d'élément en pourcentage que l'on multiplie par la longeur de l'espace
	const pourcentageLength = track.reduce(
		(acc, val) =>
			acc + (typeof val === 'string' && val.includes('%') ? (parseFloat(val) / 100) * length : 0),
		0
	);

	// Taille pour une fraction/frac/fr
	// On prend l'espace restant après le calcule des fixes et des pourcentages pour le diviser en fraction
	const fracLength = totalFrac > 0 ? (length - (fixedSize + pourcentageLength)) / totalFrac : 0;

	// Calcule en absolue de la taille des celules
	const cellsLength = track.map((cell) => {
		if (cell === 'fr') {
			return fracLength;
		}
		if (typeof cell === 'string' && cell.includes('%')) {
			const pourcentage = parseFloat(cell) / 100;
			return length * pourcentage;
		}
		return cell;
	});

	return {
		length,
		fracLength,
		cellsLength,
	};
}
