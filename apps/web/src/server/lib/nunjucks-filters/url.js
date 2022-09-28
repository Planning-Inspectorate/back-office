/** @typedef {import('../../applications/applications.types').DomainType} DomainType */
/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} applicationId
 * @property {string=} step
 * @property {string=} query
 */

/**
 * Register the url filter
 *
 * @param {string} key
 * @param {urlFilterArguments} filterArguments
 * @returns {string}
 */
export const url = (key, filterArguments) => {
	const domainUrl = '/applications-service';

	const { domainType, applicationId, step, query } = filterArguments || {};

	switch (key) {
		case 'dashboard':
			return `${domainUrl}/${domainType || ''}`;
		case 'applications-create':
			return `${domainUrl}/create-new-case/${applicationId ? `${applicationId}/` : ''}${
				step ? `${step}/` : ''
			}`;
		case 'view-application':
			return `${domainUrl}/case/${applicationId ? `${applicationId}/` : ''}${
				step ? `${step}/` : ''
			}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		default:
			return 'app/404';
	}
};
