import { request } from '../../../../../app-test.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		representationId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		attachment: [{ id: 1 }]
	}
];

describe('Delete Application Representation Attachment', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Delete Representation Attachment', async () => {
		databaseConnector.representationAttachment.delete.mockResolvedValue({ id: '1' });
		databaseConnector.document.update.mockResolvedValue({ id: '1' });
		const response = await request
			.delete('/applications/1/representations/1/attachment/1')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			attachmentId: '1'
		});
	});
});
