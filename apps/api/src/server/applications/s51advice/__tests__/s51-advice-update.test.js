import { jest } from '@jest/globals';
import { request } from '#app-test';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
import { EventType } from '@pins/event-client';
import { NSIP_S51_ADVICE } from '#infrastructure/topics.js';
import { buildNsipS51AdvicePayload } from '#infrastructure/payload-builders/nsip-s51-advice.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
import { mapS51AdviceStatusToSchemaStatus } from '#utils/mapping/map-s51-advice-details.js';
const { eventClient } = await import('#infrastructure/event-client.js');
const { databaseConnector } = await import('#utils/database-connector.js');

const validS51AdviceBody = {
	caseId: 1,
	title: 'Advice 1',
	enquirer: 'New Power Company',
	firstName: 'John',
	lastName: 'Keats',
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-01-01T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-01-01T10:00'),
	adviceDetails: 'adviceDetails'
};

const validS51AdviceReturned = {
	id: 1,
	caseId: 1,
	title: 'Advice 1',
	enquirer: 'New Power Company',
	firstName: 'John',
	lastName: 'Keats',
	referenceNumber: 1,
	enquiryMethod: 'email',
	enquiryDate: new Date('2023-01-01T10:00'),
	enquiryDetails: 'enquiryDetails',
	adviser: 'adviser',
	adviceDate: new Date('2023-01-01T10:00'),
	adviceDetails: 'adviceDetails',
	redactedStatus: 'unredacted',
	publishedStatus: 'not_checked',
	publishedStatusPrev: 'not_checked',
	datePublished: null,
	isDeleted: false,
	createdAt: new Date('2023-01-21T10:00'),
	updatedAt: new Date('2023-01-21T10:00')
};

const s51AdviceDocuments = [
	{
		id: 1,
		adviceId: 5,
		documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
		Document: {
			guid: '458a2020-cafd-4885-a78c-1c13735e1aac',
			reference: 'EN0110002-000003',
			folderId: 1734,
			createdAt: '2023-08-16T13:57:21.992Z',
			isDeleted: false,
			latestVersionId: 1,
			caseId: 29,
			fromFrontOffice: false,
			latestDocumentVersion: {
				fileName: '2048px-Pittsburgh_Steelers_logo.svg',
				mime: 'application/pdf',
				size: 207364,
				dateCreated: '2023-08-16T13:57:22.022Z',
				publishedStatus: 'awaiting_upload',
				documentGuid: '458a2020-cafd-4885-a78c-1c13735e1aac',
				version: 1
			}
		}
	}
];

const applicationBase = applicationFactoryForTests({
	id: 1,
	reference: 'BC0110001',
	title: 'BC010001 - NI Case 1 Name',
	description: 'BC010001 - NI Case 1 Name Description',
	caseStatus: 'pre-application',
	applicantId: 1
});

const application1 = {
	...applicationBase,
	ApplicationDetails: {
		id: 100000000,
		caseId: 1,
		subSectorId: 1,
		locationDescription: null,
		zoomLevelId: 4,
		caseEmail: null,
		subSector: {
			id: 1,
			abbreviation: 'BC01',
			name: 'office_use',
			displayNameEn: 'Office Use',
			displayNameCy: 'Office Use',
			sectorId: 1,
			sector: {
				id: 1,
				abbreviation: 'BC',
				name: 'business_and_commercial',
				displayNameEn: 'Business and Commercial',
				displayNameCy: 'Business and Commercial'
			}
		}
	}
};

const validS51AdvicePayload = buildPayloadEventsForSchema(NSIP_S51_ADVICE, {
	caseId: 1,
	title: 'Advice 1',
	enquiryDetails: 'enquiryDetails',
	adviceDetails: 'adviceDetails',
	enquiryDate: '2023-01-01T10:00:00.000Z',
	adviceDate: '2023-01-01T10:00:00.000Z',
	caseReference: 'BC0110001',
	adviceId: 1,
	adviceReference: 'BC0110001-Advice-00001',
	from: 'New Power Company',
	agent: 'John Keats',
	method: 'email',
	adviceGivenBy: 'adviser',
	status: 'unchecked',
	redactionStatus: 'redacted',
	attachmentIds: []
});

