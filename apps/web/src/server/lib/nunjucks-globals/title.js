/**
 *
 * @param {any[]} components
 * @returns {string}
 */
export const buildTitle = (...components) => {
	const title = components
		.filter((component) => typeof component === 'string' && component.length)
		.map((component) => component.trim())
		.join(' - ');
	return title;
};
