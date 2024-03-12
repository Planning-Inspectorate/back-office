import { jest } from '@jest/globals';
import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

const { databaseConnector } = await import('#utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		originalRepresentation: 'the original representation',
		redactedRepresentation: 'redacted version',
		case: { id: 1, reference: 'BC0110001' },
		representationActions: [],
		represented: {
			id: 10381,
			representationId: 6579,
			firstName: 'Mrs',
			lastName: 'Sue',
			jobTitle: null,
			under18: false,
			organisationName: null,
			email: 'sue@example.com',
			phoneNumber: '01234 567890',
			contactMethod: null,
			address: {
				id: 17059,
				addressLine1: '123 Some Street',
				addressLine2: 'Somewhere Else',
				postcode: 'B1 9BB',
				county: 'A County',
				town: 'Some Town',
				country: 'England'
			}
		},
		representative: {
			id: 10382,
			representationId: 6579,
			firstName: 'James',
			lastName: 'Bond',
			jobTitle: null,
			under18: false,
			organisationName: null,
			email: 'test-agent@example.com',
			phoneNumber: '01234 567890',
			contactMethod: null,
			address: {
				id: 17060,
				addressLine1: '1 Long Road',
				addressLine2: 'Smallville',
				postcode: 'P7 9LN',
				county: 'A County',
				town: 'Some Town',
				country: 'England'
			}
		},
		attachments: []
	},
	{
		id: 2,
		representationId: 200,
		reference: 'BC0110001-3',
		status: 'PUBLISHED',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		unpublishedUpdates: false
	}
];

const rep1UpdatePayload = {
	attachmentIds: [],
	caseId: 200,
	caseRef: 'BC0110001',
	dateReceived: '2023-03-14T14:28:25.704Z',
	examinationLibraryRef: '',
	originalRepresentation: 'the original representation',
	redactedRepresentation: 'redacted version',
	redacted: true,
	referenceId: 'BC0110001-2',
	representationId: 1,
	status: 'valid',
	registerFor: undefined,
	representationFrom: 'AGENT',
	representationType: null,
	representativeId: '10382',
	representedId: '10381'
};

const mockDate = new Date('2023-01-02');

describe('Patch Application Representation Redact', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.update.mockResolvedValue();
		databaseConnector.representationAction.create.mockResolvedValue();
		databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentations[0]);
		jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(mockDate);
	});
	afterEach(() => jest.clearAllMocks());

	it('Patch representation redact', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({
				actionBy: 'a person',
				redactedRepresentation: 'i have been redacted',
				notes: 'This is a duplicate Rep.'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { redacted: true, redactedRepresentation: 'i have been redacted' },
			where: { id: 1 }
		});

		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'a person',
				actionDate: mockDate,
				previousRedactStatus: true,
				notes: 'This is a duplicate Rep.',
				redactStatus: true,
				representationId: 1,
				type: 'REDACTION'
			}
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 1,
			redacted: true
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_REPRESENTATION,
			[rep1UpdatePayload],
			EventType.Update
		);
	});

	it('Patch representation redact - invalid request - missing mandatory field', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				actionBy: 'is a mandatory field',
				redactedRepresentation: 'is a mandatory field'
			}
		});
	});

	it('Patch representation redact - invalid request - Must be a valid status', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({ actionBy: 'a person', redactedRepresentation: 'a valid rep', type: 'bad type' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				type: 'Must be a valid type of: REDACTION,STATUS,REDACT_STATUS'
			}
		});
	});

	it('Patch representation redact - invalid request - redactStatus', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({ actionBy: 'a person', redactStatus: 'a valid rep', type: 'REDACT_STATUS' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				redactStatus: 'Invalid value'
			}
		});
	});

	it('Patch previously published representation', async () => {
		const prevPublishedRep = {
			...existingRepresentations[0],
			status: 'PUBLISHED'
		};
		const prevPublishedPayload = {
			...rep1UpdatePayload,
			status: 'published'
		};
		databaseConnector.representation.findFirst.mockResolvedValue(prevPublishedRep);
		databaseConnector.representation.findUnique.mockResolvedValue(prevPublishedRep);
		const response = await request
			.patch('/applications/200/representations/1/redact')
			.send({
				actionBy: 'a person',
				redactedRepresentation: 'i have been redacted',
				notes: 'This is a duplicate Rep.'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: {
				redacted: true,
				redactedRepresentation: 'i have been redacted',
				unpublishedUpdates: true
			},
			where: { id: 1 }
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 1,
			redacted: true
		});

		// test event broadcasts
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_REPRESENTATION,
			[prevPublishedPayload],
			EventType.Update
		);
	});
});
