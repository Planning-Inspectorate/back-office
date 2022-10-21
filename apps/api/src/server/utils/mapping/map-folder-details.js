import { pick } from 'lodash-es';

/** @typedef {import('@pins/api').Schema.Folder[]} Folder */

/**
 *
 * @param { Folder[] } folderDetails
 * @returns { Partial<Folder>[]}
 */
export const mapFolderDetails = (folderDetails) => {
	const folderDetailsPicked = folderDetails.map((folder) =>
		pick(folder, ['id', 'displayNameEn', 'displayOrder'])
	);

	return folderDetailsPicked.map((folder) => ({ ...folder, type: 'folder' }));
};
