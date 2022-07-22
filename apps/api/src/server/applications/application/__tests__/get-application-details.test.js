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
		description: 'EN010003 - NI Case 3 Name Description',
		geographicalInformation: {
			applicant: {
				address: {
					addressLine1: 'Addr Line 1',
					addressLine2: 'Addr Line 2',
					town: 'Town',
					county: 'County',
					postcode: 'Postcode'
				},
				email: 'service.customer@email.com',
				firstName: 'Service Customer First Name',
				lastName: 'Service Customer Last Name',
				middleName: 'Service Customer Middle Name',
				phoneNumber: '01234567890',
				website: 'Service Customer Website'
			},
			mapZoomLevel: {
				displayNameCy: 'Zoom Level Name Cy',
				displayNameEn: 'Zoom Level Name En'
			},
			regions: {
				displayNameCy: 'Region Name Cy',
				displayNameEn: 'Region Name En'
			}
		},
		keyDates: {},
		reference: application.reference,
		sector: {
			abbreviation: 'BB',
			displayNameCy: 'Sector Name Cy',
			displayNameEn: 'Sector Name En',
			name: 'sector'
		},
		subSector: {
			abbreviation: 'AA',
			displayNameCy: 'Sub Sector Name Cy',
			displayNameEn: 'Sub Sector Name En',
			name: 'sub_sector'
		}
	});
});
