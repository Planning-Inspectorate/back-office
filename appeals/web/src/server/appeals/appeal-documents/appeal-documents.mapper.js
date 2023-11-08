import { capitalize } from 'lodash-es';
import { dayMonthYearToApiDateString, dateToDisplayDate, dateToDisplayTime } from '#lib/dates.js';
import { kilobyte, megabyte, gigabyte } from '#appeals/appeal.constants.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { surnameFirstToFullName } from '#lib/person-name-formatter.js';

/**
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 * @typedef {import('@pins/appeals.api').Appeals.LatestDocumentVersionInfo} LatestDocumentVersionInfo
 * @typedef {import('@pins/appeals.api').Appeals.SingleFolderResponse} SingleFolderResponse
 * @typedef {import('#lib/nunjucks-template-builders/tag-builders.js').HtmlLink} HtmlLink
 * @typedef {import('@pins/appeals.api').Schema.DocumentRedactionStatus} RedactionStatus
 * @typedef {import('@pins/appeals.api').Api.DocumentDetails} DocumentDetails
 * @typedef {import('@pins/appeals.api').Api.DocumentVersionDetails} DocumentVersionDetails
 * @typedef {import('@pins/appeals.api').Api.DocumentVersionAuditEntry} DocumentVersionAuditEntry
 */

/**
 * @typedef {Object} MappedFolderForListBuilder
 * @property {string} addDocumentUrl
 * @property {string} manageDocumentsUrl
 * @property {MappedDocumentForListBuilder[]} documents
 */

/**
 * @typedef {Object} MappedDocumentForListBuilder
 * @property {string} title
 * @property {string} href
 * @property {string} addVersionUrl
 */

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {function} mapDocumentUploadUrl
 * @param {function} mapDocumentManageUrl
 * @param {boolean?} [singleDocument]
 * @returns {MappedFolderForListBuilder}
 */
export const mapFolder = (
	caseId,
	folder,
	mapDocumentUploadUrl,
	mapDocumentManageUrl,
	singleDocument = true
) => {
	const { documents } = folder;
	const documentMap = (documents || []).map((document) => {
		return {
			title: document.name,
			href: mapDocumentDownloadUrl(caseId, document.id),
			addVersionUrl: mapDocumentUploadUrl(caseId, folder, document)
		};
	});

	return {
		addDocumentUrl: mapDocumentUploadUrl(caseId, folder),
		manageDocumentsUrl: mapDocumentManageUrl(caseId, folder),
		documents: singleDocument ? (documentMap.length ? [documentMap[0]] : []) : documentMap
	};
};

/**
 * @param {number} appealId
 * @param {string} documentId
 */
export const mapDocumentDownloadUrl = (appealId, documentId) => {
	return `/documents/${appealId}/download/${documentId}/preview/`;
};

/**
 * @param {string|null|undefined} fileName
 * @returns {string}
 */
const mapDocumentFileNameToFileExtension = (fileName) => {
	if (!fileName) {
		return '';
	}

	const nameFragments = fileName.split('.');

	return nameFragments[nameFragments.length - 1].toUpperCase();
};

/**
 * @param {number|null|undefined} fileSize
 * @returns {string}
 */
const mapDocumentSizeToFileSizeString = (fileSize) => {
	if (!fileSize) {
		return '';
	}

	if (fileSize < kilobyte) {
		return `${fileSize} bytes`;
	} else if (fileSize < megabyte) {
		return `${Math.round(fileSize / kilobyte)} KB`;
	} else if (fileSize < gigabyte) {
		return `${(fileSize / megabyte).toFixed(1)} MB`;
	} else {
		return `${(fileSize / gigabyte).toFixed(2)} GB`;
	}
};

/**
 *
 * @param {DocumentInfo|undefined} document
 * @returns {string}
 */
const mapDocumentFileTypeAndSize = (document) => {
	if (!document?.latestDocumentVersion) {
		return '';
	}

	return `${mapDocumentFileNameToFileExtension(document.name)}, ${mapDocumentSizeToFileSizeString(
		document.latestDocumentVersion?.size
	)}`;
};

