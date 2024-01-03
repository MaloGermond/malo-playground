const grid = (function() {
	let config = {
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		row: 2,
		column: 4,
		marginTop: 20,
		marginLeft: 20,
		marginBottom: 20,
		marginRight: 20,
		rowGap: 8,
		columnGap: 8
	}

	set = function(option) {
		Object.keys(option)
			.map((el, index) => config[el] = option[el])
		return config
	}

	function display() {
		noFill()
		stroke(0)
		rect(0, 0, config.width, config.height)
		getRows()
			.map(guide => line(config.marginTop, guide, config.width - config.marginBottom, guide))
		return config
	}

	function getRows() {
		let output = new Array()
		const rowSize = ((config.height - config.marginTop - config.marginBottom) / config.row) - (config.rowGap * config.row - 1)
		for(let i = config.marginTop; i < (config.height - config.marginTop - config.marginBottom); i += rowSize) {
			const result = {

			}
			output.push(i)
			output.push(i + (config.rowGap / 2))
		}
		return output
	}

	return {
		display: display,
		set: set,
		getRow: getRows
	}
})()
