import { BlobServiceClient } from '@azure/storage-blob';
import express from 'express';
import md5 from 'crypto-js/md5.js';
const router = express.Router();

import multer from 'multer';

import getStream from 'into-stream';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

import logger from 'morgan';
import bodyParser from 'body-parser';
const app = express();

const connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;QueueEndpoint=http://localhost:10001/devstoreaccount1;";
const containerName = "document-service-uploads";
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

router.get('/', async (req, res, next) => {

    let viewData;

    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const listBlobsResponse = await containerClient.listBlobFlatSegment();

        const blobs = [];
        for await (const blob of listBlobsResponse.segment.blobItems) {
            blobs.push({ name: blob.name, metadata: blob.metadata });
        }
        viewData = blobs;
    } catch (err) {
        viewData = {
            title: 'Error',
            viewName: 'error',
            message: 'There was an error contacting the blob storage container.',
            error: err
        };
        console.error(err);
        res.status(500);
    } finally {
        res.send(viewData);
    }
});

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('file'), async (req, res) => {
    const blobName = getBlobName(req.file.originalname);
    const stream = getStream(req.file.buffer);

    const md5Value = Uint8Array.from(md5(stream).toString());

    const containerClient = blobServiceClient.getContainerClient(containerName);;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers,
            {
                blobHTTPHeaders: {
                    blobContentType: "application/json",
                    blobContentMD5: md5Value
                }
            });
        res.send({ message: 'File uploaded to Azure Blob storage.' });
    } catch (err) {
        res.send({ message: err.message });
    }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);
    res.status(err.status || 500);
    res.send({ 'error': err });
});

app.listen(3000, () => {
    console.log(`Server is live at http://localhost:3000`);
});
