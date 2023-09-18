import { jest } from '@jest/globals';
import { request } from '#app-test';

const { databaseConnector } = await import('#utils/database-connector.js');

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
		contacts: [
			{
				firstName: 'Jane',
				lastName: 'Bloggs',
				organisationName: 'Something Ltd'
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
		contacts: [
			{
				firstName: 'Joe',
				lastName: 'Bloggs'
			}
		]
	}
];

describe('Get Publishable Representations', () => {
	afterEach(() => jest.clearAllMocks());

	it('returns publishable representations for given case id', async () => {
		databaseConnector.representation.findMany.mockResolvedValue(representations);

		const response = await request.get('/applications/1/representations/publishable');

		expect(databaseConnector.representation.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: [{ status: 'desc' }, { reference: 'asc' }]
			})
		);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			itemCount: 2,
			items: [
				{
					id: 6409,
					reference: 'BC0110001-55',
					status: 'VALID',
					redacted: true,
					received: '2023-08-11T10:52:56.516Z',
					firstName: 'Jane',
					lastName: 'Bloggs',
					organisationName: 'Something Ltd'
				},
				{
					id: 6579,
					reference: 'BC0110001-1533',
					status: 'PUBLISHED',
					redacted: false,
					received: '2023-08-11T10:52:56.516Z',
					firstName: 'Joe',
					lastName: 'Bloggs'
				}
			]
		});
	});
});
