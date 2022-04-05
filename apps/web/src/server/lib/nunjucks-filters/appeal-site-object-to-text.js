export function appealSiteObjectToText (appealSiteObject) {
	// eslint-disable-next-line unicorn/no-array-reduce
	return Object.keys(appealSiteObject).reduce((accumulator, key) => {
		if (appealSiteObject[key]) accumulator += (accumulator.length > 0 ? ', ' : '') + appealSiteObject[key];
		return accumulator;
	}, '');
}
