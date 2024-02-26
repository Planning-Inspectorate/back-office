import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { databaseConnector } from '#utils/database-connector.js';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_S51_ADVICE } from '#infrastructure/topics.js';
import { buildNsipS51AdvicePayload } from '../s51-advice.js';
import { EventType } from '@pins/event-client';

const caseId = 1;
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
	updatedAt: new Date('2023-01-21T10:00'),
	S51AdviceDocument: []
};
const validS51AdviceUpdated = {
	...validS51AdviceReturned,
	redactedStatus: 'redacted',
	publishedStatus: 'not_checked',
	publishedStatusPrev: ''
};
const validS51AdvicePublished = {
	...validS51AdviceReturned,
	publishedStatus: 'published',
	datePublished: new Date('2023-01-21T10:00')
};
const caseObject = {
	id: 1,
	reference: 'BC0110001',
	modifiedAt: new Date('2023-01-21T10:00'),
	createdAt: new Date('2023-01-21T10:00'),
	description: 'A description of test case 1 which is a case of subsector type Office Use',
	title: 'Office Use Test Application 1',
	hasUnpublishedChanges: false,
	applicantId: 1
};

describe('Test S51 advice publishing', () => {
	beforeAll(() => {
		jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(new Date());
	});
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('publishes a list of a single given S51 advice items that is on the publish queue', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdated);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdvicePublished);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);
		databaseConnector.case.findUnique.mockResolvedValue(caseObject);

		const response = await request
			.post(`/applications/${caseId}/s51-advice/publish-queue-items`)
			.send({
				ids: [caseId]
			});

		// findUnique called once for the publish and once in verifyNotTrainingS51
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(2);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledWith({
			where: { id: caseId },
			include: { S51AdviceDocument: true }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_S51_ADVICE,
			[await buildNsipS51AdvicePayload(validS51AdvicePublished)],
			EventType.Publish
		);
		expect(response.status).toBe(200);
	});

	it('publishes a list of multiple given S51 advice items that are on the publish queue', async () => {
		databaseConnector.s51Advice.findUnique.mockResolvedValue(validS51AdviceUpdated);
		databaseConnector.s51Advice.update.mockResolvedValue(validS51AdvicePublished);
		databaseConnector.s51AdviceDocument.findMany.mockResolvedValue([]);
		databaseConnector.case.findUnique.mockResolvedValue(caseObject);

		const response = await request
			.post(`/applications/${caseId}/s51-advice/publish-queue-items`)
			.send({
				ids: [caseId, caseId]
			});

		// findUnique called once for the publish and once in verifyNotTrainingS51
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledTimes(4);
		expect(databaseConnector.s51Advice.update).toHaveBeenCalledTimes(2);
		expect(databaseConnector.s51Advice.findUnique).toHaveBeenCalledWith({
			where: { id: caseId },
			include: { S51AdviceDocument: true }
		});
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_S51_ADVICE,
			[
				await buildNsipS51AdvicePayload(validS51AdvicePublished),
				await buildNsipS51AdvicePayload(validS51AdvicePublished)
			],
			EventType.Publish
		);
		expect(response.status).toBe(200);
	});
});
