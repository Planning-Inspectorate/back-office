import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'draft'
});

const folder1 = [
	{
		id: 1,
		displayNameEn: 'Acceptance',
		displayOrder: 700,
		type: 'folder',
		caseId: 1
	}
];

const findUniqueStub = sinon.stub();
const findManyStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application1);
findManyStub.withArgs({ where: { caseId: 1 } }).returns(folder1);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findMany: findManyStub };
	});
});

test('returns documents folder for a case when id is valid', async (t) => {
	const response = await request.get('/applications/1/documents');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 1,
			displayNameEn: 'Acceptance',
			displayOrder: 700,
			type: 'folder'
		}
	]);
});
