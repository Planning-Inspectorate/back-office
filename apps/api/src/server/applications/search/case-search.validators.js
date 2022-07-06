// constants
const validRoles = new Set(['inspector', 'case-officer', 'case-admin-officer']);

Object.freeze(validRoles);

const maxResultsPerPage = 20;
const maxPages = 30;

/** @type {import('express').RequestHandler } */
export const validateSearchCriteria = async (request, response, next) => {
	if (!validRole(request.body.role)) {
		response.status(403).send({
			errors: {
				status: 'Role is not valid'
			}
		});
	} else if (!validQuery(request.body.query)) {
		response.status(400).send({
			errors: {
				status: 'Query cannot be blank'
			}
		});
	} else if (!validPageNumber(request.body.pageNumber)) {
		response.status(400).send({
			errors: {
				status: 'Page Number not in valid range'
			}
		});
	} else if (!validPageSize(request.body.pageSize)) {
		response.status(400).send({
			errors: {
				status: 'Page Size not in valid range'
			}
		});
	} else {
		next();
	}
};

/**
 *
 * @param {string} role
 * @returns {boolean} validRole
 */
const validRole = (role) => {
	return validRoles.has(role);
};

/**
 *@param {string} query
 * @returns {boolean} validQuery
 */
const validQuery = (query) => {
	return !(!query || query.trim() === '');
};

// allows  blank or missing value
// if it has a value, it must be numberic, and within range
/**
 * @param {number} pageNumber
 * @returns {boolean} validPage
 */
const validPageNumber = (pageNumber) => {
	let validPage = true;

	if (pageNumber) {
		validPage = Number(pageNumber) ? !!(pageNumber > 0 && pageNumber <= maxPages) : false;
	} else {
		validPage = false;
	}

	return validPage;
};

// allows  blank or missing value
// if it has a value, it must be numberic, and within range
/**
 * @param {number} pageSize
 * @returns {boolean} validSize
 */
const validPageSize = (pageSize) => {
	let validSize = true;

	if (pageSize) {
		validSize = Number(pageSize) ? !!(pageSize > 0 && pageSize <= maxResultsPerPage) : false;
	} else {
		validSize = false;
	}
	return validSize;
};
