import { request } from '../../../../app-test.js';
import { eventClient } from '../../../../infrastructure/event-client.js';
import { jest } from '@jest/globals';

const { databaseConnector } = await import('../../../../utils/database-connector.js');

const representations = [
	{
		id: 6409,
		reference: 'BC0110001-55',
		caseId: 151,
		status: 'VALID',
		unpublishedUpdates: false,
		originalRepresentation: 'some rep text secret stuff',
		redactedRepresentation: 'some rep text',
		redacted: true,
		userId: null,
		received: '2023-08-11T10:52:56.516Z',
		type: null,
		user: null,
		attachments: [
			{
				id: 1,
				representationId: 6409,
				documentGuid: '8e706443-3404-4b89-9fda-280ab7fd6b68'
			}
		],
		case: {
			id: 151,
			reference: 'BC0110001',
			modifiedAt: '2023-08-11T10:53:00.660Z',
			createdAt: '2023-08-11T10:53:02.081Z',
			description: 'A description of test case 1 which is a case of subsector type Office Use',
			publishedAt: null,
			title: 'Office Use Test Application 1'
		},
		contacts: [
			{
				id: 10105,
				representationId: 6409,
				firstName: '',
				lastName: '',
				jobTitle: null,
				under18: false,
				type: 'ORGANISATION',
				organisationName: 'Environment Agency',
				email: 'test@example.com',
				phoneNumber: '01234 567890',
				contactMethod: null,
				addressId: 10105
			}
		],
		representationActions: [
			{
				id: 1346,
				representationId: 6409,
				type: 'REDACTION',
				status: null,
				previousStatus: null,
				redactStatus: true,
				previousRedactStatus: true,
				invalidReason: null,
				referredTo: null,
				actionBy: 'Bloggs, Joe',
				actionDate: '2023-07-04T12:10:02.410Z',
				notes: 'some notes here'
			}
		]
	},
	{
		id: 6579,
		reference: 'BC0110001-1533',
		caseId: 151,
		status: 'PUBLISHED',
		unpublishedUpdates: true,
		originalRepresentation: 'some words',
		redactedRepresentation: null,
		redacted: false,
		userId: null,
		received: '2023-08-11T10:52:56.516Z',
		type: null,
		user: null,
		attachments: [],
		case: {
			id: 151,
			reference: 'BC0110001',
			modifiedAt: '2023-08-11T10:53:00.660Z',
			createdAt: '2023-08-11T10:53:02.081Z',
			description: 'A description of test case 1 which is a case of subsector type Office Use',
			publishedAt: null,
			title: 'Office Use Test Application 1'
		},
		contacts: [
			{
				id: 10381,
				representationId: 6579,
				firstName: 'Mrs',
				lastName: 'Sue',
				jobTitle: null,
				under18: false,
				type: 'PERSON',
				organisationName: null,
				email: 'test@example.com',
				phoneNumber: '01234 567890',
				contactMethod: null,
				addressId: 10381
			},
			{
				id: 10382,
				representationId: 6579,
				firstName: 'James',
				lastName: 'Bond',
				jobTitle: null,
				under18: false,
				type: 'AGENT',
				organisationName: '',
				email: 'test-agent@example.com',
				phoneNumber: '01234 567890',
				contactMethod: null,
				addressId: 10382
			}
		],
		representationActions: []
	}
];

const expectedEventPayload = [
	{
		attachments: [
			{
				documentId: '8e706443-3404-4b89-9fda-280ab7fd6b68'
			}
		],
		caseRef: 'BC0110001',
		dateReceived: '2023-08-11T10:52:56.516Z',
		examinationLibraryRef: '',
		originalRepresentation: 'some rep text secret stuff',
		redacted: true,
		redactedBy: 'Bloggs, Joe',
		redactedNotes: 'some notes here',
		redactedRepresentation: 'some rep text',
		referenceId: 'BC0110001-55',
		registerFor: 'ORGANISATION',
		representationFrom: 'ORGANISATION',
		representationId: 6409,
		representationType: null,
		representative: {},
		represented: {
			contactMethod: null,
			emailAddress: 'test@example.com',
			firstName: '',
			id: 6409,
			lastName: '',
			organisationName: 'Environment Agency',
			telephone: '01234 567890',
			under18: false
		},
		status: 'VALID'
	},
	{
		attachments: [],
		caseRef: 'BC0110001',
		dateReceived: '2023-08-11T10:52:56.516Z',
		examinationLibraryRef: '',
		originalRepresentation: 'some words',
		referenceId: 'BC0110001-1533',
		registerFor: 'PERSON',
		representationFrom: 'AGENT',
		representationId: 6579,
		representationType: null,
		representative: {
			contactMethod: null,
			emailAddress: 'test-agent@example.com',
			firstName: 'James',
			id: 6579,
			lastName: 'Bond',
			organisationName: '',
			telephone: '01234 567890',
			under18: false
		},
		represented: {
			contactMethod: null,
			emailAddress: 'test@example.com',
			firstName: 'Mrs',
			id: 6579,
			lastName: 'Sue',
			organisationName: null,
			telephone: '01234 567890',
			under18: false
		},
		status: 'PUBLISHED'
	}
];

describe('Publish Representations', () => {
	jest.useFakeTimers({ now: 1_649_319_144_000 });

	it('publishes representations with given ids', async () => {
		databaseConnector.representation.findMany.mockResolvedValue(representations);

		const response = await request.patch('/applications/1/representations/publish').send({
			representationIds: [6409, 6579],
			actionBy: 'Joe Bloggs'
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ publishedRepIds: [6409, 6579] });

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-representation',
			expectedEventPayload,
			'Publish'
		);
		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: {
				id: 6409
			},
			data: {
				status: 'PUBLISHED'
			}
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				representationId: 6409,
				previousStatus: 'VALID',
				status: 'PUBLISHED',
				actionBy: 'Joe Bloggs',
				actionDate: new Date(1_649_319_144_000),
				type: 'STATUS'
			}
		});
		expect(databaseConnector.representation.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [6579] } },
			data: {
				unpublishedUpdates: false
			}
		});
	});

	it.each([
		{
			name: 'missing representationIds property',
			requestBody: { actionBy: 'foo' },
			expectedError: { representationIds: 'at least 1 id must be provided' }
		},
		{
			name: 'empty representationIds',
			requestBody: { representationIds: [], actionBy: 'foo' },
			expectedError: { representationIds: 'at least 1 id must be provided' }
		},
		{
			name: 'representationIds not numbers',
			requestBody: { representationIds: ['a'], actionBy: 'foo' },
			expectedError: { representationIds: 'Must be an array of numbers' }
		},
		{
			name: 'missing actionBy',
			requestBody: { representationIds: [1] },
			expectedError: { actionBy: 'is a mandatory field' }
		}
	])('$name', async ({ requestBody, expectedError }) => {
		const response = await request
			.patch('/applications/1/representations/publish')
			.send(requestBody);

		expect(response.status).toEqual(400);
		expect(response.body.errors).toEqual(expectedError);
	});
});
