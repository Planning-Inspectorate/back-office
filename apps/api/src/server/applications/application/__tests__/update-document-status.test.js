import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const document1 = {
	guid: 'D',
	folderId: 6,
	blobStorageContainer: 'Container1',
	blobStoragePath: 'Container/container',
	status: 'awaiting_upload'
};

const request = supertest(app);

const updateStub = sinon.stub();

updateStub.withArgs({ where: { caseId: 1, guid: 'D' } }).returns(document1);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'document').get(() => {
		return { update: updateStub };
	});
});

test('updates document status', async (t) => {
	const response = await request.patch('/applications/1/documents/D/status').send({
		status: 'uploading'
	});

	// console.log("IM TESTING HERE =====", response.body);

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			guid: 'D53454066',
			folderId: 6,
			blobStorageContainer: 'Container1',
			blobStoragePath: 'Container/container',
			status: 'not_yet_checked'
		}
	]);
	// sinon.assert.calledWith(updateStub, {
	// 	where: { id: 1 },
	// 	data: {
	// 		status: 'not_yet_checked',
	// 	},
	// });
});

// test('throws error if guid doesn\'t belong to case provided', async (t) => {
// 	const response = await request.patch('/1/documents/D53454066/status').send({ status: 'uploading' });

// 	t.is(response.status, 400);
// 	t.deepEqual(response.body, {
// 		errors: {
// "errors: hi"		}
// 	});
// });
