/**
 * @param { Promise } promise - Promise we want to await for
 * @param { object= } errorExt - Additional Information you can pass to the err object
 * @returns { Promise } Promise that resolves with an array containing the error and / or result object
 */
export function to(promise, errorExt) {
	return promise
		// eslint-disable-next-line unicorn/no-null
		.then((data) => [null, data])
		.catch((error) => {
			if (errorExt) {
				const parsedError = Object.assign({}, error, errorExt);
				return [parsedError, undefined];
			}
			return [error, undefined];
		});
}
