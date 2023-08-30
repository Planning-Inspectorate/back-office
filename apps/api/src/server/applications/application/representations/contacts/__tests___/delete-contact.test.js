import { request } from '../../../../../app-test.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		representationId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
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

describe('Delete Application Representation Contact', () => {
	beforeAll(() => {
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Delete representation contact', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representationContact.delete.mockResolvedValue();

		const response = await request
			.delete('/applications/1/representations/2/contacts/1')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			contactId: '1'
		});
	});

	it('Delete published representation contact', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);
		databaseConnector.representationContact.delete.mockResolvedValue();

		const response = await request
			.delete('/applications/1/representations/1/contacts/1')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			where: { id: 2 },
			data: {
				unpublishedUpdates: true
			}
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			contactId: '1'
		});
	});
});
