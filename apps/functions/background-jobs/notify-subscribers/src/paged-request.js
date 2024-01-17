/**
 * This is an iterator such that is can be looped over to get each page
 *
 * @example
 * ```
 * const req = new PagedRequest(100, apiCall);
 *
 * for await (const res of req) {
 *   console.log(res.items);
 * }
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols
 *
 * @type {Iterable<import('./types.js').Result<T>>}
 * @template T
 */
export class PagedRequest {
	/** @type {number} */
	#pageSize;
	/** @type {import('./types.js').Request<T>} */
	#request;

	/**
	 * @param {number} pageSize
	 * @param {import('./types.js').Request<T>} request
	 */
	constructor(pageSize, request) {
		if (pageSize <= 0) {
			throw new Error(`PagedRequest: invalid pageSize, must be >0`);
		}
		this.#pageSize = pageSize;
		this.#request = request;
	}

	[Symbol.asyncIterator]() {
		// Use new properties for each iterator. This makes multiple
		// iterations over the iterable safe for non-trivial cases,
		// such as use of break or nested looping over the same iterable.
		let page = 0;
		/** @type {number|undefined} */
		let pageCount;

		return {
			/**
			 * Get the next page of results
			 *
			 * @returns {Promise<import('./types.js').Result<T>>}
			 */
			next: async () => {
				page++;
				// check if there is another page
				if (pageCount !== undefined && page > pageCount) {
					return { value: undefined, done: true };
				}

				const res = await this.#request(page, this.#pageSize);
				if (typeof res.pageCount !== 'number' || res.pageCount < 0) {
					throw new Error('PagedRequest: invalid API response, no pageCount');
				}
				pageCount = res.pageCount;
				return { value: res, done: false };
			}
		};
	}
}
