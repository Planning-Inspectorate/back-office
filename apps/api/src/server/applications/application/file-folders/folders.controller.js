import { getDocumentsInFolder, getFolder, getFolderPath, getFolders } from './folders.service.js';

/**
 *
 * @type {import('express').RequestHandler<{ id: number, folderId: number }, ?, ?, any>}
 */
export const getListOfFolders = async ({ params }, response) => {
	const folderDetails = await getFolders(params.id, params.folderId);

	response.send(folderDetails);
};

/**
 *
 * @type {import('express').RequestHandler<{ id: number, folderId: number }, ?, ?, any>}
 */
export const getSingleFolder = async ({ params }, response) => {
	const folderDetails = await getFolder(params.folderId);

	response.send(folderDetails);
};

/**
 *
 * @type {import('express').RequestHandler<{ id: number, folderId: number }, ?, ?, any>}
 */
export const getFolderPathList = async ({ params }, response) => {
	const folderDetails = await getFolderPath(params.id, params.folderId);

	response.send(folderDetails);
};

/**
 * Gets all the documents in a folder
 *
 * @type {import('express').RequestHandler<{ id: number, folderId: number }, ?, ?, any>}
 */
export const getDocuments = async ({ params }, response) => {
	const documents = await getDocumentsInFolder(params.folderId);

	response.send(documents);
};
