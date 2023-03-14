export class Logger {
	/**
	 *@param {string} color - The color to apply to the value. It can be one of the following values: 'red', 'green', 'blue', 'yellow', 'cyan'.
	 *@param {string} value - The value to apply the color to.
	 *@returns {string} - The input value wrapped in ANSI color codes based on the color parameter.
	 */
	colors(color, value) {
		switch (color) {
			case 'red':
				return `\u001B[31m${value}\u001B[0m`;
			case 'green':
				return `\u001B[32m${value}\u001B[0m`;
			case 'blue':
				return `\u001B[34m${value}\u001B[0m`;
			case 'yellow':
				return `\u001B[33m${value}\u001B[0m'`;
			case 'cyan':
				return `\u001B[36m${value}\u001B[0m`;
			default:
				return `\u001B[32m${value}\u001B[0m`;
		}
	}

	/**
	 *
	 * @param {string} color
	 * @param {string} value
	 * @returns {void}
	 */
	log(color, value) {
		console.log(this.colors(color, value));
	}

	/**
	 *
	 * @param {string} value
	 * @returns {void}
	 */
	error(value) {
		console.log(this.colors('red', `Error: ${value}`));
	}
}
