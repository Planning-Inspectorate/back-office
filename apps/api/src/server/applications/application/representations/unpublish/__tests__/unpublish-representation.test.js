import { request } from '#app-test';
import { batchSendEvents } from '#infrastructure/event-batch-broadcaster.js';
import { jest } from '@jest/globals';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';

const { databaseConnector } = await import('#utils/database-connector.js');

const representations = [
	{
		id: 6409,
		reference: 'BC0110001-55',
		caseId: 151,
		status: 'PUBLISHED',
		unpublishedUpdates: false,
		originalRepresentation: 'the original rep',
		redactedRepresentation: 'the redacted rep',
		redacted: true,
		userId: null,
		received: new Date('2023-08-11T10:52:56.516Z'),
		type: 'Members of the public/businesses',
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
		unpublishedUpdates: false,
		originalRepresentation: 'the original rep',
		redactedRepresentation: null,
		redacted: false,
		userId: null,
		received: new Date('2023-08-11T10:52:56.516Z'),
		type: 'Members of the public/businesses',
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
		representedType: 'AGENT',
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

/**
 * This holds the array of obj with values after they have been mapped through the payload builder
 */
const expectedNsipRepresentationPayload = buildPayloadEventsForSchema(NSIP_REPRESENTATION, [
	{
		representationId: 6409,
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
		representedId: '10105',
		status: 'unpublished',
		registerFor: null,
		representationFrom: 'ORGANISATION',
		representationType: 'Members of the Public/Businesses'
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
		representativeId: '10382',
		representedId: '10381',
		status: 'unpublished',
		registerFor: null,
		representationFrom: 'AGENT',
		representationType: 'Members of the Public/Businesses'
	}
]);

const expectedServiceUserPayload = buildPayloadEventsForSchema(SERVICE_USER, [
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
		caseReference: 'BC0110001',
		organisation: 'Environment Agency',
		role: 'Head of Communications',
		telephoneNumber: '01234 567890',
		emailAddress: 'test@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10105',
		sourceSystem: 'back-office-applications'
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
		caseReference: 'BC0110001',
		telephoneNumber: '01234 567890',
		emailAddress: 'sue@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10381',
		sourceSystem: 'back-office-applications'
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
		caseReference: 'BC0110001',
		telephoneNumber: '01234 567890',
		emailAddress: 'test-agent@example.com',
		serviceUserType: 'RepresentationContact',
		sourceSuid: '10382',
		sourceSystem: 'back-office-applications'
	}
]);

describe('Unpublish Representations', () => {
	jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

	afterEach(() => jest.clearAllMocks());

	it('unpublishes representations with given ids', async () => {
		databaseConnector.representation.findMany.mockResolvedValue(representations);
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1, reference: 'BC0110001' });

		const response = await request.patch('/applications/1/representations/unpublish').send({
			representationIds: [6409, 6579],
			actionBy: 'Joe Bloggs'
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ unpublishedRepIds: [6409, 6579] });

		expect(batchSendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_REPRESENTATION,
			expectedNsipRepresentationPayload,
			'Unpublish'
		);
		expect(batchSendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedServiceUserPayload,
			'Unpublish',
			{
				entityType: 'RepresentationContact'
			}
		);
		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: {
				id: 6409
			},
			data: {
				status: 'UNPUBLISHED'
			}
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				representationId: 6409,
				previousStatus: 'PUBLISHED',
				status: 'UNPUBLISHED',
				actionBy: 'Joe Bloggs',
				actionDate: new Date(1_649_319_144_000),
				type: 'STATUS'
			}
		});
		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: {
				id: 6579
			},
			data: {
				status: 'UNPUBLISHED'
			}
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				representationId: 6579,
				previousStatus: 'PUBLISHED',
				status: 'UNPUBLISHED',
				actionBy: 'Joe Bloggs',
				actionDate: new Date(1_649_319_144_000),
				type: 'STATUS'
			}
		});
	});

	it('returns 400 response if no published representations found', async () => {
		databaseConnector.representation.findMany.mockResolvedValue([]);

		const response = await request.patch('/applications/1/representations/unpublish').send({
			representationIds: [6409, 6579],
			actionBy: 'Joe Bloggs'
		});

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({ errors: { message: 'unable to unpublish representations' } });

		expect(batchSendEvents).not.toHaveBeenCalled();
		expect(databaseConnector.representation.update).not.toHaveBeenCalled();
		expect(databaseConnector.representationAction.create).not.toHaveBeenCalled();
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
			.patch('/applications/1/representations/unpublish')
			.send(requestBody);

		expect(response.status).toEqual(400);
		expect(response.body.errors).toEqual(expectedError);
	});
});
