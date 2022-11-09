/** @typedef {import('./applications.types').DomainType} DomainType */
/** @typedef {import('nunjucks').Environment} Environment */

/**
 * Register all the filters under this domain.
 *
 * @type {import('express').RequestHandler<{}, *, *, *, {}>}
 */
export const registerFilters = (req, response, next) => {
	next();
};
