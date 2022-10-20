import { pick } from 'lodash-es';

/**
 *
 * @param { any } folderDetails
 * @returns {{id: number, displayNameEn: string, displayOrder: number}}
 */
export const mapFolderDetails = (folderDetails) => {
	const folderDetailsPicked = folderDetails.map((/** @type {any} */ folder) =>
		pick(folder, ['id', 'displayNameEn', 'displayOrder', 'type'])
	);

	return folderDetailsPicked.map((/** @type {any} */ folder) => ({ ...folder, type: 'folder' }));
};
