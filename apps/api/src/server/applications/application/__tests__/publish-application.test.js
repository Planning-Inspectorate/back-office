import { jest } from '@jest/globals';
import { request } from '#app-test';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
import { NSIP_PROJECT, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
const { eventClient } = await import('#infrastructure/event-client.js');
const { databaseConnector } = await import('#utils/database-connector.js');

const now = 1_649_319_144_000;
const mockDate = new Date(now);
const expectedNsipProjectPayload = buildPayloadEventsForSchema(NSIP_PROJECT, {
	caseId: 1,
	caseReference: 'TEST',
	projectName: 'Some title',
	projectDescription: 'Some description',
	sourceSystem: 'back-office-applications',
	publishStatus: 'published',
	applicantId: '1',
	nsipOfficerIds: [],
	nsipAdministrationOfficerIds: [],
	inspectorIds: [],
	anticipatedDateOfSubmission: '2022-07-22T10:38:33.000Z',
	anticipatedSubmissionDateNonSpecific: 'Q1 2023',
	easting: 123456,
	mapZoomLevel: 'country',
	northing: 654321,
	projectEmailAddress: 'test@test.com',
	projectLocation: 'Some Location',
	projectType: 'BC01 - Office Use',
	regions: ['north_west', 'south_west'],
	sector: 'BC - Business and Commercial',
	stage: 'draft',
	welshLanguage: false
});

const expectedApplicantEventPayload = buildPayloadEventsForSchema(SERVICE_USER, {
	addressCountry: 'Country',
	addressCounty: 'County',
	addressLine1: 'Addr Line 1',
	addressLine2: 'Addr Line 2',
	addressTown: 'Town',
	caseReference: 'TEST',
	emailAddress: 'service.customer@email.com',
	firstName: 'Service Customer First Name',
	id: '1',
	lastName: 'Service Customer Last Name',
	organisation: 'Organisation',
	postcode: 'Postcode',
	serviceUserType: 'Applicant',
	sourceSuid: '1',
	sourceSystem: 'back-office-applications',
	telephoneNumber: '01234567890',
	webAddress: 'Service Customer Website'
});

jest.useFakeTimers({ now });

describe('Publish application', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('publish an application and return published Date as a timestamp', async () => {
		// GIVEN
		const caseId = 1;

		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet({
				id: 1,
				title: 'Some title',
				description: 'Some description',
				reference: 'TEST',
				dates: { publishedAt: mockDate }
			})
		);
		databaseConnector.case.update.mockResolvedValue({
			CasePublishedState: [{ createdAt: mockDate, isPublished: true }]
		});

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(200);

		const publishedDate = 1_649_319_144;

		expect(response.body).toEqual({
			publishedDate
		});

		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: caseId },
			data: {
				hasUnpublishedChanges: false,
				CasePublishedState: {
					create: {
						isPublished: true
					}
				}
			}
		});

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedNsipProjectPayload,
			EventType.Publish
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantEventPayload,
			EventType.Publish,
			{ entityType: 'Applicant' }
		);
	});

	test('returns 403 error if the reference is not authorised', async () => {
		// GIVEN
		const caseId = 1;

		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet({
				reference: 'GS5110001'
			})
		);

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(403);

		expect(response.body).toEqual({
			errors: 'case reference: GS5110001 is not authorised for publishing'
		});
	});

	test('returns 404 error if a caseId does not exist', async () => {
		// GIVEN
		const caseId = 134;

		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(404);

		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('does not publish Service Bus events for training cases', async () => {
		// GIVEN
		const caseId = 1;

		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			reference: 'TRAIN',
			CasePublishedState: [{ createdAt: mockDate, isPublished: true }]
		});
		databaseConnector.case.update.mockResolvedValue({
			CasePublishedState: [{ createdAt: mockDate, isPublished: true }]
		});

		// WHEN
		const response = await request.patch(`/applications/${caseId}/publish`);

		// THEN
		expect(response.status).toEqual(200);

		expect(eventClient.sendEvents).not.toHaveBeenCalled();
	});
});
