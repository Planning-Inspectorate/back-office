import nunjucks from '../app/config/nunjucks.js';

/** @typedef {import('./applications.types').DomainType} DomainType */
/** @typedef {import('nunjucks').Environment} Environment */

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} applicationId
 */

/**
 * Register all the filters under this domain.
 *
 * @type {import('express').RequestHandler<{}, *, *, *, {}>}
 */
export const registerFilters = (req, response, next) => {
	setDisplayValueFilter();
	setUrlFilter();

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

/**
 * Register the url filter
 *
 * @returns {Environment}
 */
const setUrlFilter = () =>
	nunjucks.addFilter(
		'url',
		(/** @type {string} */ key, /** @type {urlFilterArguments} */ filterArguments) => {
			const domainUrl = '/applications-service';

			const { domainType, applicationId } = filterArguments || {};

			switch (key) {
				case 'dashboard':
					return `${domainUrl}/${domainType || ''}`;
				case 'create-new-application':
					return `${domainUrl}/create-new-case`;
				case 'view-application':
					return `${domainUrl}/${domainType || ''}/applications/${applicationId || ''}`;
				default:
					return 'app/404';
			}
		}
	);