/**
 * @typedef {Object} AddDocumentDetailsItemParams
 * @property {string} documentName
 * @property {string} documentId
 */

/**
 * @typedef {Object} AddDocumentDetailsPageParams
 * @property {string} folderName
 * @property {AddDocumentDetailsItemParams[]} detailsItems
 */

/**
 * @param {FolderInfo} folder
 * @param {Object<string, any>} bodyItems
 * @returns {AddDocumentDetailsPageParams}
 */
export const mapFolderToAddDetailsPageParams = (folder, bodyItems) => ({
	folderName: folderPathToFolderNameText(folder.path),
	detailsItems: folder.documents
		.filter((document) => document.latestDocumentVersion?.published === false)
		.map((document) => ({
			documentName: document.name,
			documentId: document.id,
			...(bodyItems && {
				receivedDate: bodyItems.find(
					(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
				)?.receivedDate,
				redactionStatus: bodyItems.find(
					(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
				)?.redactionStatus
			})
		}))
});

/**
 * @typedef {Object} ManageFolderPageParams
 * @property {string} folderName
 * @property {TableProperties} tableProperties
 */

/**
 *
 * @param {SingleFolderResponse} folder
 * @param {RedactionStatus[]} redactionStatuses
 * @param {string} viewAndEditUrl
 * @returns {ManageFolderPageParams}
 */
export const mapFolderToManageFolderPageParameters = (
	folder,
	redactionStatuses,
	viewAndEditUrl
) => ({
	folderName: folderPathToFolderNameText(folder.path),
	tableProperties: {
		head: [
			{
				text: 'Document information'
			},
			{
				text: 'Date received'
			},
			{
				text: 'Redaction'
			},
			{
				text: 'Actions'
			}
		],
		rows: (folder?.documents || []).map((document) => [
			{
				html: `${
					document && document?.id
						? `<div class="govuk-!-margin-bottom-4">
							<a class="govuk-link" href="${mapDocumentDownloadUrl(folder.caseId, document.id)}">${
								document.name || ''
						  }</a>
						</div>`
						: ''
				}
					<dl class="govuk-body govuk-!-font-size-16 pins-inline-definition-list"><dt>File type and size:&nbsp;</dt><dd>${mapDocumentFileTypeAndSize(
						document
					)}</dd></dl>
				`.trim()
			},
			{
				text: dateToDisplayDate(document?.latestDocumentVersion?.dateReceived)
			},
			{
				text:
					mapRedactionStatusIdToName(
						redactionStatuses,
						document?.latestDocumentVersion?.redactionStatus
					) || ''
			},
			{
				html: `<a href="${viewAndEditUrl
					.replace('{{folderId}}', folder.id.toString())
					.replace('{{documentId}}', document.id)}" class="govuk-link">View and edit</a>`
			}
		])
	}
});

/**
 * @typedef {Object} ManageDocumentPageParams
 * @property {string} documentName
 * @property {SummaryListProperties} summaryListProperties
 * @property {ButtonProperties} updateDocumentButtonProperties
 * @property {ButtonProperties} removeDocumentButtonProperties
 * @property {TableProperties} documentHistoryTableProperties
 */

/**
 * @param {RedactionStatus[]} redactionStatuses
 * @param {DocumentDetails} document
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {Promise<ManageDocumentPageParams>}
 */
export const mapDocumentDetailsToManageDocumentPageParameters = async (
	document,
	redactionStatuses,
	session
) => ({
	documentName: document?.name || '',
	summaryListProperties: {
		rows: [
			{
				key: { text: 'File' },
				value: {
					html:
						document && document?.caseId && document?.guid
							? `<a class="govuk-link" href="${mapDocumentDownloadUrl(
									document.caseId,
									document.guid
							  )}">${document.name || ''}</a>`
							: ''
				}
			},
			{
				key: { text: 'Version' },
				value: {
					text: document?.latestVersionId?.toString() || ''
				}
			},
			{
				key: { text: 'Date received' },
				value: {
					text: dateToDisplayDate(getDocumentLatestVersion(document)?.dateReceived)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: '#'
						}
					]
				}
			},
			{
				key: { text: 'Redaction' },
				value: {
					text: mapRedactionStatusIdToName(
						redactionStatuses,
						getDocumentLatestVersion(document)?.redactionStatusId
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: '#'
						}
					]
				}
			}
		]
	},
	updateDocumentButtonProperties: {
		id: 'upload-updated-document',
		href: '#',
		classes: 'govuk-!-margin-right-2',
		text: 'Upload an updated document'
	},
	removeDocumentButtonProperties: {
		id: 'remove-document',
		href: '#',
		classes: 'govuk-button--secondary',
		text: 'Remove this document'
	},
	documentHistoryTableProperties: {
		classes: 'govuk-!-font-size-16',
		head: [
			{
				text: 'Version'
			},
			{
				text: 'Document name'
			},
			{
				text: 'Activity'
			},
			{
				text: 'Redaction'
			},
			{
				text: 'Action'
			}
		],
		rows: await Promise.all(
			(document.documentVersion || []).map(async (documentVersion) => [
				{
					text: documentVersion.version?.toString() || ''
				},
				{
					html:
						document?.caseId && document?.guid
							? `<a class="govuk-link" href="${mapDocumentDownloadUrl(
									document.caseId,
									document.guid
							  )}">${document.name || ''}</a>${
									typeof document.latestVersionId === 'number' &&
									typeof documentVersion.version === 'number' &&
									documentVersion.version === document.latestVersionId
										? `<br/><strong class="govuk-tag govuk-tag--blue single-line govuk-!-margin-top-3">CURRENT VERSION</strong>`
										: ''
							  }`
							: ''
				},
				{
					html: await mapDocumentVersionToAuditActivityHtml(
						documentVersion,
						document.versionAudit || [],
						session
					)
				},
				{
					text: mapRedactionStatusIdToName(redactionStatuses, documentVersion.redactionStatusId)
				},
				{
					html: '<a class="govuk-link" href="#">Remove</a>'
				}
			])
		)
	}
});

