/** @typedef {import('@pins/api').Schema.Folder} Folder */
/** @typedef {import('@pins/applications').FolderDetails} FolderDetails */

/**
 *
 * @param { Folder } folderDetails
 * @returns { FolderDetails}
 */
export const mapSingleFolderDetails = (folderDetails) => {
	return {
		id: folderDetails.id,
		displayNameEn: folderDetails.displayNameEn,
		displayOrder: folderDetails.displayOrder
	};
};

/**
 *
 * @param { Folder } folderDetails
 * @returns { FolderDetails}
 */
export const mapSingleBreadcrumbFolderDetails = (folderDetails) => {
	return { id: folderDetails.id, displayNameEn: folderDetails.displayNameEn };
};

/**
 *
 * @param { Folder[] } folderDetails
 * @returns { FolderDetails[]}
 */
export const mapFolderDetails = (folderDetails) => {
	return folderDetails.map((folder) => mapSingleFolderDetails(folder));
};

/**
 *
 * @param { Folder[] } folderDetails
 * @returns { FolderDetails[]}
 */
export const mapBreadcrumbFolderDetails = (folderDetails) => {
	return folderDetails.map((folder) => mapSingleBreadcrumbFolderDetails(folder));
};
