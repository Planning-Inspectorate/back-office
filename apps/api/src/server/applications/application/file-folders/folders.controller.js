import {
	getDocumentsInFolder,
	getFolder,
	getFolderPath,
	getFolders,
	getAllFolders
} from './folders.service.js';

/**
 * Handles a GET request for multiple folders and sends the corresponding details in the request
 *
 * @type {import('express').RequestHandler<{ id: number, folderId: number }, ?, ?, any>}
 */
export const getListOfFolders = async ({ params, query }, response) => {
	if (query.all) {
		const folderDetails = await getAllFolders(params.id);
		response.send(folderDetails);
		return;
	}

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
 * Gets paginated array of documents in a folder
 *
 * @type {import('express').RequestHandler<{ folderId: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getDocuments = async ({ params, body }, response) => {
	const { pageNumber, pageSize } = body;
	const paginatedDocuments = await getDocumentsInFolder(params.folderId, pageNumber, pageSize);

	response.send(paginatedDocuments);
};
