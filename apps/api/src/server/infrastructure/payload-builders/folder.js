/**
@param {import('@pins/applications.api').Schema.Folder} folderEntity
@param {string} caseReference
 *
 * @returns {import('pins-data-model').Schemas.Folder} Folder
 */
export const buildFolderPayload = (folderEntity, caseReference) => {
	// TODO: displayNameCy needs to be in the folder db table, default to displayNameEn for now
	const { id, displayNameEn, displayNameCy, parentFolderId } = folderEntity || {};
	return {
		id,
		caseReference,
		displayNameEnglish: displayNameEn,
		displayNameWelsh: displayNameCy || displayNameEn,
		parentFolderId
	};
};

/**
@param {import('@pins/applications.api').Schema.Folder[]} folderEntities
@param {string} caseReference
 *
 * @returns {import('pins-data-model').Schemas.Folder[]} Folder[]
 */
export const buildFoldersPayload = (folderEntities, caseReference) => {
	return folderEntities
		.map((folderEntity) => buildFolderPayload(folderEntity, caseReference))
		.sort(({ id: firstId }, { id: secondId }) => {
			return firstId - secondId;
		});
};
