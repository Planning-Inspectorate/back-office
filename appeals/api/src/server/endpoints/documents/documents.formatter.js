/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Appeals.SingleFolderResponse} SingleFolderResponse */

/**
 * @param {Folder} folder
 * @returns {SingleFolderResponse}
 */
const formatFolder = (folder) => ({
	caseId: folder.caseId,
	documents:
		folder.documents?.map((/** @type {Document} */ document) => ({
			id: document.guid,
			name: document.name,
			latestDocumentVersion: {
				publishedStatus: document?.latestDocumentVersion?.publishedStatus
			}
		})) || null,
	id: folder.id,
	path: folder.path
});

export { formatFolder };
