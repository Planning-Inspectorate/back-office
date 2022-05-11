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

test.afterEach.always(() => {
	try {
		BlobServiceClient.fromConnectionString.restore();
	} catch{
		console.log('Failed to reset BlobServiceClient mock');
	}
});

test.serial('uploads document', async(t) => {
<<<<<<< HEAD
	const uploadStreamStub = sinon.stub();
	sinon.stub(BlobServiceClient, 'fromConnectionString').returns({
		getContainerClient: sinon.stub().returns({
			getBlockBlobClient: sinon.stub().returns({
				uploadStream: uploadStreamStub
			})
		})
	});
	const resp = await request.post('/').attach('file', pathToFile).field('documentType', 'application').query({ type: 'appeal', id: 1 });
	t.is(resp.status, 200);
	t.deepEqual(resp.body, { message: 'File uploaded to Azure Blob storage.' });
	sinon.assert.calledWith(uploadStreamStub, sinon.match.any, undefined, undefined, {
		blobHTTPHeaders: {
			blobContentType: 'application/json',
			blobContentMD5: Uint8Array.from('487f7b22f68312d2c1bbc93b1aea445b')
		},
		metadata: { documentType: 'application' }
	});
});
=======
    const uploadStreamStub = sinon.stub();
    sinon.stub(BlobServiceClient, 'fromConnectionString').returns({
        getContainerClient: sinon.stub().returns({
            getBlockBlobClient: sinon.stub().returns({
                uploadStream: uploadStreamStub
            })
        })
    });
    const resp = await request.post('/').attach('file', pathToFile);
    t.is(resp.status, 200);
    t.deepEqual(resp.body, {message: 'File uploaded to Azure Blob storage.'});
    sinon.assert.calledWith(uploadStreamStub, sinon.match.any, undefined, undefined, {
        blobHTTPHeaders: {
            blobContentType: "application/json",
            blobContentMD5: Uint8Array.from("487f7b22f68312d2c1bbc93b1aea445b")
        }
    })
})
>>>>>>> 0b74f19 (BOCM-486 - adds validation for type provided)

test.serial('thows error if no file is provided', async(t) => {
	const resp = await request.post('/').field('documentType', 'application').query({ type: 'appeal', id: 1 });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { file: 'Select a file' } });
});

test.serial('returns error if error thrown', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').throws();
	const resp = await request.post('/').attach('file', pathToFile).field('documentType', 'application').query({ type: 'appeal', id: 1 });
	t.is(resp.status, 500);
	t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
});

test.serial('thows error if no document type provided', async(t) => {
	const resp = await request.post('/').attach('file', pathToFile).query({ type: 'appeal', id: 1 });
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
