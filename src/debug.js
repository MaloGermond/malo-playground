const debug = (function () {
	const data = new Array();
	let maxDataLength = 100;
	let maxValue = 100;

	// Draw et Display c'est différent. Ici on draw ... Donc faut faire une autre fonction display
	function displayHistograme(width, margin) {
		maxDataLength = width - margin * 2;
		storeData(deltaTime);
		push();
		noStroke(), fill('#1F1F1F');
		rect(0, 0, width, 60);

		translate(4, 4);
		push();

		fill('#424242');
		rect(0, 0, width - margin * 2, 50);

		translate(0, 50);
		fill('#2DC9FF');
		data.map((el, index) => {
			rect(index, 0, 1, map(el, 0, maxValue, 0, -50, true));
		});

		pop();
		pop();
	}

	function storeData(value) {
		data.push(value);
		if (data.length > maxDataLength) {
			data.shift(); // Supprime le premier élément (le plus ancien)
		}
	}

	return {
		displayHistograme,
	};
})();
