/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Appeals.SingleFolderResponse} SingleFolderResponse */

/**
 * @param {Folder} folder
 * @returns {SingleFolderResponse}
 */
const formatFolder = (folder) => ({
	caseId: folder.caseId,
	// @ts-ignore
	documents:
		folder.documents?.map((/** @type {Document} */ document) => ({
			id: document.guid,
			name: document.name,
			latestDocumentVersion: {
				published: document?.latestDocumentVersion?.published,
				dateReceived: document?.latestDocumentVersion?.dateReceived,
				redactionStatus: document?.latestDocumentVersion?.redactionStatusId,
				virusCheckStatus: document?.latestDocumentVersion?.virusCheckStatus,
				size: document?.latestDocumentVersion?.size,
				mime: document?.latestDocumentVersion?.mime,
				draft: document?.latestDocumentVersion?.draft
			}
		})) || null,
	id: folder.id,
	path: folder.path
});

export { formatFolder };
