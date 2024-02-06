import { isFolderInfo } from '#lib/ts-utilities.js';
import { getFolder } from '#appeals/appeal-documents/appeal.documents.service.js';
import { folderPathToFolderNameText } from '#appeals/appeal-documents/appeal-documents.mapper.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

/**
 * @param {number} appealId
 * @param {Object<string, import('@pins/appeals.api').Appeals.FolderInfo | {}>} documents
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {import('got').Got} apiClient
 * @param {string} addDetailsUrlTemplate
 */
export async function addDraftDocumentsNotificationBanner(
	appealId,
	documents,
	session,
	apiClient,
	addDetailsUrlTemplate
) {
	/** @type {import('@pins/appeals.api').Appeals.FolderInfo[]} */
	const folderInfos = [];

	for (const folderKey in documents) {
		const folderInfo = documents[folderKey];

		if (isFolderInfo(folderInfo)) {
			folderInfos.push(folderInfo);
		}
	}

	const folders = await Promise.all(
		folderInfos.map((folderInfo) => getFolder(apiClient, appealId, folderInfo.folderId))
	);

	/** @type {{ id: number; name: string; }[]} */
	const foldersToLink = [];

	for (const folder of folders) {
		if (folder && folder.documents) {
			for (const document of folder.documents) {
				const folderToLink = {
					id: folder.id,
					name: `${folderPathToFolderNameText(folder.path)} documents`
				};

				if (document?.latestDocumentVersion?.draft && !foldersToLink.includes(folderToLink)) {
					foldersToLink.push(folderToLink);
					break;
				}
			}
		}
	}

	if (foldersToLink.length > 0) {
		addNotificationBannerToSession(
			session,
			'foldersWithDraftDocuments',
			appealId,
			`<p class="govuk-notification-banner__heading">Some document details were not entered during upload.</p><p class="govuk-body">Default settings have been added but may be incorrect. You need to review and change (if applicable) the details for: </p><ul class="govuk-list">${foldersToLink
				.map(
					(folderToLink) =>
						`<li><a class="govuk-link" href="${addDetailsUrlTemplate.replace(
							'{{folderId}}',
							folderToLink.id.toString()
						)}">${folderToLink.name}</a></li>`
				)
				.join('')
				.trim()}</ul>`
		);
	}
}
