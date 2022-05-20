import { BlobServiceClient } from '@azure/storage-blob';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

const blobServiceClientFromConnectionString = {
	getContainerClient: sinon.stub().returns({
		listBlobFlatSegment: sinon.stub().returns({
			segment: {
				blobItems: [{
					metadata: { fileType: 'test' },
					name: '036075328008901675-simple.pdf',
				}, {
					name: '35481621312046846-simple.pdf',
				}]
			}
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

test.serial('gets all files associated with appeal id', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').returns(blobServiceClientFromConnectionString);

	const resp = await request.get('/').query({ type: 'appeal', id: 1 });

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [{
		name: '036075328008901675-simple.pdf',
		metadata: { fileType: 'test' }
	}, {
		name: '35481621312046846-simple.pdf'
	}]);
});

test.serial('returns error if error thrown', async(t) => {
	sinon.stub(BlobServiceClient, 'fromConnectionString').throws();

	const resp = await request.get('/').query({ type: 'appeal', id: 1 });

	t.is(resp.status, 500);
	t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
});

test.serial('throws error if no type or id provided', async(t) => {
	const resp = await request.get('/');

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { 
		type: 'Select a valid type',
		id: 'Provide appeal/application id'
	} }); 
});

test.serial('throws error if unfamiliar type provided', async(t) => {
	const resp = await request.get('/').query({ type: 'test' });

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { 
		type: 'Select a valid type',
		id: 'Provide appeal/application id'
	} }); 
});

test.serial('throws error if non numeric id provided', async(t) => {
	const resp = await request.get('/').query({ type: 'application', id: 'test' });

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: { 
		id: 'Provide appeal/application id'
	} }); 
});
