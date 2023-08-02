import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

describe('Document location', () => {
	test('returns blobStoreUrl given document info (caseRef, documentName, caseType, GUID)', async () => {
		const resp = await request.post('/document-location').send([
			{
				caseType: 'application',
				caseReference: '1',
				GUID: 'D987654321'
			},
			{
				caseType: 'appeal',
				caseReference: '2',
				GUID: 'DF98765421'
			}
		]);

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			blobStorageHost: 'https://localhost:10000',
			privateBlobContainer: 'document-service-uploads',
			documents: [
				{
					caseType: 'application',
					caseReference: '1',
					GUID: 'D987654321',
					blobStoreUrl: '/application/1/D987654321/1'
				},
				{
					caseType: 'appeal',
					caseReference: '2',
					GUID: 'DF98765421'
				}
			]
		});
	});

	test('returns error if any field missing (caseRef, documentName, caseType, GUID)', async () => {
		const resp = await request.post('/document-location').send([{}]);

		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				'[0].caseType':
					'Please provide a valid caseType. caseType must be either "appeal" or "application"',
				'[0].caseReference':
					'Please provide a valid caseReference. caseReference is not the same as ID',
				'[0].GUID': 'Please provide a valid GUID'
			}
		});
	});

	test('returns error if no object passed', async () => {
		const resp = await request.post('/document-location').send([]);

		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				'': 'Please enter an object {} with caseRef, documentName, caseType and GUID'
			}
		});
	});
});
