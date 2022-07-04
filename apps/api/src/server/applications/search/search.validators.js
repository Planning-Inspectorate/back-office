// constants
const validRoles = new Set(['inspector', 'case-officer', 'case-admin-officer']);

Object.freeze(validRoles);

const maxResultsPerPage = 20;
const maxPages = 30;

/** @type {import('express').RequestHandler } */
export const validateSearchCriteria = async (request, response, next) => {
	if (!validQuery(request.body.query)) {
		response.status(400).send({
			errors: {
				status: 'Query cannot be blank'
			}
		});
	} else if (!validRole(request.body.role)) {
		response.status(403).send({
			errors: {
				status: 'Role is not valid'
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

const validQuery = (query) => {
	return !(!query || query.trim() === '');
};

const validRole = (role) => {
	return validRoles.has(role);
};

// allows  blank or missing value
// if it has a value, it must be numberic, and within range
const validPageNumber = (pageNumber) => {
	let valid = true;

	if (pageNumber) {
		valid = Number(pageNumber) ? !!(pageNumber > 0 && pageNumber <= maxResultsPerPage) : false;
	}
	return valid;
};

// allows  blank or missing value
// if it has a value, it must be numberic, and within range
const validPageSize = (pageSize) => {
	let valid = true;

	if (pageSize) {
		valid = Number(pageSize) ? !!(pageSize > 0 && pageSize <= maxPages) : false;
	}
	return valid;
};
