import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app.js';
const { eventClient } = await import('../../../infrastructure/event-client.js');

import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const referenceSettingSqlQuery =
	'declare @sub_sector_abbreviation nchar(4), @max_reference int, @reference_number int;declare @minimum_new_reference int = 10001;declare @id int = 1;select @sub_sector_abbreviation = sub_sector_table.abbreviation FROM [dbo].[Case] as case_table     join [dbo].[ApplicationDetails] as application_details_table     on case_table.id = application_details_table.caseId     join [dbo].[SubSector] as sub_sector_table     on application_details_table.subSectorId = sub_sector_table.id where case_table.id = @id; SELECT @max_reference = max(cast(SUBSTRING(case_table.reference, 5, len(case_table.reference)) as int)) FROM [dbo].[Case] as case_table     join [dbo].[ApplicationDetails] as application_details_table     on case_table.id = application_details_table.caseId     join [dbo].[SubSector] as sub_sector_table     on application_details_table.subSectorId = sub_sector_table.id         and sub_sector_table.abbreviation = @sub_sector_abbreviation; if(@max_reference < @minimum_new_reference) select @reference_number = @minimum_new_reference else select @reference_number = @max_reference + 1;update [dbo].[Case]     set reference = @sub_sector_abbreviation + cast(@reference_number as nchar(5))     where id = @id;';

const applicationReadyToStart = applicationFactoryForTests({
	id: 1,
	title: 'Title',
	description: 'Description',
	caseStatus: 'draft',
	reference: 'EN01-1',
	dates: {
		modifiedAt: new Date(1_669_383_489_676),
		createdAt: new Date(1_669_383_489_676)
	},
	inclusions: {
		ApplicationDetails: true,
		regions: true,
		gridReference: true
	}
});

const applicationWithMissingInformation = applicationFactoryForTests({
	id: 3,
	title: null,
	description: null,
	caseStatus: 'draft',
	reference: 'EN01-1',
	inclusions: {
		ApplicationDetails: true,
		mapZoomLevel: false,
		subSector: false,
		regions: false,
		gridReference: false
	}
});

const applicationInPreApplicationState = applicationFactoryForTests({
	id: 4,
	title: 'Title',
	description: 'Description',
	caseStatus: 'pre_application',
	reference: 'EN01-1',
	inclusions: {
		ApplicationDetails: true,
		regions: true,
		gridReference: true
	}
});

jest.useFakeTimers({ now: 1_649_319_144_000 });

describe('Start case', () => {
	test('starts application if all needed information is present', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(applicationReadyToStart);

		// WHEN
		const response = await request.post('/applications/1/start');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			id: 1,
			reference: applicationReadyToStart.reference,
			status: 'Pre-Application'
		});

		expect(databaseConnector.caseStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [1] } },
			data: { valid: false }
		});

		expect(databaseConnector.caseStatus.create).toHaveBeenCalledWith({
			data: { status: 'pre_application', caseId: 1 }
		});

		expect(databaseConnector.case.update).not.toHaveBeenCalled();

		expect(databaseConnector.$executeRawUnsafe).toHaveBeenCalledWith(referenceSettingSqlQuery);

		// test 1st top level folder and its sub folders
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Project management',
				displayOrder: 100,
				caseId: 1,
				childFolders: {
					create: [
						{
							displayNameEn: 'Logistics',
							displayOrder: 100,
							caseId: 1,
							childFolders: {
								create: [
									{ displayNameEn: 'Travel', displayOrder: 100, caseId: 1 },
									{ displayNameEn: 'Welsh', displayOrder: 200, caseId: 1 }
								]
							}
						},
						{ displayNameEn: 'Mail merge spreadsheet', displayOrder: 200, caseId: 1 },
						{ displayNameEn: 'Fees', displayOrder: 300, caseId: 1 }
					]
				}
			}
		});
		// 2nd top level folder
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Legal advice',
				displayOrder: 200,
				caseId: 1
			}
		});
		// 3rd top level folder
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Transboundary',
				displayOrder: 300,
				caseId: 1,
				childFolders: {
					create: [
						{ displayNameEn: 'First screening', displayOrder: 100, caseId: 1 },
						{ displayNameEn: 'Second screening', displayOrder: 200, caseId: 1 }
					]
				}
			}
		});

		/** @type {import('../application.js').NsipProjectPayload} */
		const expectedEventPayload = {
			caseId: 1,
			caseReference: 'EN01-1',
			projectName: 'Title',
			projectDescription: 'Description',
			publishStatus: 'unpublished',
			sourceSystem: 'ODT',
			stage: 'draft',
			projectLocation: 'Some Location',
			projectEmailAddress: 'test@test.com',
			regions: ['north_west', 'south_west'],
			welshLanguage: false,
			mapZoomLevel: 'country',
			easting: 123_456,
			northing: 654_321,
			anticipatedDateOfSubmission: new Date('2022-07-22T10:38:33.000Z'),
			anticipatedSubmissionDateNonSpecific: 'Q1 2023',
			sector: 'BC - Business and Commercial',
			projectType: 'BC01 - Office Use',
			applicantIds: [],
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: [],
			interestedPartyIds: []
		};

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedEventPayload],
			'Update'
		);
	});

	test('throws an error if the application id is not recognised', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.post('/applications/2/start');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('throws an error if the application does not have all the required information to start', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(applicationWithMissingInformation);

		// WHEN
		const response = await request.post('/applications/3/start');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				description: 'Missing description',
				regions: 'Missing regions',
				sector: 'Missing sector',
				subSector: 'Missing subSector',
				title: 'Missing title',
				gridReferenceEasting: 'Missing gridReferenceEasting',
				gridReferenceNorthing: 'Missing gridReferenceNorthing'
			}
		});
	});

	test('throws an error if the application is not in draft state', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(applicationInPreApplicationState);

		// WHEN
		const response = await request.post('/applications/4/start');

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'pre_application' using 'START'."
			}
		});
	});
});
