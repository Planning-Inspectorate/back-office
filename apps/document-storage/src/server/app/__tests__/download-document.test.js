import { BlobServiceClient } from '@azure/storage-blob';
import test from 'ava';
import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

let fileBuffer;

const chunks = [];

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

const fileStream = fs.createReadStream(pathToFile);

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
	} catch {
		// empty
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
