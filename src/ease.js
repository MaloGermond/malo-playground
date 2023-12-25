/**
 * Get progress from ease
 * @param {int} t - time from 0 to 1.
 * @param {string} ease - Ease type
 * @returns {number} - Ease progress.
 */

function getEaseProgress(t, ease) {
	ease ? null : (ease = "linear");

	switch (ease) {
		case "easeInOut":
			return easeInOut(t);
			break;
		case "easeIn":
			return -1;
			break;
		case "easeOut":
			return -1;
			break;
		case "easeInOutElastic":
			return easeInOutElastic(t);
			break;
		case "easeInOutBounce":
			return easeInOutBounce(t);
			break;
		case "easeInBounce":
			return easeInBounce(t);
			break;
		case "easeOutBounce":
			return easeOutBounce(t);
			break;
		default:
			return linear(t);
	}
}

//
// EASE FUNCTIONS
// 

function linear(t) {
	return t;
}

// Easing function for smooth transitions
function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
	// Assuming t is a value between 0 and 1 representing the progress of the animation
	return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutQuint(t) {
	return t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function easeOutElastic(t, strength) {
	strength === undefined ? (w = 2) : null;

	const c4 = (strength * Math.PI) / 3;

	return t === 0 ?
		0 :
		t === 1 ?
		1 :
		Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeInOutElastic(t) {
	const c5 = (2 * Math.PI) / 4.5;

	return t === 0 ?
		0 :
		t === 1 ?
		1 :
		t < 0.5 ?
		-(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 :
		(Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
}

function easeOutBounce(t) {
	const n1 = 7.5625;
	const d1 = 2.75;

	if(t < 1 / d1) {
		return n1 * Math.pow(t, 2);
	} else if(t < 2 / d1) {
		return n1 * (t -= 1.5 / d1) * t + 0.75;
	} else if(t < 2.5 / d1) {
		return n1 * (t -= 2.25 / d1) * t + 0.9375;
	} else {
		return n1 * (t -= 2.625 / d1) * t + 0.984375;
	}
}



function easeInBounce(t) {
	return 1 - easeOutBounce(1 - t);
}

function easeInOutBounce(t) {
	return t < 0.5 ?
		(1 - easeOutBounce(1 - 2 * t)) / 2 :
		(1 + easeOutBounce(2 * t - 1)) / 2;
}
