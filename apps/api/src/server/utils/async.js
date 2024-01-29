/**
 * @template T
 * @typedef {{ state: true, value: T } | { state: false, value: null }} Maybe
 * */

/**
 * Filter items using an asynchronous predicate function.
 * Use of a Maybe<T> type is needed instead of using null, as null could be included in the type of T (e.g. T might be `string | null`), so filtering out nulls could lead to unexpected behaviour.
 *
 * @template T
 * @param {(t: T) => Promise<boolean>} pred
 * @param {T[]} items
 * @returns {Promise<T[]>}
 * */
export const filterAsync = async (pred, items) => {
	/** @type {Promise<Maybe<T>>[]} */
	const promises = items.map(async (item) =>
		(await pred(item))
			? /** @type {Maybe<T>} */ ({ state: true, value: item })
			: /** @type {Maybe<T>} */ ({ state: false, value: null })
	);

	const results = await Promise.all(promises);
	return results.flatMap((item) => (item.state === true ? [item.value] : []));
};
