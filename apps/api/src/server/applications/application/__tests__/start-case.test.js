import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { EventType } from '@pins/event-client';
import { FOLDER, NSIP_PROJECT, SERVICE_USER } from '#infrastructure/topics.js';

import {
	applicationFactoryForTests,
	mockApplicationGet
} from '#utils/application-factory-for-tests.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';

const { eventClient } = await import('#infrastructure/event-client.js');
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
		displayNameEn: 'Project management',
		displayNameCy: null,
		parentFolderId: null,
		stage: 'developers_application',
		isCustom: false
	},
	{
		id: 78672,
		caseReference: 'EN01-1',
		displayNameEn: 'Logistics',
		displayNameCy: null,
		parentFolderId: 78671,
		stage: 'developers_application',
		isCustom: false
	},
	{
		id: 78673,
		caseReference: 'EN01-1',
		displayNameEn: 'Travel',
		displayNameCy: 'Teithio',
		parentFolderId: 78672,
		stage: 'developers_application',
		isCustom: false
	},
	{
		id: 78674,
		caseReference: 'EN01-1',
		displayNameEn: 'Welsh',
		displayNameCy: null,
		parentFolderId: 78672,
		stage: 'developers_application',
		isCustom: false
	}
];

jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

describe('Start case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('starts application if all needed information is present', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet(applicationReadyToStart)
		);
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
				isCustom: false,
				childFolders: {
					create: [
						{
							displayNameEn: 'Logistics',
							displayOrder: 100,
							caseId: 1,
							stage: null,
							isCustom: false,
							childFolders: {
								create: [
									{
										displayNameEn: 'Travel',
										displayOrder: 100,
										caseId: 1,
										stage: null,
										isCustom: false
									},
									{
										displayNameEn: 'Welsh',
										displayOrder: 200,
										caseId: 1,
										stage: null,
										isCustom: false
									}
								]
							}
						},
						{
							displayNameEn: 'Mail merges',
							displayOrder: 200,
							caseId: 1,
							stage: null,
							isCustom: false
						},
						{
							displayNameEn: 'Fees',
							displayOrder: 300,
							caseId: 1,
							stage: null,
							isCustom: false
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
				stage: null,
				isCustom: false
			}
		});
		// 3rd top level folder
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				displayNameEn: 'Transboundary',
				displayOrder: 300,
				stage: 'Pre-application',
				isCustom: false,
				childFolders: {
					create: [
						{
							displayNameEn: 'First screening',
							displayOrder: 100,
							caseId: 1,
							stage: 'Pre-application',
							isCustom: false
						},
						{
							displayNameEn: 'Second screening',
							displayOrder: 200,
							caseId: 1,
							stage: 'Pre-application',
							isCustom: false
						}
					]
				},
				caseId: 1
			}
		});

		const expectedProjectEventPayload = buildPayloadEventsForSchema(NSIP_PROJECT, {
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
			anticipatedDateOfSubmission: new Date('2022-07-22T10:38:33.000Z').toISOString(),
			anticipatedSubmissionDateNonSpecific: 'Q1 2023',
			sector: 'BC - Business and Commercial',
			projectType: 'BC01 - Office Use',
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: [],
			applicantId: '1'
		});

		const expectedApplicantEventPayload = [
			{
				addressCountry: 'Country',
				addressCounty: 'County',
				addressLine1: 'Addr Line 1',
				addressLine2: 'Addr Line 2',
				addressTown: 'Town',
				caseReference: 'EN01-1',
				emailAddress: 'service.customer@email.com',
				faxNumber: null,
				firstName: 'Service Customer First Name',
				id: '1',
				lastName: 'Service Customer Last Name',
				organisation: 'Organisation',
				organisationType: null,
				otherPhoneNumber: null,
				postcode: 'Postcode',
				role: null,
				salutation: null,
				serviceUserType: 'Applicant',
				sourceSuid: '1',
				sourceSystem: 'back-office-applications',
				telephoneNumber: '01234567890',
				webAddress: 'Service Customer Website'
			}
		];

		const expectedFolderEventPayload = folders.map((folder) => {
			return {
				id: folder.id,
				caseReference: 'EN01-1',
				displayNameEnglish: folder.displayNameEn,
				displayNameWelsh: folder.displayNameCy || folder.displayNameEn,
				parentFolderId: folder.parentFolderId,
				caseStage: folder.stage
			};
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(3);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedProjectEventPayload,
			EventType.Update
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantEventPayload,
			EventType.Update,
			{ entityType: 'Applicant' }
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			3,
			FOLDER,
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
		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet({
				...applicationReadyToStart,
				reference: 'TRAIN'
			})
		);

		// WHEN
		const response = await request.post('/applications/1/start');

		// THEN
		expect(response.status).toEqual(200);
		expect(eventClient.sendEvents).not.toHaveBeenCalled();
	});
});
