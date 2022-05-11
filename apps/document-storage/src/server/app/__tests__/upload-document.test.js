import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { BlobServiceClient } from '@azure/storage-blob';
import * as url from 'url';
import path from 'path';
import app from '../../app.js';

const request = supertest(app);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(__dirname, './assets/simple.pdf');

test.afterEach.always(t => {
	BlobServiceClient.fromConnectionString.restore();
});

test.serial('uploads document', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString').returns({
        getContainerClient: sinon.stub().returns({
            getBlockBlobClient: sinon.stub().returns({
                uploadStream: sinon.stub()
            })
        })
    });
    const resp = await request.post('/').attach('file', pathToFile);
    t.is(resp.status, 200);
    t.deepEqual(resp.body, {message: 'File uploaded to Azure Blob storage.'});
})

test.serial('thows error if no file is provided', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString');
    const resp = await request.post('/');
    t.is(resp.status, 400);
    t.deepEqual(resp.body, { errors: { file: 'Select a file' } })
})

test.serial('returns error if error thrown', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString').throws();
    const resp = await request.post('/').attach('file', pathToFile);
    t.is(resp.status, 500);
    t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
})
