import { BlobServiceClient } from '@azure/storage-blob';
import path from 'node:path';
import * as url from 'node:url';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);
const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

describe('Upload document', () => {
	test('uploads document', async () => {
		const uploadStreamStub = sinon.stub();

		sinon.stub(BlobServiceClient, 'fromConnectionString').returns({
			getContainerClient: sinon.stub().returns({
				getBlockBlobClient: sinon.stub().returns({
					uploadStream: uploadStreamStub
				})
			})
		});

		const resp = await request
			.post('/')
			.attach('file', pathToFile)
			.field('documentType', 'application')
			.field('type', 'appeal')
			.field('id', 1);

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({ message: 'File uploaded to Azure Blob storage.' });

		let bufferSize;
		let maxConcurrency;

		sinon.assert.calledWith(uploadStreamStub, sinon.match.any, bufferSize, maxConcurrency, {
			blobHTTPHeaders: {
				blobContentType: 'application/json',
				blobContentMD5: Uint8Array.from('487f7b22f68312d2c1bbc93b1aea445b')
			},
			metadata: { documentType: 'application' }
		});

		BlobServiceClient.fromConnectionString.restore();
	});

	test('thows error if no file is provided', async () => {
		const resp = await request
			.post('/')
			.field('documentType', 'application')
			.field('type', 'appeal')
			.field('id', 1);

		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({ errors: { file: 'Select a file' } });
	});

	test('returns error if error thrown', async () => {
		sinon.stub(BlobServiceClient, 'fromConnectionString').throws();

		const resp = await request
			.post('/')
			.attach('file', pathToFile)
			.field('documentType', 'application')
			.field('type', 'appeal')
			.field('id', 1);

		expect(resp.status).toEqual(500);
		expect(resp.body).toEqual({ errors: 'Oops! Something went wrong' });

		BlobServiceClient.fromConnectionString.restore();
	});

	test('thows error if no document type provided', async () => {
		const resp = await request
			.post('/')
			.attach('file', pathToFile)
			.field('type', 'appeal')
			.field('id', 1);

		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({ errors: { documentType: 'Select a valid document type' } });
	});

	test('thows error if type and id provided', async () => {
		const resp = await request
			.post('/')
			.attach('file', pathToFile)
			.field('documentType', 'application');

		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				id: 'Provide appeal/application id',
				type: 'Select a valid type'
			}
		});
	});
});
