import { BlobServiceClient } from '@azure/storage-blob';
import test from 'ava';
import path from 'node:path';
import * as url from 'node:url';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);
const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

test.afterEach.always(() => {
	try {
		BlobServiceClient.fromConnectionString.restore();
	} catch {
		// empty
	}
});

test.serial('uploads document', async(t) => {
	const uploadStreamStub = sinon.stub();

	sinon.stub(BlobServiceClient, 'fromConnectionString').returns({
		getContainerClient: sinon.stub().returns({
			getBlockBlobClient: sinon.stub().returns({
				uploadStream: uploadStreamStub
			})
		})
	});

	const resp = await request.post('/')
		.attach('file', pathToFile)
		.field('documentType', 'application')
		.field('type', 'appeal')
		.field('id', 1);

	t.is(resp.status, 200);
	t.deepEqual(resp.body, { message: 'File uploaded to Azure Blob storage.' });

	let bufferSize;
	let maxConcurrency;

	sinon.assert.calledWith(uploadStreamStub, sinon.match.any, bufferSize, maxConcurrency, {
		blobHTTPHeaders: {
			blobContentType: 'application/json',
			blobContentMD5: Uint8Array.from('487f7b22f68312d2c1bbc93b1aea445b')
		},
		metadata: { documentType: 'application' }
	});
});

test.serial('thows error if no file is provided', async(t) => {
	const resp = await request.post('/')
		.field('documentType', 'application')
		.field('type', 'appeal')
		.field('id', 1);

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { file: 'Select a file' } });
});

test.serial('returns error if error thrown', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').throws();

	const resp = await request.post('/')
		.attach('file', pathToFile)
		.field('documentType', 'application')
		.field('type', 'appeal')
		.field('id', 1);

	t.is(resp.status, 500);
	t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
});

test.serial('thows error if no document type provided', async(t) => {
	const resp = await request.post('/')
		.attach('file', pathToFile)
		.field('type', 'appeal')
		.field('id', 1);

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { documentType: 'Select a valid document type' } });
});

test.serial('thows error if type and id provided', async(t) => {
	const resp = await request.post('/').attach('file', pathToFile).field('documentType', 'application');

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			id: 'Provide appeal/application id',
			type: 'Select a valid type'
		}
	});
});
