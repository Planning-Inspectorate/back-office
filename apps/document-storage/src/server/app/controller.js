import * as blobStoreService from './blob-store/service.js';

export const getAllDocuments = async function(request, response) {
	const blobsResponse = await blobStoreService.getListOfBlobs(request.query.type, request.query.id);

	const blobs = [];
	for await (const blob of blobsResponse.segment.blobItems) {
		blobs.push({ name: blob.name, metadata: blob.metadata });
	}

	response.send(blobs);
};

export const uploadDocument = async function (request, response) {
	await blobStoreService.uploadBlob(
		request.query.type,
		request.query.id,
		{
			documentType: request.body.documentType
		},
		request.file.originalname,
		request.file.buffer,
		'application/json'
	);

	response.send({ message: 'File uploaded to Azure Blob storage.' });
};
