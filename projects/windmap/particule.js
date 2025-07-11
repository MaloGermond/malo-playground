// particleSystem.js
export function particleSystem(config = {}) {
	const settings = {
		lifespan: 120, // in frames
		spawnArea: { x: 0, y: 0, width: 100, height: 100 },
		getForce: () => ({ x: 0, y: 0 }), // une fonction pour calculer la force (ex: vent)
		debug: false,
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
			const force = settings.getForce(p.x, p.y);
			console.log({ force });
			p.velocity.x += force.x;
			p.velocity.y += force.y;

			p.x += p.velocity.x;
			p.y += p.velocity.y;

			p.life += 1;
		});

		// Supprime les particules trop vieilles
		particles = particles.filter((p) => p.life < settings.lifespan);
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
