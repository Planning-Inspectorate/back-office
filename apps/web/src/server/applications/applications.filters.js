import nunjucks from '../app/config/nunjucks.js';

/** @typedef {import('./applications.types').DomainType} DomainType */
/** @typedef {import('nunjucks').Environment} Environment */

/**
 * Register all the filters under this domain.
 *
 * @type {import('express').RequestHandler<{}, *, *, *, {}>}
 */
export const registerFilters = (req, response, next) => {
	setDisplayValueFilter();

	next();
};

/**
 * Register the displayValue filter for the domainType
 *
 * @returns {Environment}
 */
const setDisplayValueFilter = () =>
	nunjucks.addFilter('displayValue', (/** @type {DomainType} */ key) => {
		switch (key) {
			case 'case-admin-officer':
				return 'Case admin officer';
			case 'case-officer':
				return 'Case officer';
			case 'inspector':
				return 'Inspector';
			default:
				return '';
		}
	});
