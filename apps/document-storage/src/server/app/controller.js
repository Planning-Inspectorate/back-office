// import { logger } from '@azure/storage-blob';
import config from '../config/config.js';
import * as blobStoreService from './blob-store/service.js';

/**
 *
 * @type {import('express').RequestHandler}
 */
export async function getAllDocuments(request, response) {
	const blobsResponse = await blobStoreService.getListOfBlobs(request.query.type, request.query.id);

	const blobs = [];

	for await (const blob of blobsResponse.segment.blobItems) {
		blobs.push({ name: blob.name, metadata: blob.metadata });
	}

	response.send(blobs);
}

/**
 *
 * @type {import('express').RequestHandler}
 */
export async function uploadDocument(request, response) {
	await blobStoreService.uploadBlob(
		{
			type: request.body.type,
			id: request.body.id
		},
		{
			documentType: request.body.documentType
		},
		{
			originalName: request.file.originalname,
			content: request.file.buffer,
			contentType: 'application/json'
		}
	);

	response.send({ message: 'File uploaded to Azure Blob storage.' });
}

/**
 *
 * @type {import('express').RequestHandler}
 */
export async function documentLocation(request, response) {
	const documentsFindUrl = await blobStoreService.documentsCreateUrl(request.body['']);

	response.send({
		blobStorageHost: config.blobStore.host,
		blobStorageContainer: config.blobStore.container,
		documents: documentsFindUrl
	});
}

/**
 *
 * @type {import('express').RequestHandler}
 */
export async function downloadDocument(request, response) {
	const documentBuffer = await blobStoreService.downloadBlob(request.query.documentName);

	response.set('content-type', 'application/pdf');
	response.set('x-original-file-name', request.query.documentName);
	response.send(documentBuffer);
}

/**
 * @type {import('express').RequestHandler<?, ?, {documentPath: string}>}
 */
export const deleteDocument = async (request, response) => {
	const { documentPath } = request.body;

	await blobStoreService.deleteDocument(documentPath);
	response.send();
};
