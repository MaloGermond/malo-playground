// Factory pour produire des windmaps et calculer les forces appliqués

export const windmap = function (settings) {
	const config = {
		columns: 30, // Numbers of columns
		rows: 20, // Numbers of rows
		width: 300, // Canvas size
		height: 200,
		debug: false,
		grid: [],
		winds: [],
		instance: [],
		windmap: [],
		...settings,
	};

	console.log({ settings });

	function create() {
		config.grid = computeGrid();
		console.log({ config });
		return;
	}

	function computeGrid(cols = config.columns, rows = config.rows) {
		const grid = Array.from({ length: rows * cols }, (_, index) => {
			const row = Math.floor(index / cols);
			const col = index % cols;
			const width = config.width / cols;
			const height = config.height / rows;
			const x = col * width;
			const y = row * height;
			return { index, row, col, width, height, x, y };
		});
		return grid;
	}

	function addWind(start, end) {
		return;
	}

	function computeWind() {
		return;
	}

	function addInstance() {
		return;
	}

	function getInstance() {
		return;
	}

	function computeForces() {
		return;
	}

	function displayGrid(x = 0, y = 0) {
		push();
		noFill();
		// Display canvas size
		rect(x, y, config.width, config.height);

		// Display grid cells
		config.grid.map((cells) => {
			rect(cells.x, cells.y, cells.width, cells.height);
		});

		pop();
		return;
	}

	function displayWindmap() {
		return;
	}
	return {
		create,
		computeGrid,
		computeWind,
		displayGrid,
		displayWindmap,
		addWind,
		addInstance,
		getInstance,
		computeForces,
	};
};
