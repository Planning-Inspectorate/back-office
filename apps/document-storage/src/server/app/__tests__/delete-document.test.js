import { BlobServiceClient } from '@azure/storage-blob';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

const blobServiceClientStub = {
	getContainerClient: sinon.stub().returns({
		getBlockBlobClient: sinon.stub().returns({
			delete: sinon.stub().returns({})
		})
	})
};

test.afterEach.always(() => {
	try {
		BlobServiceClient.fromConnectionString.restore();
	} catch {
		// empty
	}
});

test.serial('deletes file', async (t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').returns(blobServiceClientStub);

	const resp = await request.delete('/document').send({
		documentPath: 'test/path/test.txt'
	});

	t.is(resp.statusCode, 200);
});

test.serial('throws error if no document path provided', async (t) => {
	const resp = await request.delete('/document');

	t.is(resp.statusCode, 400);
	t.deepEqual(resp.body, {
		errors: {
			documentPath: 'Provide a document path'
		}
	});
});
