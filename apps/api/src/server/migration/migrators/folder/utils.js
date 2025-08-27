import { pick } from 'lodash-es';

/**
 * @typedef {import('@planning-inspectorate/data-model').Schemas.Folder} FolderModel
 * @typedef {Object} SortedFolder
 * @extends FolderModel
 * @property {SortedFolder[]} children
 *
 * @param {FolderModel[]} folders
 * @return {SortedFolder[]}
 */
export const buildFolderHierarchy = (folders) => {
	const rootFolders = [];
	const map = {};

	folders.forEach(
		(folder) =>
			(map[folder.id] = {
				...pick(folder, ['id', 'displayNameEn', 'parentFolderId']),
				children: []
			})
	);
	folders.forEach((folder) => {
		if (folder.parentFolderId) {
			map[folder.parentFolderId].children.push(map[folder.id]);
		} else {
			rootFolders.push(map[folder.id]);
		}
	});

	return rootFolders;
};
