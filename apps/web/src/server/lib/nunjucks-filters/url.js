import slugify from 'slugify';

/** @typedef {import('../../applications/applications.types').DomainType} DomainType */
/** @typedef {import('../../applications/applications.types').DocumentationCategory} DocumentationCategory */

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} caseId
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

	return argument ? `${argument}` : '';
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
	const caseId = getArgument('caseId', filterArguments);
	const step = getArgument('step', filterArguments);
	const documentationCategory = makeDocumentationCategoryPath(filterArguments);

	switch (key) {
		case 'base-url':
			return `${domainUrl}`;
		case 'case-create':
			return `${domainUrl}/create-new-case/${caseId}/${step}`;
		case 'case-edit':
			return `${domainUrl}/case/${caseId}/edit/${step}`;
		case 'case-view':
			return `${domainUrl}/case/${caseId}/${step}`;
		case 'dashboard':
			return `${domainUrl}/${domainType}`;
		case 'document-category':
			return `${domainUrl}/case/${caseId}/project-documentation/${documentationCategory}/${step}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		default:
			return 'app/404';
	}
};