/**
 * @param {DocumentDetails} document
 * @returns {DocumentVersionDetails|undefined}
 */
const getDocumentLatestVersion = (document) => {
	return document?.documentVersion?.find(
		(documentVersion) => documentVersion.version === document?.latestVersionId
	);
};

/**
 *
 * @param {DocumentVersionDetails} documentVersion
 * @param {DocumentVersionAuditEntry[]} documentVersionAuditItems
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 */
const mapDocumentVersionToAuditActivityHtml = async (
	documentVersion,
	documentVersionAuditItems,
	session
) => {
	const matchingAuditItem = (documentVersionAuditItems || []).find(
		(auditItem) => auditItem.version === documentVersion.version
	);

	if (!matchingAuditItem) {
		return '';
	}

	if (matchingAuditItem.auditTrail?.loggedAt && matchingAuditItem.auditTrail?.user) {
		const loggedAt = new Date(matchingAuditItem.auditTrail.loggedAt);

		return `<p class="govuk-body"><strong>${matchingAuditItem.action}</strong>: ${dateToDisplayTime(
			loggedAt
		)}, ${dateToDisplayDate(loggedAt)},<br/>by ${await mapAuditTrailUserToName(
			matchingAuditItem.auditTrail?.user,
			session
		)}</p>`;
	}

	return '';
};

/**
 * @param {import('@pins/appeals.api/src/server/openapi-types.js').AuditTrailUserInfo} auditTrailUser
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {Promise<string>}
 */
const mapAuditTrailUserToName = async (auditTrailUser, session) => {
	let user = await usersService.getUserById(auditTrailUser.azureAdUserId || '', session);

	// TODO: how to handle sapId?

	if (user) {
		return surnameFirstToFullName(user.name);
	}

	return '';
};

/**
 *
 * @typedef {Object} DocumentDetailsFormItem
 * @property {string} documentId
 * @property {Object<string, string>} receivedDate
 * @property {string} redactionStatus
 */

/**
 *
 * @typedef {Object} DocumentDetailsFormData
 * @property {DocumentDetailsFormItem[]} items
 */

