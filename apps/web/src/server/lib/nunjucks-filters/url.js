import slugify from 'slugify';

/** @typedef {import('../../applications/applications.types').DomainType} DomainType */
/** @typedef {import('../../applications/applications.types').DocumentationCategory} DocumentationCategory */

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} caseId
 * @property {number=} folderId
 * @property {number=} representationId
 * @property {string=} documentGuid
 * @property {string=} step
 * @property {string=} query
 * @property {Partial<DocumentationCategory>=} documentationCategory
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
	const folderId = getArgument('folderId', filterArguments);
	const documentGuid = getArgument('documentGuid', filterArguments);
	const timetableId = getArgument('timetableId', filterArguments);
	const isPreviewActive = getArgument('isPreviewActive', filterArguments);
	const step = getArgument('step', filterArguments);
	const representationId = getArgument('representationId', filterArguments);
	const documentationCategory = makeDocumentationCategoryPath(filterArguments);
	const version = getArgument('version', filterArguments);

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
		case 'document':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/document/${documentGuid}/${step}`;
		case 'document-edit':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/document/${documentGuid}/edit/${step}`;
		case 'document-category':
			return `${domainUrl}/case/${caseId}/project-documentation/${documentationCategory}/${step}`;
		case 'document-download':
			return `/documents/${caseId}/download/${documentGuid}/version/${version}/${
				isPreviewActive ? 'preview' : ''
			}`;
		case 'documents-queue':
			return `${domainUrl}/case/${caseId}/project-documentation/publishing-queue`;
		case 'project-updates':
			return `${domainUrl}/case/${caseId}/project-updates`;
		case 'project-updates-step':
			return `${domainUrl}/case/${caseId}/project-updates/${step}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		case 'timetable':
			return `${domainUrl}/case/${caseId}/examination-timetable/${step}`;
		case 'timetable-item':
			return `${domainUrl}/case/${caseId}/examination-timetable/item/${step}/${timetableId}`;
		case 'representation-details':
			return `${domainUrl}/case/${caseId}/relevant-representations/${representationId}/representation-details`;
		case 'redact-representation':
			return `${domainUrl}/case/${caseId}/relevant-representations/${representationId}/representation-details/redact-representation`;
		case 'change-status':
			return `${domainUrl}/case/${caseId}/relevant-representations/${representationId}/representation-details/change-status`;
		case 'status-result':
			return `${domainUrl}/case/${caseId}/relevant-representations/${representationId}/representation-details/status-result`;
		default:
			return 'app/404';
	}
};
