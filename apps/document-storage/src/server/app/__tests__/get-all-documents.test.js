import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { BlobServiceClient } from '@azure/storage-blob';
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

test.afterEach.always(t => {
	BlobServiceClient.fromConnectionString.restore();
});

test.serial('gets all files associated with appeal id', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString').returns(blobServiceClientFromConnectionString);
    const resp = await request.get('/').query({ type: 'appeal' });
    t.is(resp.status, 200);
    t.deepEqual(resp.body, [{
        name: '036075328008901675-simple.pdf',
        metadata: { fileType: 'test' }
    }, {
        name: '35481621312046846-simple.pdf'
    }]);
})

test.serial('returns error if error thrown', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString').throws();
    const resp = await request.get('/').query({ type: 'appeal' });
    t.is(resp.status, 500);
    t.deepEqual(resp.body, { error: 'Oops! Something went wrong' });
})

test.serial('throws error if no type provided', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString');
    const resp = await request.get('/');
    t.is(resp.status, 400);
    t.deepEqual(resp.body, { errors: { type: 'Select a valid type' } }); 
})

test.serial('throws error if unfamiliar type provided', async(t) => {
    sinon.stub(BlobServiceClient, 'fromConnectionString');
    const resp = await request.get('/').query({ type: 'test' });
    t.is(resp.status, 400);
    t.deepEqual(resp.body, { errors: { type: 'Select a valid type' } }); 
})
