//
// DEBUG LIB
//

// Currently it's a quite dirty lib.
// I want a widget that display performance informations

const debug = (function () {
	const data = new Array();
	let maxDataLength = 100;
	let maxValue = 100;

	// Draw et Display c'est différent. Ici on draw ... Donc faut faire une autre fonction display
	function displayHistograme(width) {
		const margin = 15;
		const padding = 4;

		maxDataLength = width - padding * 2;

		storeData(deltaTime);
		push();

		push();
		noStroke();
		fill('#1F1F1F');
		rect(0, 0, width, 80);
		pop();
		translate(4, 4);

		push();

		fill('#424242');
		rect(0, 0, width - padding * 2, 50);
		fill('#2DC9FF');
		noStroke();
		translate(0, 50);
		data.map((el, index) => {
			rect(index, 0, 1, map(el, 0, maxValue, 0, -50, true));
		});

		push();

		translate(0, 17);
		noStroke();
		fill('#fff');
		textAlign(LEFT);
		text(frameRate().toFixed(0) + ' fps', padding, 0);
		textAlign(RIGHT);
		text(deltaTime.toFixed(0), width - padding * 3, 0);
		pop();
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
