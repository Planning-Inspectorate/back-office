import BackOfficeAppError from '#utils/app-error.js';
import * as folderRepository from '#repositories/folder.repository.js';
import logger from '#utils/logger.js';
import {
	createFolder as svcCreateFolder,
	getDocumentsInFolder,
	getFolder,
	getFolderPath,
	getFolders,
	getFolderByName,
	getAllFolders,
	updateFolder as svcUpdateFolder,
	getChildFolders,
	checkFoldersHaveNoDocuments,
	checkIfFolderIsCustom
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

/**
 * @type {import('express').RequestHandler<{ id: number }, ?, { name: string, parentFolderId?: number }, ?>}
 * */
export const createFolder = async ({ params, body }, response) => {
	const existingFolder = await getFolderByName(params.id, body.name, body.parentFolderId);
	if (existingFolder) {
		throw new BackOfficeAppError(`Duplicate folder exists with name: ${body.name}`, 409);
	}

	const folder = await svcCreateFolder(params.id, body.name, body.parentFolderId);
	response.send(folder);
};

/**
 * @type {import('express').RequestHandler<{ folderId: number }, ?, { name: string}, ?>}
 * */
export const updateFolder = async ({ params, body }, response) => {
	const folder = await getFolder(params.folderId);
	if (!folder) {
		throw new BackOfficeAppError(`No folder exists with ID: ${params.folderId}`, 404);
	}

	if (!folder.isCustom) {
		throw new BackOfficeAppError('Must be a custom folder created by a CBOS user', 405);
	}

	const updatedFolder = await svcUpdateFolder(params.folderId, body);
	response.send(updatedFolder);
};

/**
 * @type {import('express').RequestHandler<{ id: number , folderId: number }, ?, { name: string, parentFolderId?: number }, ?>}
 */
export const deleteFolder = async ({ params }, response) => {
	const isCustomFolder = await checkIfFolderIsCustom(params.folderId);
	if (isCustomFolder === undefined) {
		throw new BackOfficeAppError(`Folder with id: ${params.folderId} not found`, 404);
	}
	if (!isCustomFolder) {
		throw new BackOfficeAppError('Cannot delete a non-custom folder', 403);
	}

	/** @type {Array<{ id: number, parentFolderId?: number | null, containsDocuments?: boolean }>}*/
	const folderList = [{ id: params.folderId }];
	try {
		folderList.push(...(await getChildFolders(params.folderId)));
		await checkFoldersHaveNoDocuments(folderList);
	} catch (error) {
		logger.error('Error retrieving child folders or checking documents: ', error);
		throw new BackOfficeAppError('Failed to delete folder due to internal error.', 500);
	}

	if (folderList.some((folder) => folder.containsDocuments)) {
		throw new BackOfficeAppError('Folder or child folders are not empty', 409);
	}

	try {
		await folderRepository.deleteFolderMany(folderList.map((folder) => folder.id));
		response.status(204).send();
	} catch (error) {
		logger.error(`Failed to delete folders: ${error}`);
		throw new BackOfficeAppError('Failed to delete folder due to internal error.', 500);
	}
};
