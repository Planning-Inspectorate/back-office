import { BlobServiceClient } from '@azure/storage-blob';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

const blobServiceClientStub = {
	getContainerClient: sinon.stub().returns({
		getBlockBlobClient: sinon.stub().returns({
			exists: sinon.stub().returns(true),
			delete: sinon.stub().returns({})
		})
	})
};

const blobServiceClientForMissingDocumentStub = {
	getContainerClient: sinon.stub().returns({
		getBlockBlobClient: sinon.stub().returns({
			exists: sinon.stub().returns(false),
			delete: sinon.stub().returns({})
		})
	})
};

describe('Delete document', () => {
	describe('delete files', () => {
		test('deletes file', async () => {
			sinon.stub(BlobServiceClient, 'fromConnectionString').returns(blobServiceClientStub);

			const resp = await request.delete('/document').send({
				documentPath: 'test/path/test.txt'
			});

			expect(resp.statusCode).toEqual(200);
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('throws error if the document does not exist', () => {
		test('throws error if the document does not exist', async () => {
			sinon
				.stub(BlobServiceClient, 'fromConnectionString')
				.returns(blobServiceClientForMissingDocumentStub);

			const resp = await request.delete('/document').send({
				documentPath: 'test/path/test-doc-that-is-missing.txt'
			});

			expect(resp.statusCode).toEqual(404);
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('throws error if no document path provided', () => {
		test('throws error if no document path provided', async () => {
			const resp = await request.delete('/document');

			expect(resp.statusCode).toEqual(400);
			expect(resp.body).toEqual({
				errors: {
					documentPath: 'Provide a document path'
				}
			});
		});
	});
});