// ============== TESTS ===========================
describe('Test S51 advice update status and redacted status', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('updates s51 advice status to not_checked AND redacted status to redacted', async () => {
		// GIVEN
		const validS51AdviceUpdated = {
			...validS51AdviceReturned,
			redactedStatus: 'redacted',
			publishedStatus: 'not_checked',
			publishedStatusPrev: ''
		};

		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([1]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdated);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);
		databaseConnector.case.findUnique.mockResolvedValue(application1);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'not_checked',
			redacted: true,
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'not_checked'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'not_checked',
				redactedStatus: 'redacted'
			},
			include: {
				S51AdviceDocument: true
			}
		});

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			validS51AdvicePayload,
			EventType.Update
		);
	});

	test('updates s51 advice status only to ready_to_publish, redaction status unchanged', async () => {
		// GIVEN
		const validS51AdviceUpdated = {
			...validS51AdviceReturned,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		const payloadUpdated = validS51AdvicePayload;
		payloadUpdated[0].redactionStatus = 'redacted';
		payloadUpdated[0].status = mapS51AdviceStatusToSchemaStatus('ready_to_publish');

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValueOnce([1]).mockResolvedValueOnce([]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdated);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'redacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish'
			},
			include: {
				S51AdviceDocument: true
			}
		});

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			payloadUpdated,
			EventType.Update
		);
	});

	test('updates s51 advice status to ready_to_publish, with enquirer organisation but no person', async () => {
		// GIVEN
		const validS51AdviceBodyNoPerson = {
			...validS51AdviceReturned,
			firstName: '',
			lastName: '',
			publishedStatus: 'not_checked',
			publishedStatusPrev: null,
			redactedStatus: 'unredacted'
		};
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoPerson,
			redactedStatus: 'unredacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBodyNoPerson);
		databaseConnector.s51Advice.findMany.mockResolvedValueOnce([1]).mockResolvedValueOnce([]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);
		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: 'unredacted',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish',
				redactedStatus: undefined,
				publishedStatusPrev: 'not_checked'
			},
			include: {
				S51AdviceDocument: true
			}
		});

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			[await buildNsipS51AdvicePayload(validS51AdviceUpdateResponse)],
			EventType.Update
		);
	});

	test('updates s51 advice status only to ready_to_publish, with enquirer person but no organisation', async () => {
		// GIVEN
		const validS51AdviceBodyNoOrg = {
			...validS51AdviceReturned,
			enquirer: '',
			redactedStatus: null
		};
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoOrg,
			redactedStatus: null,
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceBodyNoOrg);
		databaseConnector.s51Advice.findMany.mockResolvedValueOnce([1]).mockResolvedValueOnce([]);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 1 }]
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				id: '1',
				redactedStatus: '',
				status: 'ready_to_publish'
			}
		]);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				publishedStatus: 'ready_to_publish',
				redactedStatus: undefined,
				publishedStatusPrev: 'not_checked'
			},
			include: {
				S51AdviceDocument: true
			}
		});

		// EXPECT event broadcast
		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_S51_ADVICE,
			[await buildNsipS51AdvicePayload(validS51AdviceUpdateResponse)],
			EventType.Update
		);
	});

	test('throws 400 error updating s51 advice missing required data: title', async () => {
		// GIVEN
		const invalidS51AdviceBody = { ...validS51AdviceBody, id: 2, title: '' };

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(invalidS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 2 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors:
				'All mandatory fields must be completed. Return to the S51 advice properties screen to make changes.'
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('throws 400 error updating s51 advice when attachment is not scanned', async () => {
		// GIVEN
		const validS51AdviceBodyNoPerson = { ...validS51AdviceBody, firstName: '', lastName: '' };
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoPerson,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue();
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue(s51AdviceDocuments);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 3 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors:
				'There are attachments which have failed the virus check. Return to the S51 advice properties screen to delete files.'
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('throws 400 error updating s51 advice when advice is already published', async () => {
		// GIVEN
		const validS51AdviceBodyNoPerson = { ...validS51AdviceBody, firstName: '', lastName: '' };
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoPerson,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51Advice.findMany.mockResolvedValue([1]);
		databaseConnector.s51Advice.update.mockResolvedValue();
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValueOnce([]);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 4 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: 'You must first unpublish S51 advice before changing the status.'
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('throws 400 error updating s51 advice when attachment is published', async () => {
		// GIVEN
		const validS51AdviceBodyNoPerson = { ...validS51AdviceBody, firstName: '', lastName: '' };
		const validS51AdviceUpdateResponse = {
			...validS51AdviceBodyNoPerson,
			id: 1,
			redactedStatus: 'redacted',
			publishedStatus: 'ready_to_publish',
			publishedStatusPrev: 'not_checked'
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdateResponse);
		databaseConnector.s51Advice.findMany.mockResolvedValueOnce([1]).mockResolvedValueOnce([]);
		databaseConnector.s51Advice.update.mockResolvedValue();
		databaseConnector.s51AdviceDocument.findMany
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce(s51AdviceDocuments);

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 4 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: 'You must first unpublish documents before changing the status.'
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('throws 400 error updating s51 advice missing required data: enquirer AND firstName + lastName', async () => {
		// GIVEN
		const invalidS51AdviceBody = {
			...validS51AdviceBody,
			id: 3,
			enquirer: '',
			firstName: '',
			lastName: ''
		};

		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(invalidS51AdviceBody);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 3 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors:
				'All mandatory fields must be completed. Return to the S51 advice properties screen to make changes.'
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('throws 400 error updating s51 advice with invalid advice id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.s51Advice.findUnique.mockResolvedValue(null);
		databaseConnector.s51Advice.findMany.mockResolvedValue([]);
		databaseConnector.s51Advice.update.mockResolvedValue();

		// WHEN
		const response = await request.patch('/applications/1/s51-advice').send({
			status: 'ready_to_publish',
			items: [{ id: 999 }]
		});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: { items: 'Unknown S51 Advice id 999' }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledTimes(0);
	});

	test('returns 404 error updating s51 advice if case does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch('/applications/1001/s51-advice').send({
			status: 'not_checked',
			redacted: true,
			items: [{ id: 1 }, { id: 2 }]
		});

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: { id: 'Must be an existing application' }
		});
	});
});
