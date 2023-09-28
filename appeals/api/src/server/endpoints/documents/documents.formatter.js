/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Appeals.SingleFolderResponse} SingleFolderResponse */

/**
 * @param {Folder} folder
 * @returns {SingleFolderResponse}
 */
const formatFolder = (folder) => ({
	caseId: folder.caseId,
	documents:
		folder.documents?.map((document) => ({
			id: document.guid,
			name: document.name
		})) || null,
	id: folder.id,
	path: folder.path
});

export { formatFolder };
