import { capitalize } from 'lodash-es';
import { dayMonthYearToApiDateString, dateToDisplayDate, dateToDisplayTime } from '#lib/dates.js';
import { kilobyte, megabyte, gigabyte } from '#appeals/appeal.constants.js';
import { buildNotificationBanners } from '#lib/mappers/notification-banners.mapper.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { surnameFirstToFullName } from '#lib/person-name-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';

/**
 * @typedef {import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse} Appeal
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
 * @property {string} addDocumentUrl
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
			addVersionUrl: mapDocumentUploadUrl(caseId, folder, document),
			addDocumentUrl: mapDocumentUploadUrl(caseId, folder)
		};
	});

	return {
		addDocumentUrl: mapDocumentUploadUrl(caseId, folder),
		manageDocumentsUrl: mapDocumentManageUrl(caseId, folder),
		documents: singleDocument ? (documentMap.length ? [documentMap[0]] : []) : documentMap
	};
};

/**
 * @param {string|number} appealId
 * @param {string} documentId
 * @param {number} [documentVersion]
 */
export const mapDocumentDownloadUrl = (appealId, documentId, documentVersion) => {
	if (documentVersion) {
		return `/documents/${appealId}/download/${documentId}/${documentVersion}/preview/`;
	}
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
 * @param {string} backLinkUrl
 * @param {FolderInfo & {id: string}} folder - API type needs to be updated here (should be Folder, but there are worse problems with that type)
 * @param {Object<string, any>} bodyItems
 * @returns {PageContent}
 */
export function addDocumentDetailsPage(backLinkUrl, folder, bodyItems) {
	const unpublishedDocuments = folder.documents.filter(
		(document) => document.latestDocumentVersion?.published === false
	);

	/** @type {PageContent} */
	const pageContent = {
		title: 'Add document details',
		backLinkText: 'Back',
		backLinkUrl: backLinkUrl?.replace('{{folderId}}', folder.id),
		preHeading: 'Add document details',
		heading: `${folderPathToFolderNameText(folder.path)} documents`,
		pageComponentGroups: unpublishedDocuments.map((document, index) => ({
			wrapperHtml: {
				opening: `<div class="govuk-form-group"><h2 class="govuk-heading-m">${document.name}</h2>`,
				closing:
					index < unpublishedDocuments.length - 1
						? '<hr class="govuk-!-margin-top-7"></div>'
						: '</div>'
			},
			pageComponents: [
				{
					type: 'input',
					parameters: {
						type: 'hidden',
						name: `items[${index}][documentId]`,
						value: document.id
					}
				},
				{
					type: 'date-input',
					parameters: {
						id: `items[${index}]receivedDate`,
						namePrefix: `items[${index}][receivedDate]`,
						fieldset: {
							legend: {
								text: 'Date received'
							}
						},
						items: [
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
								id: `items[${index}].receivedDate.day`,
								name: '[day]',
								label: 'Day',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.day || ''
							},
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
								id: `items[${index}].receivedDate.month`,
								name: '[month]',
								label: 'Month',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.month || ''
							},
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-4',
								id: `items[${index}].receivedDate.year`,
								name: '[year]',
								label: 'Year',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.year || ''
							}
						]
					}
				},
				{
					type: 'radios',
					parameters: {
						name: `items[${index}][redactionStatus]`,
						fieldset: {
							legend: {
								text: 'Redaction'
							}
						},
						items: [
							{
								text: 'Redacted',
								value: 'redacted',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'redacted'
							},
							{
								text: 'Unredacted',
								value: 'unredacted',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'unredacted'
							},
							{
								text: 'No redaction required',
								value: 'no redaction required',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'no redaction required'
							}
						]
					}
				}
			]
		}))
	};

	return pageContent;
}

/**
 * @param {string} backLinkUrl
 * @param {string} viewAndEditUrl
 * @param {FolderInfo & {id: string, caseId: string}} folder - API type needs to be updated here (should be Folder, but there are worse problems with that type)
 * @param {RedactionStatus[]} redactionStatuses
 * @returns {PageContent}
 */
