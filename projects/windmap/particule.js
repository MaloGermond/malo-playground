// particleSystem.js
export function particleSystem(config = {}) {
	const settings = {
		lifespan: 120, // in frames
		spawnArea: { x: 0, y: 0, width: 100, height: 100 },
		getForce: () => ({ x: 0, y: 0 }), // une fonction pour calculer la force (ex: vent)
		debug: false,
		speedLimit: Infinity,
		boundary: { x: 0, y: 0, width: 200, height: 200, behaviour: 'none' }, //'none', 'bounce', 'wrap'
		...config,
	};

	let particles = [];

	function spawn() {
		const { x, y, width, height } = settings.spawnArea;
		const px = x + Math.random() * width;
		const py = y + Math.random() * height;
		const velocity = { x: 0, y: 0 };
		const life = 0;
		return { x: px, y: py, velocity, life };
	}

	function add(x = 0, y = 0, velocity = { x: 0, y: 0 }, life = 0) {
		particles.push({ x: x, y: y, velocity, life });
		return;
	}

	function update() {
		// Met à jour les particules existantes
		particles.forEach((p) => {
			// Calcule de la somme des forces exercé sur la particule
			const { x, y } = settings.getForce(p.x, p.y);

			// Limite de l'acceleration
			const acc = limitVector({ x, y }, settings.speedLimit);

			const pos = handleBoundary(p.x + acc.x, p.y + acc.y, settings.boundary);
			p.x = pos.x;
			p.y = pos.y;

			console.log(p.x);

			p.life += 1;
		});

		// Supprime les particules trop vieilles
		particles = particles.filter((p) => p.life < settings.lifespan);
	}

	function handleBoundary(x, y, boundary = settings.boundary) {
		if (boundary.behaviour === 'wrap') {
			return handleBondaryWrap(x, y, boundary);
		}
		// if (settings.boundary.behaviour === 'bounce') {
		// 	if (p.x < x || p.x > x + width) {
		// 		p.velocity.x *= -1;
		// 		p.x = Math.max(x, Math.min(p.x, x + width));
		// 	}
		// 	if (p.y < y || p.y > y + height) {
		// 		p.velocity.y *= -1;
		// 		p.y = Math.max(y, Math.min(p.y, y + height));
		// 	}
		// } else if (settings.boundary.behaviour === 'wrap') {
		// 	if (p.x < x) p.x = x + width;
		// 	else if (p.x > x + width) p.x = x;
		// 	if (p.y < y) p.y = y + height;
		// 	else if (p.y > y + height) p.y = y;
		// }
		// 'none' → on ne fait rien
		return { x: x, y: y };
	}

	function handleBondaryWrap(x, y, boundary) {
		if (x < boundary.x) x = x + boundary.width;
		if (x > boundary.x + boundary.width) x = boundary.x;
		if (y < boundary.y) y = boundary.y + boundary.height;
		else if (y > boundary.y + boundary.height) y = boundary.y;

		return { x: x, y: y };
	}

	function draw(drawFn) {
		particles.forEach((p) => drawFn(p));
	}

	return {
		add,
		update,
		draw,
		getParticles: () => particles,
	};
}

function limitVector(v, max) {
	const mag = Math.hypot(v.x, v.y);
	if (mag > max) {
		const factor = max / mag;
		return {
			x: v.x * factor,
			y: v.y * factor,
		};
	}
	return v; // déjà sous la limite
}
