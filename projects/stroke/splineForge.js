export default function spline({ points = [], resolution = 5 } = {}) {
	let type = 'curve'; // ou 'polyline' etc. (extensible)

	let properties = {
		stroke: '#000',
		weight: 4,
	};

	function add(point) {
		if (points.length >= 1) {
			const distance = dist(
				points[points.length - 1].x,
				points[points.length - 1].y,
				point.x,
				point.y
			);
			if (distance <= resolution) return;
		}

		points.push(point);
	}

	function updatePoint(index, newPoint) {
		if (points[index]) points[index] = newPoint;
	}

	function removePoint(index) {
		points.splice(index, 1);
	}

	function getPoints() {
		return [...points];
	}

	function clear() {
		points = [];
	}

	function setStyle({ weight, stroke }) {
		properties = { weight, stroke };
	}

	function getStyle() {
		return properties;
	}

	function setType(newType) {
		type = newType;
	}

	function getType() {
		return type;
	}

	function clone() {
		const copy = spline();
		for (let p of points) {
			copy.add({ x: p.x, y: p.y });
		}
		copy.setStyle({ ...properties });
		return copy;
	}

	// Position sur la courbe à t ∈ [0, 1]
	function getPointAt(t) {
		if (type === 'bezier') {
			if (points.length === 3) {
				return quadraticBezier(points[0], points[1], points[2], t);
			}
			if (points.length === 4) {
				return cubicBezier(points[0], points[1], points[2], points[3], t);
			}
		}
		return null;
	}

	function getPath(res = resolution) {
		const path = [];
		for (let i = 0; i <= res; i++) {
			const t = i / res;
			const pt = getPointAt(t);
			if (pt) path.push(pt);
		}
		return path;
	}

	// --- Bézier helpers ---
	function quadraticBezier(p0, p1, p2, t) {
		const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
		const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
		return { x, y };
	}

	function cubicBezier(p0, p1, p2, p3, t) {
		const mt = 1 - t;
		const x = mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x;
		const y = mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y;
		return { x, y };
	}

	// Export/import
	function toJSON() {
		return JSON.stringify({ points, type });
	}

	function fromJSON(json) {
		const data = JSON.parse(json);
		points = data.points || [];
		type = data.type || 'bezier';
	}

	// Draw

	function draw({
		weight = properties.weight,
		fillColor = false,
		strokeColor = properties.stroke,
	} = {}) {
		fillColor ? fill(fillColor) : noFill();
		strokeColor ? stroke(strokeColor) : noStroke();
		strokeWeight(weight);

		if (type === 'curve') {
			drawCurve();
		}
		if (type === 'bezier') {
			drawBezier();
		}
	}

	function drawCurve() {
		if (points.length <= 4) {
			return;
		}
		// First part of the curve
		curve(
			points[0].x,
			points[0].y,
			points[0].x,
			points[0].y,
			points[1].x,
			points[1].y,
			points[2].x,
			points[2].y
		);

		points.slice(0, points.length - 3).map((point, i) => {
			const originalIndex = i;
			curve(
				points[originalIndex].x,
				points[originalIndex].y,
				points[originalIndex + 1].x,
				points[originalIndex + 1].y,
				points[originalIndex + 2].x,
				points[originalIndex + 2].y,
				points[originalIndex + 3].x,
				points[originalIndex + 3].y
			);
		});

		// Last part of the curve
		curve(
			points[points.length - 3].x,
			points[points.length - 3].y,
			points[points.length - 2].x,
			points[points.length - 2].y,
			points[points.length - 1].x,
			points[points.length - 1].y,
			points[points.length - 1].x,
			points[points.length - 1].y
		);
	}

	function drawBezier() {}

	return {
		add,
		updatePoint,
		removePoint,
		setStyle,
		getStyle,
		getPoints,
		getPointAt,
		getPath,
		clear,
		toJSON,
		fromJSON,
		setType,
		getType,
		draw,
		drawCurve,
		clone,
	};
}
