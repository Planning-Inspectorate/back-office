import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

import { mapDateStringToUnixTimestamp } from '../../../utils/mapping/map-date-string-to-unix-timestamp.js';

const request = supertest(app);
const time = new Date();

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'draft',
	dates: {
		modifiedAt: time,
		publishedAt: time
	},
	inclusions: {
		serviceCustomer: true,
		ApplicationDetails: true,
		CaseStatus: true,
		gridReference: true
	}
});

// const application1SansInclusions = applicationFactoryForTests({
// 	id: 1,
// 	title: 'EN010003 - NI Case 3 Name',
// 	description: 'EN010003 - NI Case 3 Name Description',
// 	caseStatus: 'draft'
// });

const application2 = {
	...applicationFactoryForTests({
		id: 2,
		title: null,
		description: null,
		caseStatus: 'draft',
		dates: {
			modifiedAt: time,
			publishedAt: time
		},
		inclusions: {
			CaseStatus: true
		}
	}),
	reference: null
};

describe('Get Application details', () => {
	test('gets all data for a case when everything is available', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			reference: application1.reference,
			title: 'EN010003 - NI Case 3 Name',
			description: 'EN010003 - NI Case 3 Name Description',
			status: 'Draft',
			caseEmail: 'test@test.com',
			modifiedDate: mapDateStringToUnixTimestamp(time.toISOString()),
			publishedDate: mapDateStringToUnixTimestamp(time.toISOString()),
			sector: {
				name: 'business_and_commercial',
				abbreviation: 'BC',
				displayNameEn: 'Business and Commercial',
				displayNameCy: 'Business and Commercial'
			},
			subSector: {
				name: 'office_use',
				abbreviation: 'BC01',
				displayNameEn: 'Office Use',
				displayNameCy: 'Office Use'
			},
			applicants: [
				{
					id: 1,
					organisationName: 'Organisation',
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
					name: 'country',
					displayOrder: 900,
					displayNameEn: 'Country',
					displayNameCy: 'Country'
				},
				locationDescription: 'Some Location',
				gridReference: {
					easting: 123_456,
					northing: 654_321
				},
				regions: [
					{
						displayNameCy: 'North West',
						displayNameEn: 'North West',
						id: 1,
						name: 'north_west'
					},
					{
						displayNameCy: 'South West',
						displayNameEn: 'South West',
						id: 2,
						name: 'south_west'
					}
				]
			},
			keyDates: {
				submissionDatePublished: 'Q1 2023',
				submissionDateInternal: 1_658_486_313
			}
		});
	});

	test('gets applications details when only case id present', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application2);

		// WHEN
		const response = await request.get('/applications/2');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			description: null,
			reference: null,
			title: null,
			geographicalInformation: {
				gridReference: {},
				mapZoomLevel: {}
			},
			modifiedDate: mapDateStringToUnixTimestamp(time.toISOString()),
			publishedDate: mapDateStringToUnixTimestamp(time.toISOString()),
			id: 2,
			keyDates: {},
			status: 'Draft',
			subSector: {},
			sector: {}
		});
	});

	test('throws an error if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/3');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('throws an error if the id provided is a string/characters', async () => {
		// GIVEN

		// WHEN
		const response = await request.get('/applications/hi');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Application id must be a valid numerical value'
			}
		});
	});

	test('returns only description field when description query made', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"description":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			description: 'EN010003 - NI Case 3 Name Description'
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('does not return description field when description query false', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"description":false}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('returns only title field when title query made', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"title":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			title: 'EN010003 - NI Case 3 Name'
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('does not return title field when title query false', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"title":false}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('returns multiple field when multiple queries made', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"title":true,"description":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			description: 'EN010003 - NI Case 3 Name Description',
			id: 1,
			title: 'EN010003 - NI Case 3 Name'
		});
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('does not return query marked false', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"title":false,"description":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			description: 'EN010003 - NI Case 3 Name Description',
			id: 1
		});
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('returns only subsector field when subSector query made', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"subSector":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			subSector: {
				name: 'office_use',
				abbreviation: 'BC01',
				displayNameEn: 'Office Use',
				displayNameCy: 'Office Use'
			}
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({
			where: { id: 1 },
			include: {
				ApplicationDetails: { include: { subSector: true, zoomLevel: false } }
			}
		});
	});

	test('does not return subsector field when subSector query false', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"subSector":false}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1
		});

		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('returns only geographical inf field when query made', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"geographicalInformation":true}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			geographicalInformation: {
				gridReference: {
					easting: 123_456,
					northing: 654_321
				},
				locationDescription: 'Some Location',
				mapZoomLevel: {
					id: 1,
					name: 'country',
					displayOrder: 900,
					displayNameEn: 'Country',
					displayNameCy: 'Country'
				},
				regions: [
					{
						displayNameCy: 'North West',
						displayNameEn: 'North West',
						id: 1,
						name: 'north_west'
					},
					{
						displayNameCy: 'South West',
						displayNameEn: 'South West',
						id: 2,
						name: 'south_west'
					}
				]
			},
			id: 1
		});
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('does not return geographical inf field when query false', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.get('/applications/1?query={"geographicalInformation":false}');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1
		});
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	test('return error 404 if application id not found', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/1234');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});
});
