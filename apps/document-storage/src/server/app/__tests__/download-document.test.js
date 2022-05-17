// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { BlobServiceClient } from '@azure/storage-blob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import app from '../../app.js';

const request = supertest(app);

let fileBuffer;
let chunks = [];

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(__dirname, './assets/simple.pdf');
let fileStream = fs.createReadStream(pathToFile);

fileStream.once('end', () => {
    fileBuffer = Buffer.concat(chunks);
});

fileStream.on('data', (chunk) => {
    chunks.push(chunk);
});

const blobServiceClientFromConnectionString = {
    getContainerClient: sinon.stub().returns({
        getBlockBlobClient: sinon.stub().returns({
            downloadToBuffer: sinon.stub().returns(fileBuffer)
        })
    })
}

test.afterEach.always(() => {
	try {
		BlobServiceClient.fromConnectionString.restore();
	} catch{
		console.log('Failed to reset BlobServiceClient mock');
	}
});

test.serial('gets file if found', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').returns(blobServiceClientFromConnectionString);
	const resp = await request.get('/document').query({ documentName: 'appeal/1/test.pdf' });
	t.is(resp.status, 200);
})

test.serial('throws error if not able to connect', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').throws();
	const resp = await request.get('/document').query({ documentName: 'appeal/1/test.pdf' });
	t.is(resp.status, 500);
    t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
})

test.serial('throws error if documentName not provided', async(t) => {
	const resp = await request.get('/document');
	t.is(resp.status, 400);
    t.deepEqual(resp.body, { errors: { documentName: 'Provide a document name' } });
})
