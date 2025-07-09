//
//  GRID LIBRARIES
//

//
//  An easy way to manage complex layout.
//

// TO DO
//
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
		margin: { top: 20, right: 20, bottom: 20, left: 20 },
		rowGap: 4,
		columnGap: 4,
		rows: ['fr', 'fr'],
		columns: ['fr', 'fr', 'fr'],
		cells: [],
		layout: { columns: {}, rows: {} },
		...settings,
	};

	let updateRequired = true;

	function setConfig(newConfig) {
		Object.assign(config, newConfig);
		updateRequired = true;
	}

	function computeGrid() {
		if (!updateRequired) return;

		config.innerWidth = config.width - config.margin.left - config.margin.right;
		config.innerHeight = config.height - config.margin.top - config.margin.bottom;

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
		// C'est pas mal car si je veux optimiser j'ai juste à refaire le calcule que pour les rows ou columns et faire un render (le calcule des cells en dessous)
		config.layout.columns = computeSizes(config.innerWidth, config.columns, config.columnGap);
		config.layout.rows = computeSizes(config.innerHeight, config.rows, config.rowGap);
		const columns = config.layout.columns.spans;
		const rows = config.layout.rows.spans;

		// Ici j'ai toutes les tailles, donc si je n'ai plus besoin du x et y je peux le retrouve avec config.columns

		for (let j = 0; j < rows.length; j++) {
			for (let i = 0; i < columns.length; i++) {
				// Il faudrait ajouter les gap comme des cells pour que ce soit plus modulable et plus simple à selectionner.
				cells.push(
					createCell({
						i: i,
						j: j,
						layout: config.layout,
						type: rows[j].type === 'gutter' || columns[i].type === 'gutter' ? 'gutter' : 'cell',
					})
				);
			}
		}
		return cells;
	}

	function createCell({
		i,
		j,
		layout = config.layout,
		margin = config.margin,
		isEmpty = true,
		type = 'cell',
	}) {
		const x = layout.columns.spans[i].offset + margin.left;
		const y = layout.rows.spans[j].offset + margin.top;

		return {
			index: getCellIndex(i, j, layout.columns.totalSegments),
			column: i,
			row: j,
			position: { x, y },
			width: layout.columns.segmentSizes[i],
			height: layout.rows.segmentSizes[j],
			isEmpty,
			type: type,
		};
	}

	// Retourne la cell qui est positionner en x,y a partir de l'origine de la grille
	function getCell(x, y) {
		// Position x, y relative au coin haut gauche de la grille
		const relX = x - config.margin.left;
		const relY = y - config.margin.top;

		const col = getCellIndexAtPosition(relX, config.layout.columns.spans);
		const row = getCellIndexAtPosition(relY, config.layout.rows.spans);

		if (col === -1 || row === -1) return;

		const index = getCellIndex(col, row, config.layout.columns.totalSegments);

		return config.cells[index];
	}

	function getCellIndex(col, row, columnCount) {
		return col + row * columnCount;
	}
	function getCellCoordinates(index, columnCount) {
		const col = index % columnCount; // colonne
		const row = Math.floor(index / columnCount); // ligne
		return { col, row };
	}

	function getCellIndexAtPosition(position, spans) {
		const index = spans.findIndex((span) => {
			const start = span.offset;
			const end = span.offset + span.size;
			return position >= start && position < end;
		});

		return index; // pas trouvé (en dehors des bornes)
	}

	function resize({ direction = 'horizontal', index = 0, value = '1fr' }) {
		if (direction === 'horizontal') {
			config.columns[index / 2] = value;
			updateRequired = true;
			console.log(config.columns);
		}
	}

	function display() {
		computeGrid();

		// Background color
		push();
		fill('#ffffff');
		noStroke();
		rect(0, 0, config.width, config.height);
		pop();

		// Display cells
		push();
		config.cells.map((el) => {
			noFill();
			stroke('#2DC9FF');
			if (el.type === 'gutter') {
				noStroke();
				fill('#ECEDEE');
			}
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
		translate(config.margin.left, config.margin.top);
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
		getCell,
		resize,
	};
};

// Fonction combinée pour calculer la taille des cellules
// Pour ca on doit calculer la tailel des fractions/frac/fr
export function computeSizes(containerSize, segments, gutter) {
	// Compte le nombre de gouttier et calcule la taille d'espace disponible
	const totalGutterSize = gutter * (segments.length - 1);
	const totalSegmentsSize = containerSize - totalGutterSize;

	// 1. Compte les fr et tailles fixes
	// Nombre d'éléments en fractionnelle
	const fracCount = segments.reduce((acc, cur) => acc + (cur === 'fr' ? 1 : 0), 0);

	// Taille occupé par des éléments en pixel
	const fixedSize = segments.reduce((acc, cur) => acc + (typeof cur === 'number' ? cur : 0), 0);

	// Espace restance pour le calule des poucentages
	// On prend le nombre d'élément en pourcentage que l'on multiplie par la longeur de l'espace
	const percentageSize = segments.reduce(
		(acc, val) =>
			acc +
			(typeof val === 'string' && val.includes('%')
				? (parseFloat(val) / 100) * totalSegmentsSize
				: 0),
		0
	);

	// 2. Calcule la taille d'un "fr"
	// On prend l'espace restant après le calcule des fixes et des pourcentages pour le diviser en fraction
	const fracSize =
		fracCount > 0 ? (totalSegmentsSize - (fixedSize + percentageSize)) / fracCount : 0;

	// 3. Convertit les segments en tailles absolues
	// Calcule en absolue de la taille des celules
	const convertedSegmentSizes = segments.map((cell) => {
		if (cell === 'fr') {
			return fracSize;
		}
		if (typeof cell === 'string' && cell.includes('%')) {
			const pourcentage = parseFloat(cell) / 100;
			return totalSegmentsSize * pourcentage;
		}
		return cell;
	});

	// 4. Construit les spans (segment + gutter) avec offsets progressifs
	const spans = [];
	let offset = 0;

	convertedSegmentSizes.forEach((size, index) => {
		// Segment
		spans.push({
			type: 'segment',
			size,
			offset,
		});
		offset += size;

		// Gutter (sauf après le dernier)
		if (index < convertedSegmentSizes.length - 1) {
			spans.push({
				type: 'gutter',
				size: gutter,
				offset,
			});
			offset += gutter;
		}
	});

	// 5. segmentSizes + offsets à plat pour usage plus bas niveau
	const segmentSizes = spans.map((s) => s.size);
	const cumulativeOffsets = spans.map((s) => s.offset);
	const totalSegments = segmentSizes.length;

	return {
		spans,
		totalSegmentsSize,
		totalGutterSize,
		fracSize,
		convertedSegmentSizes,
		segmentSizes,
		cumulativeOffsets,
		totalSegments,
	};
}
