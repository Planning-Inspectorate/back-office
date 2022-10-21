import slugify from 'slugify';

/** @typedef {import('../../applications/applications.types').DomainType} DomainType */
/** @typedef {import('../../applications/applications.types').DocumentationCategory} DocumentationCategory */

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} applicationId
 * @property {string=} step
 * @property {string=} query
 * @property {DocumentationCategory=} documentationCategory
 */

/**
 *
 * @param {string} argumentName
 * @param {Record<string, any>} filterArguments
 * @returns {string}
 */
const getArgument = (argumentName, filterArguments) => {
	const argument = filterArguments[argumentName];

	return argument ? `${argument}/` : '';
};

// TODO: handle subfolders
/**
 *
 * @param {urlFilterArguments} filterArguments
 * @returns {string}
 */
const makeDocumentationCategoryPath = (filterArguments) => {
	const { documentationCategory } = filterArguments;
	const { id, displayNameEn } = documentationCategory || {};
	const documentationCategoryId = id ? `${id}/` : '';
	const documentationCategoryName = displayNameEn ? slugify(displayNameEn, { lower: true }) : '';

	return `${documentationCategoryId}${documentationCategoryName}`;
};

/**
 * Register the url filter
 *
 * @param {string} key
 * @param {urlFilterArguments} filterArguments
 * @returns {string}
 */
export const url = (key, filterArguments = {}) => {
	const domainUrl = '/applications-service';
	const { query } = filterArguments;

	const domainType = getArgument('domainType', filterArguments);
	const applicationId = getArgument('applicationId', filterArguments);
	const step = getArgument('step', filterArguments);
	const documentationCategory = makeDocumentationCategoryPath(filterArguments);

	switch (key) {
		case 'applications-create':
			return `${domainUrl}/create-new-case/${applicationId}${step}`;
		case 'applications-edit':
			return `${domainUrl}/case/${applicationId}edit/${step}`;
		case 'dashboard':
			return `${domainUrl}/${domainType}`;
		case 'document-category':
			return `${domainUrl}/case/${applicationId}project-documentation/${documentationCategory}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		case 'view-application':
			return `${domainUrl}/case/${applicationId}${step}`;
		default:
			return 'app/404';
	}
};
