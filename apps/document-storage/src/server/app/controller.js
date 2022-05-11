import * as blobStoreService from './blob-store/service.js';

export const getAllDocuments = async function(req, res, next) {
    
    const blobsResponse = await blobStoreService.getListOfBlobs();

    const blobs = [];
    for await (const blob of blobsResponse.segment.blobItems) {
        blobs.push({ name: blob.name, metadata: blob.metadata });
    }

    res.send(blobs);
}

export const uploadDocument = async function(req, res) {
    await blobStoreService.uploadBlob(req.file.originalname, req.file.buffer);
    
    res.send({ message: 'File uploaded to Azure Blob storage.' });
}
