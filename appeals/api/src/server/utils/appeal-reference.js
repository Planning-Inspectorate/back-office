/**
 *
 * @param {number} id
 * @returns {string}
 */
export const createAppealReference = (id) => {
	const minref = 6000000;
	if (id > minref) {
		return id.toString();
	}

	return (minref + id).toString();
};
