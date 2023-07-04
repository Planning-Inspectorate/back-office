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
	}
];

describe('Post Application Representation Attachment', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Post Representation Attachment', async () => {
		databaseConnector.representationAttachment.create.mockResolvedValue({ id: '1' });
		const response = await request
			.post('/applications/1/representations/1/attachment')
			.send({
				documentId: '1'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			attachmentId: '1'
		});
	});
});
