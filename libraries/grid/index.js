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
		rowsHeight: [],
		columns: ['fr', 'fr', 'fr'],
		columnsWidth: [],
		cells: [],
		...settings,
	};

	let updateRequired = true;

	function setConfig(newConfig) {
		config = { ...config, ...newConfig };
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
		return [];
	}

	function display() {
		computeGrid();

		// Background color
		fill('#ECEDEE');

		// Display Page area
		push();
		stroke('#3FBCE7');
		rect(0, 0, config.width, config.height);
		pop();

		// Display innerArea
		translate(config.marginLeft, config.marginTop);
		push();
		fill('#fff');
		stroke('#2DC9FF');
		rect(0, 0, config.innerWidth, config.innerHeight);
		pop();
	}

	return {
		setConfig,
		config,
		display,
	};
};

// Fonction combinée pour calculer taille restante + fraction
export function computeSizes(totalSize, tracks, gap) {
	const gapTotal = gap * (tracks.length - 1);
	const sizeRemaining = totalSize - gapTotal;

	// Calcul des unités fractionnelles
	const totalFr = tracks.reduce((acc, cur) => acc + (cur === 'fr' ? 1 : 0), 0);
	const fixedSize = tracks.reduce((acc, cur) => acc + (typeof cur === 'number' ? cur : 0), 0);

	// Taille pour 1fr
	const sizeForFr = totalFr > 0 ? (sizeRemaining - fixedSize) / totalFr : 0;

	return {
		sizeRemaining,
		sizeForFr,
	};
}
