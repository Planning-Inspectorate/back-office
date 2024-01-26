/**
 * Filter items using an asynchronous predicate function.
 *
 * @template T
 * @param {(t: T) => Promise<boolean>} pred
 * @param {T[]} items
 * @returns {Promise<T[]>}
 * */
export const filterAsync = async (pred, items) => {
	let filtered = [];

	for (const item of items) {
		if (await pred(item)) {
			filtered.push(item);
		}
	}

	return filtered;
};
