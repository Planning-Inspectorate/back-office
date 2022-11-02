import test from 'ava';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

test('returns blobStoreUrl given document info (caseRef, documentName, caseType, GUID)', async (t) => {
	const resp = await request.post('/document-location').send([
		{
			caseType: 'application',
			caseReference: '1',
			documentName: 'PINS1.pdf',
			GUID: 'D987654321'
		},
		{
			caseType: 'appeal',
			caseReference: '2',
			documentName: 'PINS2.pdf',
			GUID: 'DF98765421'
		}
	]);

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			caseType: 'application',
			caseReference: '1',
			documentName: 'PINS1.pdf',
			GUID: 'D987654321',
			blobStoreUrl: '/application/1/D987654321/PINS1.pdf'
		},
		{
			caseType: 'appeal',
			caseReference: '2',
			documentName: 'PINS2.pdf',
			GUID: 'DF98765421'
		}
	]);
});

test('returns error if any field missing (caseRef, documentName, caseType, GUID)', async (t) => {
	const resp = await request.post('/document-location').send([{}]);

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			'[0].caseType':
				'Please provide a valid caseType. caseType must be either "appeal" or "application"',
			'[0].caseReference':
				'Please provide a valid caseReference. caseReference is not the same as ID',
			'[0].documentName': 'Please provide a valid documentName',
			'[0].GUID': 'Please provide a valid GUID'
		}
	});
});

// const resp = await request.post('/document-location').send([])
