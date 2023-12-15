import { request } from '#app-test';
import { eventClient } from '#infrastructure/event-client.js';
import { jest } from '@jest/globals';

const { databaseConnector } = await import('#utils/database-connector.js');

const representations = [
	{
		id: 6409,
		reference: 'BC0110001-55',
		caseId: 151,
		status: 'VALID',
		unpublishedUpdates: false,
		originalRepresentation: 'the original rep',
		redactedRepresentation: 'the redacted rep',
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
		representedType: 'ORGANISATION',
		represented: {
			id: 10105,
			representationId: 6409,
			firstName: 'Joe',
			lastName: 'Bloggs',
			jobTitle: 'Head of Communications',
			under18: false,
			organisationName: 'Environment Agency',
			email: 'test@example.com',
			phoneNumber: '01234 567890',
			contactMethod: null,
			address: {
				id: 17058,
				addressLine1: '1 The Street',
				addressLine2: 'Somewhere',
				postcode: 'A1 9BB',
				county: 'The County',
				town: 'The Town',
				country: 'England'
			}
		},
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
				notes: 'some redaction notes'
			}
		]
	},
	{
		id: 6579,
		reference: 'BC0110001-1533',
		caseId: 151,
		status: 'PUBLISHED',
		unpublishedUpdates: true,
		originalRepresentation: 'the original rep',
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
		representedType: undefined, // this is not captured if rep has representative/agent
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
		representationActions: []
	}
];

const expectedNsipRepresentationPayload = [
	{
		attachmentIds: ['8e706443-3404-4b89-9fda-280ab7fd6b68'],
		caseRef: 'BC0110001',
		caseId: 151,
		dateReceived: '2023-08-11T10:52:56.516Z',
		examinationLibraryRef: '',
		originalRepresentation: 'the original rep',
		redactedRepresentation: 'the redacted rep',
		redacted: true,
		redactedBy: 'Bloggs, Joe',
		redactedNotes: 'some redaction notes',
		referenceId: 'BC0110001-55',
		representationId: 6409,
		representationType: null,
		representativeId: undefined,
		representedId: 10105,
		status: 'VALID',
		registerFor: 'ORGANISATION',
		representationFrom: 'ORGANISATION'
	},
	{
		attachmentIds: [],
		caseRef: 'BC0110001',
		caseId: 151,
		dateReceived: '2023-08-11T10:52:56.516Z',
		examinationLibraryRef: '',
		redacted: false,
		originalRepresentation: 'the original rep',
		referenceId: 'BC0110001-1533',
		representationId: 6579,
		representationType: null,
		representativeId: 10382,
		representedId: 10381,
		status: 'PUBLISHED',
		registerFor: undefined,
		representationFrom: 'AGENT'
	}
];

const expectedServiceUserPayload = [
	{
		id: '10105',
		firstName: 'Joe',
		lastName: 'Bloggs',
		addressLine1: '1 The Street',
		addressLine2: 'Somewhere',
		addressTown: 'The Town',
		addressCounty: 'The County',
		postcode: 'A1 9BB',
		addressCountry: 'England',
		organisation: 'Environment Agency',
		role: 'Head of Communications',
		telephoneNumber: '01234 567890',
		emailAddress: 'test@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10105'
	},
	{
		id: '10381',
		firstName: 'Mrs',
		lastName: 'Sue',
		addressLine1: '123 Some Street',
		addressLine2: 'Somewhere Else',
		addressTown: 'Some Town',
		addressCounty: 'A County',
		postcode: 'B1 9BB',
		addressCountry: 'England',
		organisation: null,
		role: null,
		telephoneNumber: '01234 567890',
		emailAddress: 'sue@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10381'
	},
	{
		id: '10382',
		firstName: 'James',
		lastName: 'Bond',
		addressLine1: '1 Long Road',
		addressLine2: 'Smallville',
		addressTown: 'Some Town',
		addressCounty: 'A County',
		postcode: 'P7 9LN',
		addressCountry: 'England',
		organisation: null,
		role: null,
		telephoneNumber: '01234 567890',
		emailAddress: 'test-agent@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10382'
	}
];

describe('Publish Representations', () => {
	jest.useFakeTimers({ now: 1_649_319_144_000 });

	afterEach(() => jest.clearAllMocks());

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
			expectedNsipRepresentationPayload,
			'Publish'
		);
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'service-user',
			expectedServiceUserPayload,
			'Publish',
			{
				entityType: 'RepresentationContact'
			}
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

	it('returns 400 response if no publishable representations found', async () => {
		databaseConnector.representation.findMany.mockResolvedValue([]);

		const response = await request.patch('/applications/1/representations/publish').send({
			representationIds: [6409, 6579],
			actionBy: 'Joe Bloggs'
		});

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({ errors: { message: 'unable to publish representations' } });

		expect(eventClient.sendEvents).not.toHaveBeenCalled();
		expect(databaseConnector.representation.update).not.toHaveBeenCalled();
		expect(databaseConnector.representationAction.create).not.toHaveBeenCalled();
		expect(databaseConnector.representation.updateMany).not.toHaveBeenCalled();
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
