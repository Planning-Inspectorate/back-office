/* script to provide common functions to assist with retrieving paginated data from db
 */

/**
 * Returns the database skip value, for a given page number and page size
 *
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {number}
 */
export const getSkipValue = (pageNumber, pageSize) => {
	return (pageNumber - 1) * pageSize;
};

/**
 * Returns the total number of pages in a data set, for a given page size
 *
 * @param {number} itemsCount
 * @param {number} pageSize
 * @returns {number}
 */
export const getPageCount = (itemsCount, pageSize) => {
	return Math.ceil(itemsCount / pageSize);
};
