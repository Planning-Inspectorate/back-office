/**
 * @typedef {object} StageParams
 * @property {string} lookup
 * @property {string} find
 * @property {string} enter
 */

/**
 * @param {object} query
 * @param {string|undefined} postcode
 * @returns {StageParams}
 */
export const getStageParams = (query, postcode) => {
	const queryCopy = JSON.parse(JSON.stringify(query));

	delete queryCopy.postcode;
	delete queryCopy.stage;

	const Params = new URLSearchParams();

	for (const [key, value] of Object.entries(queryCopy)) {
		Params.append(key, value);
	}

	if (postcode) Params.append('postcode', postcode);

	const params = `?${Params.toString()}&stage=`;

	return {
		lookup: `${params}lookup`,
		find: `${params}find`,
		enter: `${params}enter`
	};
};
