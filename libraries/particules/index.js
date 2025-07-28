// particulesystem.js
export function particuleSystem(config = {}) {
	const settings = {
		lifespan: 120, // in frames
		getForce: () => ({ x: 0, y: 0 }), // une fonction pour calculer la force (ex: vent)
		debug: false,
		speedLimit: Infinity,
		friction: 0,
		boundary: { x: 0, y: 0, width: 200, height: 200, behaviour: 'none' }, //'none', 'bounce', 'wrap'
		...config,
	};

	let particules = [];
	const spawn = [];

	function addSpawn({
		x,
		y,
		width = 1,
		height = 1,
		velocity = { x: 0, y: 0 },
		rate = 10,
		duration = 99999999,
	}) {
		spawn.push({ x, y, width, height, velocity, rate, duration });
		return;
	}

	function add(x = 0, y = 0, velocity = { x: 0, y: 0 }, life = 0) {
		particules.push({ x: x, y: y, velocity, life });
		return;
	}

	function update() {
		// Met à jour les particules existantes
		spawn.map((p) => {
			p.duration -= 1;
			if (p.duration % p.rate === 0) {
				const x = p.x + random(-p.width / 2, p.width / 2);
				const y = p.y + random(-p.height / 2, p.height / 2);
				add(x, y, p.velocity);
			}
		});
		particules.forEach((p) => {
			// Calcule de la somme des forces exercé sur la particule
			const acc = applyFriction(settings.getForce(p.x, p.y), settings.friction);

			// Limite de l'acceleration
			const limAcc = limitVector(acc, settings.speedLimit);

			const pos = handleBoundary(p.x + limAcc.x, p.y + limAcc.y, settings.boundary);
			p.x = pos.x;
			p.y = pos.y;

			p.life += 1;
		});

		// Supprime les particules trop vieilles
		particules = particules.filter((p) => p.life < settings.lifespan);
	}

	function applyFriction(v, frictionCoef) {
		const speed = Math.hypot(v.x, v.y);
		if (speed === 0) return { x: 0, y: 0 };

		const frictionMag = Math.min(speed, frictionCoef);
		return {
			x: v.x - (v.x / speed) * frictionMag,
			y: v.y - (v.y / speed) * frictionMag,
		};
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
		particules.forEach((p) => drawFn(p));
	}

	return {
		add,
		addSpawn,
		update,
		draw,
		getparticules: () => particules,
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
