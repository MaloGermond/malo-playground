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

	// Create the grid that will be use for defining winds effect areas.
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

	function addWind(x1, y1, x2, y2) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		const length = Math.sqrt(dx * dx + dy * dy);
		const vector = { x: dx, y: dy };
		const direction = { x: dx / length, y: dy / length };
		const angle = Math.atan2(direction.y, direction.x);

		config.winds.push({
			start: { x: x1, y: y1 },
			end: { x: x2, y: y2 },
			vector,
			direction,
			force: length,
			angle,
		});
		return;
	}

	function computeWind() {
		return;
	}

	// Instances are items that will be affected by winds
	function addInstance() {
		return;
	}

	// Return instances position and winds effect informations
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

	function displayWinds() {
		push();
		noFill();
		config.winds.map((wind) => {
			push();
			translate(wind.start.x, wind.start.y);
			rotate(wind.angle);
			stroke('#000');
			line(0, 0, wind.force, 0);
			fill('#000');
			triangle(wind.force - 10, -5, wind.force, 0, wind.force - 10, 5);
			pop();
		});
		pop();
		return;
	}

	function displayWindmap() {
		return;
	}
	return {
		create,
		addWind,
		addInstance,
		getInstance,
		computeGrid,
		computeWind,
		computeForces,
		displayGrid,
		displayWinds,
		displayWindmap,
	};
};
