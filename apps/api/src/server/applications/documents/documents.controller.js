import { obtainURLsForDocuments } from '../application/documents/document.service.js';
import { updateStatus } from './documents.service.js';

/**
 * Provides document upload URLs.
 *
 * @type {import('express').RequestHandler<any, any, any, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documentsToUpload = body[''];

	const { blobStorageHost, privateBlobContainer, documents } = await obtainURLsForDocuments(
		documentsToUpload,
		params.id
	);

	const documentsWithUrls = documents.map(({ documentName, blobStoreUrl }) => ({
		documentName,
		blobStoreUrl
	}));

	response.send({
		blobStorageHost,
		privateBlobContainer,
		documents: documentsWithUrls
	});
};

/**
 * @type {import('express').RequestHandler<{caseId: string, documentGUID: string }>}
 */
export const updateDocumentStatus = async ({ params, body }, response) => {
	const updateResponse = await updateStatus(params.documentGUID, body.machineAction);

	response.send(updateResponse);
};

/**
 * Processes arbitrary HTML file into the agreed YouTube template for Front Office
 *
 * @type {import('express').RequestHandler<any, any, { html: string }, any>}
 * */
export const processHTMLForYouTube = async ({ body }, response) => {
	const html = body.html;

	console.log(html);

	response.status(501).end();
};
