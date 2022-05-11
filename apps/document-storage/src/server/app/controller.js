import * as blobStoreService from './blob-store/service.js';

export const getAllDocuments = async function(req, res) {
    const blobsResponse = await blobStoreService.getListOfBlobs(req.query.type, req.query.id);

    const blobs = [];
    for await (const blob of blobsResponse.segment.blobItems) {
        blobs.push({ name: blob.name, metadata: blob.metadata });
    }

    res.send(blobs);
}

export const uploadDocument = async function (req, res) {
    await blobStoreService.uploadBlob(
        req.query.type,
        req.query.id,
        {
            documentType: req.body.documentType
        },
        req.file.originalname,
        req.file.buffer,
        'application/json'
    );

    res.send({ message: 'File uploaded to Azure Blob storage.' });
}
