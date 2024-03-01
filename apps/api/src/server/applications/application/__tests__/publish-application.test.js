import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
const { eventClient } = await import('#infrastructure/event-client.js');
const { databaseConnector } = await import('#utils/database-connector.js');

const now = 1_649_319_144_000;
const mockDate = new Date(now);
const expectedNsipProjectPayload = {
	caseId: 1,
	caseReference: 'TEST',
	projectName: undefined,
	projectDescription: undefined,
	sourceSystem: 'back-office-applications',
	publishStatus: 'published',
	applicantId: '1',
	nsipOfficerIds: [],
	nsipAdministrationOfficerIds: [],
	inspectorIds: [],
	operationsLeadId: null,
	operationsManagerId: null,
	caseManagerId: null,
	leadInspectorId: null,
	environmentalServicesOfficerId: null,
	legalOfficerId: null,
	migrationStatus: null
};

jest.useFakeTimers({ now });

describe('Publish application', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('publish an application and return published Date as a timestamp', async () => {
		// GIVEN
		const caseId = 1;

		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			reference: 'TEST',
			applicant: { id: 1 },
			CasePublishedState: [{ createdAt: mockDate, isPublished: true }]
		});
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

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedNsipProjectPayload],
			'Publish'
		);
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
