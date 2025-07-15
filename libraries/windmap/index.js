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

	function init() {
		config.grid = generateGrid();
		config.windmap = computeWindmap(config.grid, config.winds);
		console.log({ config });
		return;
	}

	// Create the grid that will be use for defining winds effect areas.
	function generateGrid(cols = config.columns, rows = config.rows) {
		const grid = Array.from({ length: rows * cols }, (_, index) => {
			const row = Math.floor(index / cols);
			const col = index % cols;
			const width = config.width / cols;
			const height = config.height / rows;
			const x = col * width;
			const y = row * height;
			const center = {
				x: x + width / 2,
				y: y + height / 2,
			};
			return { index, row, col, width, height, x, y, center };
		});
		return grid;
	}

	function addWind(x1, y1, x2, y2) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		const magnitude = Math.sqrt(dx * dx + dy * dy);
		const vector = { x: dx, y: dy };
		const direction = { x: dx / magnitude, y: dy / magnitude };
		const angle = Math.atan2(direction.y, direction.x);

		config.winds.push({
			start: { x: x1, y: y1 },
			end: { x: x2, y: y2 },
			vector,
			direction,
			magnitude: magnitude,
			angle,
		});
		return;
	}

	function computeWindmap(grids, winds) {
		const windmap = grids.map((cell) => {
			return resolveWindEffect(cell.center.x, cell.center.y, winds);
		});

		return windmap;
	}
	function resolveWindEffect(x, y, winds = config.winds) {
		// 1. Calculer le facteur d'influence du vecteur wind sur le point. (Plus il est loins moins il a d'influence.)
		// 2. Multiplier pour chaque vecteur wind par le facteur d'influence de chacun des vecteurs
		// 3. Faire la resolution des forces.

		const position = {
			x: x,
			y: y,
		};

		const vector = winds.reduce(
			(acc, wind) => {
				const dist = distancePointToSegment(position, wind.start, wind.end);

				// Influence = décroissance simple
				const influence = 1 / (dist + 1); // ou Math.exp(-dist), selon ton modèle

				acc.x += wind.vector.x * influence;
				acc.y += wind.vector.y * influence;

				return acc;
			},
			{ x: 0, y: 0 }
		);

		const magnitude = Math.hypot(vector.x, vector.y);
		const direction = { x: vector.x / magnitude, y: vector.y / magnitude };
		const angle = Math.atan2(direction.y, direction.x);

		return { position, vector, magnitude, direction, angle };
	}

	// Ici on calcule la distance à un segment... Bon là j'ai rien compris c'est du copier coller... je suis pas fan de ce genre d'approche...
	function distancePointToSegment(p, v, w) {
		const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
		if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);

		let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
		t = Math.max(0, Math.min(1, t));
		const proj = {
			x: v.x + t * (w.x - v.x),
			y: v.y + t * (w.y - v.y),
		};
		return Math.hypot(p.x - proj.x, p.y - proj.y);
	}

	function getWindForceAt(x, y, winds = config.winds) {
		const position = { x, y };
		const vector = winds.reduce(
			(acc, wind) => {
				const dist = distancePointToSegment(position, wind.start, wind.end);
				const influence = 1 / (dist + 1);
				acc.x += wind.vector.x * influence;
				acc.y += wind.vector.y * influence;
				return acc;
			},
			{ x: 0, y: 0 }
		);

		const magnitude = Math.hypot(vector.x, vector.y);
		const direction = { x: vector.x / magnitude, y: vector.y / magnitude };
		const angle = Math.atan2(direction.y, direction.x);

		return { position, vector, magnitude, direction, angle };
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
			line(0, 0, wind.magnitude, 0);
			fill('#000');
			triangle(wind.magnitude - 10, -5, wind.magnitude, 0, wind.magnitude - 10, 5);
			pop();
		});
		pop();
		return;
	}

	function displayWindmap(windmap = config.windmap) {
		push();
		noFill();
		config.windmap.map((wind) => {
			push();
			translate(wind.position.x, wind.position.y);
			rotate(wind.angle);
			stroke('#000');
			line(0, 0, wind.magnitude, 0);
			fill('#fff');
			triangle(wind.magnitude - 5, -2.5, wind.magnitude, 0, wind.magnitude - 5, 2.5);
			pop();
		});
		pop();
		return;
	}
	return {
		init,
		addWind,
		generateGrid,
		computeWindmap,
		getWindForceAt,
		getGrid: () => config.grid,
		getWinds: () => config.winds,
		getWindmap: () => config.windmap,
		displayGrid,
		displayWinds,
		displayWindmap,
		distancePointToSegment,
	};
};
