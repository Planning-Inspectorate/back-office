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
	caseStatus: 'draft',
	inclusions: {
		serviceCustomer: true,
		ApplicationDetails: true,
		CaseStatus: true
	}
});

const application1SansInclusions = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'draft'
});

let blankTitle;
let blankDescription;
let blankReference;

const application2 = {
	...applicationFactoryForTests({
		id: 2,
		title: blankTitle,
		description: blankDescription,
		caseStatus: 'draft',
		inclusions: {
			CaseStatus: true
		}
	}),
	reference: blankReference
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: sinon.match.any }).returns(application1);
findUniqueStub.withArgs({ where: { id: 1 } }).returns(application1SansInclusions);
findUniqueStub.withArgs({ where: { id: 2 }, include: sinon.match.any }).returns(application2);
findUniqueStub.withArgs({ where: { id: 2 } }).returns(application2);

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
		reference: application1.reference,
		title: 'EN010003 - NI Case 3 Name',
		description: 'EN010003 - NI Case 3 Name Description',
		status: 'Draft',
		caseEmail: 'test@test.com',
		sector: {
			name: 'sector',
			abbreviation: 'BB',
			displayNameEn: 'Sector Name En',
			displayNameCy: 'Sector Name Cy'
		},
		subSector: {
			name: 'sub_sector',
			abbreviation: 'AA',
			displayNameEn: 'Sub Sector Name En',
			displayNameCy: 'Sub Sector Name Cy'
		},
		applicants: [
			{
				firstName: 'Service Customer First Name',
				middleName: 'Service Customer Middle Name',
				lastName: 'Service Customer Last Name',
				email: 'service.customer@email.com',
				address: {
					addressLine1: 'Addr Line 1',
					addressLine2: 'Addr Line 2',
					county: 'County',
					postCode: 'Postcode',
					town: 'Town'
				},
				website: 'Service Customer Website',
				phoneNumber: '01234567890'
			}
		],
		geographicalInformation: {
			mapZoomLevel: {
				id: 1,
				name: 'zoom-level',
				displayOrder: 100,
				displayNameEn: 'Zoom Level Name En',
				displayNameCy: 'Zoom Level Name Cy'
			},
			locationDescription: 'Some Location',
			gridReference: {
				easting: 123_456,
				northing: 987_654
			},
			regions: [
				{
					displayNameCy: 'Region Name 1 Cy',
					displayNameEn: 'Region Name 1 En',
					id: 1,
					name: 'region1'
				},
				{
					displayNameCy: 'Region Name 2 Cy',
					displayNameEn: 'Region Name 2 En',
					id: 2,
					name: 'region2'
				}
			]
		},
		keyDates: {
			submissionDatePublished: 'Q1 2023',
			submissionDateInternal: 1_658_486_313
		}
	});
});

test('gets applications details when only case id present', async (t) => {
	const response = await request.get('/applications/2');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		geographicalInformation: {
			gridReference: {},
			mapZoomLevel: {}
		},
		id: 2,
		keyDates: {},
		status: 'Draft',
		subSector: {},
		sector: {}
	});
});

test('throws an error if case does not exist', async (t) => {
	const response = await request.get('/applications/3');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

test('throws an error if the id provided is a string/characters', async (t) => {
	const response = await request.get('/applications/hi');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Application id must be a valid numerical value'
		}
	});
});

test('returns only description field when description query made', async (t) => {
	const response = await request.get('/applications/1?query={"description":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		description: 'EN010003 - NI Case 3 Name Description'
	});

	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('does not return description field when description query false', async (t) => {
	const response = await request.get('/applications/1?query={"description":false}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1
	});

	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('returns only title field when title query made', async (t) => {
	const response = await request.get('/applications/1?query={"title":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		title: 'EN010003 - NI Case 3 Name'
	});

	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('does not return title field when title query false', async (t) => {
	const response = await request.get('/applications/1?query={"title":false}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1
	});

	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('returns multiple field when multiple queries made', async (t) => {
	const response = await request.get('/applications/1?query={"title":true,"description":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		description: 'EN010003 - NI Case 3 Name Description',
		id: 1,
		title: 'EN010003 - NI Case 3 Name'
	});
	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('does not return query marked false', async (t) => {
	const response = await request.get('/applications/1?query={"title":false,"description":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		description: 'EN010003 - NI Case 3 Name Description',
		id: 1
	});
	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('returns only subsector field when subSector query made', async (t) => {
	const response = await request.get('/applications/1?query={"subSector":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		subSector: {
			abbreviation: 'AA',
			displayNameCy: 'Sub Sector Name Cy',
			displayNameEn: 'Sub Sector Name En',
			name: 'sub_sector'
		}
	});

	sinon.assert.calledWith(findUniqueStub, {
		where: { id: 1 },
		include: {
			ApplicationDetails: { include: { subSector: true, zoomLevel: false, regions: false } }
		}
	});
});

test('does not return subsector field when subSector query false', async (t) => {
	const response = await request.get('/applications/1?query={"subSector":false}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1
	});

	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('returns only geographical inf field when query made', async (t) => {
	const response = await request.get('/applications/1?query={"geographicalInformation":true}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		geographicalInformation: {
			gridReference: {
				easting: 123_456,
				northing: 987_654
			},
			locationDescription: 'Some Location',
			mapZoomLevel: {
				displayNameCy: 'Zoom Level Name Cy',
				displayNameEn: 'Zoom Level Name En',
				displayOrder: 100,
				id: 1,
				name: 'zoom-level'
			},
			regions: [
				{
					displayNameCy: 'Region Name 1 Cy',
					displayNameEn: 'Region Name 1 En',
					id: 1,
					name: 'region1'
				},
				{
					displayNameCy: 'Region Name 2 Cy',
					displayNameEn: 'Region Name 2 En',
					id: 2,
					name: 'region2'
				}
			]
		},
		id: 1
	});
	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('does not return geographical inf field when query false', async (t) => {
	const response = await request.get('/applications/1?query={"geographicalInformation":false}');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1
	});
	sinon.assert.calledWith(findUniqueStub, { where: { id: 1 } });
});

test('return error 404 if application id not found', async (t) => {
	const response = await request.get('/applications/1234');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});
