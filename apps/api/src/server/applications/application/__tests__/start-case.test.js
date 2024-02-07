import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
const { eventClient } = await import('#infrastructure/event-client.js');
import { EventType } from '@pins/event-client';
import { NSIP_FOLDER, NSIP_PROJECT } from '#infrastructure/topics.js';

import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');

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

const folders = [
	{
		id: 78671,
		caseReference: 'EN01-1',
		displayNameEnglish: 'Project management',
		displayNameWelsh: null,
		parentFolderId: null
	},
	{
		id: 78672,
		caseReference: 'EN01-1',
		displayNameEnglish: 'Logistics',
		displayNameWelsh: null,
		parentFolderId: 78671
	},
	{
		id: 78673,
		caseReference: 'EN01-1',
		displayNameEnglish: 'Travel',
		displayNameWelsh: null,
		parentFolderId: 78672
	},
	{
		id: 78674,
		caseReference: 'EN01-1',
		displayNameEnglish: 'Welsh',
		displayNameWelsh: null,
		parentFolderId: 78672
	}
];

jest.useFakeTimers({ now: 1_649_319_144_000 });

describe('Start case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('starts application if all needed information is present', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(applicationReadyToStart);
		databaseConnector.folder.findMany.mockResolvedValue(folders);

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

		expect(databaseConnector.$executeRawUnsafe).toHaveBeenCalledTimes(1);

		// test 1st top level folder and its sub folders
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Project management',
				displayOrder: 100,
				caseId: 1,
				stage: null,
				childFolders: {
					create: [
						{
							displayNameEn: 'Logistics',
							displayOrder: 100,
							caseId: 1,
							stage: null,
							childFolders: {
								create: [
									{
										displayNameEn: 'Travel',
										displayOrder: 100,
										caseId: 1,
										stage: null
									},
									{
										displayNameEn: 'Welsh',
										displayOrder: 200,
										caseId: 1,
										stage: null
									}
								]
							}
						},
						{
							displayNameEn: 'Mail merge spreadsheet',
							displayOrder: 200,
							caseId: 1,
							stage: null
						},
						{
							displayNameEn: 'Fees',
							displayOrder: 300,
							caseId: 1,
							stage: null
						}
					]
				}
			}
		});

		// 2nd top level folder
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Legal advice',
				displayOrder: 200,
				caseId: 1,
				stage: null
			}
		});
		// 3rd top level folder
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Transboundary',
				displayOrder: 300,
				stage: 'Pre-application',
				childFolders: {
					create: [
						{
							displayNameEn: 'First screening',
							displayOrder: 100,
							caseId: 1,
							stage: 'Pre-application'
						},
						{
							displayNameEn: 'Second screening',
							displayOrder: 200,
							caseId: 1,
							stage: 'Pre-application'
						}
					]
				},
				caseId: 1
			}
		});

		const expectedProjectEventPayload = {
			caseId: 1,
			caseReference: 'EN01-1',
			projectName: 'Title',
			projectDescription: 'Description',
			publishStatus: 'unpublished',
			sourceSystem: 'back-office-applications',
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
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: []
		};

		const expectedFolderEventPayload = folders.map((folder) => {
			return {
				id: folder.id,
				caseReference: 'EN01-1',
				displayNameEnglish: folder.displayNameEn,
				displayNameWelsh: null,
				parentFolderId: folder.parentFolderId
			};
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			[expectedProjectEventPayload],
			EventType.Update
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			NSIP_FOLDER,
			expectedFolderEventPayload,
			EventType.Create
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

	test('does not publish Service Bus events for training cases', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			...applicationReadyToStart,
			reference: 'TRAIN'
		});

		// WHEN
		const response = await request.post('/applications/1/start');

		// THEN
		expect(response.status).toEqual(200);
		expect(eventClient.sendEvents).not.toHaveBeenCalled();
	});
});