export function manageFolderPage(backLinkUrl, viewAndEditUrl, folder, redactionStatuses) {
	/** @type {PageContent} */
	const pageContent = {
		title: 'Manage documents',
		backLinkText: 'Back',
		backLinkUrl: backLinkUrl?.replace('{{folderId}}', folder.id),
		preHeading: 'Manage documents',
		heading: `${folderPathToFolderNameText(folder.path)} documents`,
		pageComponents: [
			{
				type: 'table',
				parameters: {
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
			}
		]
	};

	return pageContent;
}

/**
 * @param {string} backLinkUrl
 * @param {RedactionStatus[]} redactionStatuses
 * @param {DocumentDetails} document
 * @param {FolderInfo & {id: string, caseId: string}} folder - API type needs to be updated here (should be Folder, but there are worse problems with that type)
 * @param {import('@pins/express/types/express.js').Request} request
 * @returns {Promise<PageContent>}
 */
export async function manageDocumentPage(
	backLinkUrl,
	redactionStatuses,
	document,
	folder,
	request
) {
	const uploadUrl = request.originalUrl.replace('manage-documents', 'add-documents');
	const changeDetailsUrl = request.originalUrl.replace(
		'manage-documents',
		'change-document-details'
	);
	const session = request.session;

	let notificationBannerComponents;
	if (document.caseId) {
		notificationBannerComponents = buildNotificationBanners(
			session,
			'manageDocuments',
			document.caseId
		);
	}

	/** @type {PageContent} */
	const pageContent = {
		title: 'Manage documents',
		backLinkText: 'Back',
		backLinkUrl: backLinkUrl?.replace('{{folderId}}', folder.id),
		preHeading: 'Manage documents',
		heading: document?.name || '',
		notificationBannerComponents: notificationBannerComponents,
		pageComponentGroups: [
			{
				wrapperHtml: {
					opening: '<div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds">',
					closing: ''
				},
				pageComponents: [
					{
						type: 'summary-list',
						parameters: {
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
												href: changeDetailsUrl
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
												href: changeDetailsUrl
											}
										]
									}
								}
							]
						}
					}
				]
			},
			{
				wrapperHtml: {
					opening: '',
					closing: '</div></div>'
				},
				pageComponents: [
					{
						type: 'button',
						parameters: {
							id: 'upload-updated-document',
							href: uploadUrl,
							classes: 'govuk-!-margin-right-2',
							text: 'Upload an updated document'
						}
					},
					{
						type: 'button',
						parameters: {
							id: 'remove-document',
							href: '#',
							classes: 'govuk-button--secondary',
							text: 'Remove this document'
						}
					}
				]
			},
			{
				wrapperHtml: {
					opening:
						'<div class="govuk-grid-row"><div class="govuk-grid-column-full"><h2>Document history</h2><p class="govuk-body">See version history, a change log or remove old documents</p>',
					closing: '</div></div>'
				},
				pageComponents: [
					{
						type: 'details',
						parameters: {
							summaryText: 'Document history',
							html: '',
							pageComponents: [
								{
									type: 'table',
									parameters: {
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
																	document.guid,
																	documentVersion.version
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
													text: mapRedactionStatusIdToName(
														redactionStatuses,
														documentVersion.redactionStatusId
													)
												},
												{
													html: '<a class="govuk-link" href="#">Remove</a>'
												}
											])
										)
									}
								}
							]
						}
					}
				]
			}
		]
	};

	pageContent.pageComponentGroups?.forEach((group) =>
		preRenderPageComponents(group.pageComponents)
	);

	return pageContent;
}

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
export const mapRedactionStatusIdToName = (redactionStatuses, redactionStatusId) => {
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

	return nameText.trim();
};

/**
 * @typedef {Object} MappedDocumentRow
 * @property {(string[] | string | HtmlLink[] | HtmlLink)} value
 * @property {ActionItemProperties[]} actions
 * @property {import('#lib/nunjucks-template-builders/tag-builders.js').HtmlTagType} valueType
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
							text: 'Add',
							href: document.addDocumentUrl
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

/**
 * @param {string} backLinkUrl
 * @param {FolderInfo & {id: string}} folder - API type needs to be updated here (should be Folder, but there are worse problems with that type)
 * @param {Object<string, any>} bodyItems
 * @returns {PageContent}
 */
export function changeDocumentDetailsPage(backLinkUrl, folder, bodyItems) {
	const latestDocuments = folder.documents.filter(
		(document) => document.latestDocumentVersion?.published === true
	);

	/** @type {PageContent} */
	const pageContent = {
		title: 'Change document details',
		backLinkText: 'Back',
		backLinkUrl: backLinkUrl?.replace('{{folderId}}', folder.id),
		preHeading: 'Change document details',
		heading: `${folderPathToFolderNameText(folder.path)} documents`,
		pageComponentGroups: latestDocuments.map((document, index) => ({
			wrapperHtml: {
				opening: `<div class="govuk-form-group"><h2 class="govuk-heading-m">${document.name}</h2>`,
				closing:
					index < latestDocuments.length - 1 ? '<hr class="govuk-!-margin-top-7"></div>' : '</div>'
			},
			pageComponents: [
				{
					type: 'input',
					parameters: {
						type: 'hidden',
						name: `items[${index}][documentId]`,
						value: document.id
					}
				},
				{
					type: 'date-input',
					parameters: {
						id: `items[${index}]receivedDate`,
						namePrefix: `items[${index}][receivedDate]`,
						fieldset: {
							legend: {
								text: 'Date received'
							}
						},
						items: [
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
								id: `items[${index}].receivedDate.day`,
								name: '[day]',
								label: 'Day',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.day || ''
							},
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
								id: `items[${index}].receivedDate.month`,
								name: '[month]',
								label: 'Month',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.month || ''
							},
							{
								classes: 'govuk-input govuk-date-input__input govuk-input--width-4',
								id: `items[${index}].receivedDate.year`,
								name: '[year]',
								label: 'Year',
								value:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.receivedDate.year || ''
							}
						]
					}
				},
				{
					type: 'radios',
					parameters: {
						name: `items[${index}][redactionStatus]`,
						fieldset: {
							legend: {
								text: 'Redaction'
							}
						},
						items: [
							{
								text: 'Redacted',
								value: 'redacted',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'redacted'
							},
							{
								text: 'Unredacted',
								value: 'unredacted',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'unredacted'
							},
							{
								text: 'No redaction required',
								value: 'no redaction required',
								checked:
									bodyItems?.find(
										(/** @type {{ documentId: string; }} */ item) => item.documentId === document.id
									)?.redactionStatus === 'no redaction required'
							}
						]
					}
				}
			]
		}))
	};

	return pageContent;
}
