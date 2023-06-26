/**
 * @typedef {object} StageParams
 * @property {string} lookup
 * @property {string} lookupWithoutPostcode
 * @property {string} find
 * @property {string} enter
 * @property {string} enterWithoutPostcode
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

	const paramsWithoutPostcode = `?${Params.toString()}&stage=`;

	if (postcode) Params.append('postcode', postcode);

	const paramsWithPostcode = `?${Params.toString()}&stage=`;

	return {
		lookup: `${paramsWithPostcode}lookup`,
		lookupWithoutPostcode: `${paramsWithoutPostcode}lookup`,
		find: `${paramsWithPostcode}find`,
		enter: `${paramsWithPostcode}enter`,
		enterWithoutPostcode: `${paramsWithoutPostcode}enter`
	};
};
