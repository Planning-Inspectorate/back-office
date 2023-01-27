import { BlobServiceClient } from '@azure/storage-blob';
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
};

describe('Download document', () => {
	describe('gets file if found', () => {
		test('gets file if found', async () => {
			sinon
				.stub(BlobServiceClient, 'fromConnectionString')
				.returns(blobServiceClientFromConnectionString);

			const resp = await request.get('/document').query({ documentName: 'appeal/1/test.pdf' });

			expect(resp.status).toEqual(200);
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('throws error if not able to connect', () => {
		test('throws error if not able to connect', async () => {
			sinon.stub(BlobServiceClient, 'fromConnectionString').throws();

			const resp = await request.get('/document').query({ documentName: 'appeal/1/test.pdf' });

			expect(resp.status).toEqual(500);
			expect(resp.body).toEqual({ errors: 'Oops! Something went wrong' });
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('throws error if documentName not provided', () => {
		test('throws error if documentName not provided', async () => {
			const resp = await request.get('/document');

			expect(resp.status).toEqual(400);
			expect(resp.body).toEqual({ errors: { documentName: 'Provide a document name' } });
		});
	});
});
