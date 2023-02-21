import { getDocumentsInFolder, getFolder, getFolderPath, getFolders } from './folders.service.js';

/**
 * Handles a GET request for multiple folders and sends the corresponding details in the request
 *
 * @param {import('express').Request<{ id: number, folderId: number }>} request - The Express request object containing the ID and folder ID parameters.
 * @param {import('express').Response} response
 * @returns {Promise<void>} - A Promise that resolves with the folder details and sends a response to the client.
 */
export const getListOfFolders = async ({ params }, response) => {
	const folderDetails = await getFolders(params.id, params.folderId);

	response.send(folderDetails);
};

/**
 * Handles a GET request for a single folder and sends the corresponding folder details in the request
 *
 * @param {import('express').Request<{ id: number, folderId: number }>} request - The Express request object containing the `id` and `folderId` parameters in the URL.
 * @param {import('express').Response<any>} response
 * @returns {Promise<void>}
 */
export const getSingleFolder = async ({ params }, response) => {
	const folderDetails = await getFolder(params.folderId);

	response.send(folderDetails);
};

/**
 * Handles a GET request for a list of folder paths and sends the corresponding folder details in the request
 *
 * @param {import('express').Request<{ id: number, folderId: number }>} request - The Express request object containing the `id` and `folderId` parameters in the URL.
 * @param {import('express').Response<any>} response
 * @returns {Promise<void>}
 */
export const getFolderPathList = async ({ params }, response) => {
	const folderDetails = await getFolderPath(params.id, params.folderId);

	response.send(folderDetails);
};

/**
 * Gets paginated array of documents in a folder
 *
 * @param {import('express').Request<{ folderId: number }, any, {pageNumber?: number, pageSize?: number}>} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const getDocuments = async ({ params, body }, response) => {
	const { pageNumber, pageSize } = body;
	const paginatedDocuments = await getDocumentsInFolder(params.folderId, pageNumber, pageSize);

	response.send(paginatedDocuments);
};
