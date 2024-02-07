/**
@param {import('@pins/applications.api').Schema.Folder} folderEntity
@param {string} caseReference
 *
 * @returns {import('pins-data-model').Schemas.Folder} Folder
 */
export const buildNsipFolderPayload = (folderEntity, caseReference) => {
	// TODO: displayNameCy needs to be in the folder db table
	const { id, displayNameEn, displayNameCy = null, parentFolderId } = folderEntity || {};
	return {
		id,
		caseReference,
		displayNameEnglish: displayNameEn,
		displayNameWelsh: displayNameCy,
		parentFolderId
	};
};

/**
@param {import('@pins/applications.api').Schema.Folder[]} folderEntities
@param {string} caseReference
 *
 * @returns {import('pins-data-model').Schemas.Folder[]} Folder[]
 */
export const buildNsipFoldersPayload = (folderEntities, caseReference) => {
	return folderEntities
		.map((folderEntity) => buildNsipFolderPayload(folderEntity, caseReference))
		.sort(({ id: firstId }, { id: secondId }) => {
			return firstId - secondId;
		});
};
