import { pick } from 'lodash-es';

/**
 *
 * @param { any } folderDetails
 * @returns {{id: number, displayNameEn: string, displayOrder: number}}
 */
export const mapFolderDetails = (folderDetails) => {
	return folderDetails.map((/** @type {any} */ folder) =>
		pick(folder, ['id', 'displayNameEn', 'displayOrder', 'type'])
	);
};
