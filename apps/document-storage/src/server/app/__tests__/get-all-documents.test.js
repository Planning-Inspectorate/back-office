import { BlobServiceClient } from '@azure/storage-blob';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

const blobServiceClientFromConnectionString = {
	getContainerClient: sinon.stub().returns({
		listBlobFlatSegment: sinon.stub().returns({
			segment: {
				blobItems: [
					{
						metadata: { fileType: 'test' },
						name: '036075328008901675-simple.pdf'
					},
					{
						name: '35481621312046846-simple.pdf'
					}
				]
			}
		})
	})
};

describe('Get all documents', () => {
	describe('gets all files associated with appeal id', () => {
		test('gets all files associated with appeal id', async () => {
			sinon
				.stub(BlobServiceClient, 'fromConnectionString')
				.returns(blobServiceClientFromConnectionString);

			const resp = await request.get('/').query({ type: 'appeal', id: 1 });

			expect(resp.status).toEqual(200);
			expect(resp.body).toEqual([
				{
					name: '036075328008901675-simple.pdf',
					metadata: { fileType: 'test' }
				},
				{
					name: '35481621312046846-simple.pdf'
				}
			]);
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('returns error if error throws', () => {
		test('returns error if error thrown', async () => {
			sinon.stub(BlobServiceClient, 'fromConnectionString').throws();

			const resp = await request.get('/').query({ type: 'appeal', id: 1 });

			expect(resp.status).toEqual(500);
			expect(resp.body).toEqual({ errors: 'Oops! Something went wrong' });
			BlobServiceClient.fromConnectionString.restore();
		});
	});

	describe('throws error if no type or id provided', () => {
		test('throws error if no type or id provided', async () => {
			const resp = await request.get('/');

			expect(resp.status).toEqual(400);
			expect(resp.body).toEqual({
				errors: {
					type: 'Select a valid type',
					id: 'Provide appeal/application id'
				}
			});
		});
	});

	describe('throws error if unfamiliar type provided', () => {
		test('throws error if unfamiliar type provided', async () => {
			const resp = await request.get('/').query({ type: 'test' });

			expect(resp.status).toEqual(400);
			expect(resp.body).toEqual({
				errors: {
					type: 'Select a valid type',
					id: 'Provide appeal/application id'
				}
			});
		});
	});

	describe('throws error if non numeric id provided', () => {
		test('throws error if non numeric id provided', async () => {
			const resp = await request.get('/').query({ type: 'application', id: 'test' });

			expect(resp.status).toEqual(400);
			expect(resp.body).toEqual({
				errors: {
					id: 'Provide appeal/application id'
				}
			});
		});
	});
});