/**
 *
 * @param {DocumentDetailsFormData} formData
 * @param {import('@pins/appeals.api').Schema.DocumentRedactionStatus[]} redactionStatuses
 * @returns {import('./appeal.documents.service.js').DocumentDetailsAPIPatchRequest}
 */
export const mapDocumentDetailsFormDataToAPIRequest = (formData, redactionStatuses) => {
	return {
		documents: formData.items.map((item) => ({
			id: item.documentId,
			receivedDate: dayMonthYearToApiDateString({
				day: parseInt(item.receivedDate.day, 10),
				month: parseInt(item.receivedDate.month, 10),
				year: parseInt(item.receivedDate.year, 10)
			}),
			redactionStatus: mapRedactionStatusNameToId(redactionStatuses, item.redactionStatus)
		}))
	};
};

/**
 * @param {import('@pins/appeals.api').Schema.DocumentRedactionStatus[]} redactionStatuses
 * @param {string} redactionStatusName
 * @returns {number}
 */
const mapRedactionStatusNameToId = (redactionStatuses, redactionStatusName) => {
	for (const status of redactionStatuses) {
		if (status.name.toLowerCase() === redactionStatusName.toLowerCase()) {
			return status.id;
		}
	}
	return 0;
};

/**
 * @param {import('@pins/appeals.api').Schema.DocumentRedactionStatus[]} redactionStatuses
 * @param {number | null | undefined} redactionStatusId
 * @returns {string}
 */
const mapRedactionStatusIdToName = (redactionStatuses, redactionStatusId) => {
	if (!redactionStatusId) {
		return '';
	}

	for (const status of redactionStatuses) {
		if (status.id === redactionStatusId) {
			return status.name;
		}
	}
	return '';
};

/**
 *
 * @param {string} folderPath
 * @returns {string}
 */
const folderPathToFolderNameText = (folderPath) => {
	let nameText = capitalize(
		(folderPath.split('/')?.[1] || '').replace(/(?<!^)([A-Z])/g, ' $1').toLowerCase()
	);

	if (nameText.endsWith('documents')) {
		nameText = nameText.slice(0, -9);
	}

	return nameText;
};

/**
 * @typedef {Object} MappedDocumentRow
 * @property {(string[] | string | HtmlLink[] | HtmlLink)} value
 * @property {ActionItemProperties[]} actions
 * @property {import('#lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType} valueType
 * @property {{[key: string]: string} | null} [attributes]
 */

/**
 *
 * @param {Number} caseId
 * @param {FolderInfo} folder
 * @param {function} mapDocumentUploadUrl
 * @param {function} mapDocumentManageUrl
 * @param {boolean?} [readOnly]
 * @param {boolean?} [singleDocument]
 * @returns {MappedDocumentRow}
 */
export const mapDocumentsForDisplay = (
	caseId,
	folder,
	mapDocumentUploadUrl,
	mapDocumentManageUrl,
	readOnly = false,
	singleDocument = true
) => {
	const mappedFolder = mapFolder(
		caseId,
		folder,
		mapDocumentUploadUrl,
		mapDocumentManageUrl,
		singleDocument
	);
	const { documents } = mappedFolder;
	if (singleDocument && documents?.length) {
		const document = documents[0];
		return {
			value: { ...document, target: '_docpreview' },
			actions: readOnly
				? []
				: [
						{
							text: 'Manage',
							href: mappedFolder.manageDocumentsUrl
						},
						{
							text: 'Change',
							href: document.addVersionUrl
						}
				  ],
			valueType: 'link'
		};
	} else if (!documents?.length) {
		return {
			value: 'none',
			actions: readOnly
				? []
				: [
						{
							text: 'Add',
							href: mappedFolder.addDocumentUrl
						}
				  ],
			valueType: 'text'
		};
	}

	return {
		value: documents.map((/** @type {MappedDocumentForListBuilder} */ document) => {
			return { ...document, target: '_docpreview' };
		}),
		actions: readOnly
			? []
			: [
					{
						text: 'Manage',
						href: mappedFolder.manageDocumentsUrl
					},
					{
						text: 'Add',
						href: mappedFolder.addDocumentUrl
					}
			  ],
		valueType: 'link'
	};
};
