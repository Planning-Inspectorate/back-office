
// /**
//  * @typedef {Object} Folder
//  * @property {number} id
//  * @property {string} displayNameEn
//  */

/**
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 * @returns {Object[]}
 */
export const getFolderViewData = (folderList) => folderList
    .map((folder) => {
        return { text: folder.displayNameEn, value: folder.id };
    });

/**
 * 
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 */
export const isFolderRoot = folderList => folderList.every(folder => folder.parentFolderId === null) && folderList.length > 0