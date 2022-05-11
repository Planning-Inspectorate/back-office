import express from 'express';
import multer from 'multer';
import getStream from 'into-stream';
import md5 from 'crypto-js/md5.js';
import { BlobServiceClient } from '@azure/storage-blob';
import config from '../config/config.js';
import { asyncHandler } from './middleware/async-handler.js';

const router = express.Router();

const connectionString = config.blobStore.connectionString;
const containerName = config.blobStore.container;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

const getAllDocument = async function(req, res, next) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const listBlobsResponse = await containerClient.listBlobFlatSegment();

    const blobs = [];
    for await (const blob of listBlobsResponse.segment.blobItems) {
        blobs.push({ name: blob.name, metadata: blob.metadata });
    }

    res.send(blobs);
}

router.get('/', asyncHandler(getAllDocument));

const upload = multer({ storage: multer.memoryStorage() })
const validateDocumentUpload = upload.single('file')

const uploadDocument = async function(req, res) {
    const blobName = getBlobName(req.file.originalname);
    const stream = getStream(req.file.buffer);

    const md5Value = Uint8Array.from(md5(stream).toString());

    const containerClient = blobServiceClient.getContainerClient(containerName);;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(stream,
        undefined, undefined,
        {
            blobHTTPHeaders: {
                blobContentType: "application/json",
                blobContentMD5: md5Value
            }
        });
    res.send({ message: 'File uploaded to Azure Blob storage.' });
}

router.post('/', validateDocumentUpload, asyncHandler(uploadDocument))

export { router as documentsRouter };
