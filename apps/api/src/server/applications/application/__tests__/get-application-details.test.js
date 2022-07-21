import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 1,
	createdAt: new Date(),
	modifiedAt: new Date()
});

const findUniqueStub = sinon.stub().returns(application);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
});

test('gets all data for a case when everything is available', async (t) => {
	const response = await request.get('/applications/1');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		title: 'EN010003 - NI Case 3 Name',
		address: {},
		applicant: {},
		caseDetails: {
			description: 'EN010003 - NI Case 3 Name Description',
			id: 1,
			reference: application.reference,
			title: 'EN010003 - NI Case 3 Name'
		},
		geographicalInformation: {},
		gridReference: {},
		keyDates: {},
		mapZoomLevel: {},
		sector: {},
		subSector: {}
	});
});
