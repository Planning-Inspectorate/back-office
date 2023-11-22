import slugify from 'slugify';

/** @typedef {import('../../applications/applications.types').DomainType} DomainType */
/** @typedef {import('../../applications/applications.types').DocumentationCategory} DocumentationCategory */

/**
 * @typedef {object} urlFilterArguments
 * @property {DomainType=} domainType
 * @property {number=} caseId
 * @property {number=} folderId
 * @property {number=} representationId
 * @property {number=} projectUpdateId
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
	const adviceId = getArgument('adviceId', filterArguments);
	const userId = getArgument('userId', filterArguments);
	const isPreviewActive = getArgument('isPreviewActive', filterArguments);
	const step = getArgument('step', filterArguments);
	const representationId = getArgument('representationId', filterArguments);
	const documentationCategory = makeDocumentationCategoryPath(filterArguments);
	const version = getArgument('version', filterArguments);
	const projectUpdateId = getArgument('projectUpdateId', filterArguments);

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
		case 'project-updates-create':
			return `${domainUrl}/case/${caseId}/project-updates/create`;
		case 'project-updates-step':
			return `${domainUrl}/case/${caseId}/project-updates/${projectUpdateId}/${step}`;
		case 'project-team':
			return `${domainUrl}/case/${caseId}/project-team/${step}`;
		case 'project-team-member':
			return `${domainUrl}/case/${caseId}/project-team/${userId}/${step}`;
		case 'search-results':
			return `${domainUrl}/search-results/${step}?q=${query}`;
		case 's51-create':
			return `${domainUrl}/case/${caseId}/project-documentation/${documentationCategory}/create/${step}`;
		case 's51-item':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/${adviceId}/${step}`;
		case 's51-attachment':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/${adviceId}/attachments/${documentGuid}/${step}`;
		case 's51-edit':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/${adviceId}/edit/${step}`;
		case 's51-status':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/change-status`;
		case 's51-list':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/${step}`;
		case 's51-queue-remove':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/publishing-queue/remove/${adviceId}`;
		case 's51-unpublish':
			return `${domainUrl}/case/${caseId}/project-documentation/${folderId}/s51-advice/unpublish/${adviceId}`;
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
		case 'key-dates':
			return `${domainUrl}/case/${caseId}/key-dates/${step}`;
		default:
			return 'app/404';
	}
};
