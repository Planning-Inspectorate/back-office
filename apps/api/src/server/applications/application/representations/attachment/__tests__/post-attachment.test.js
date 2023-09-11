import { request } from '../../../../../app-test.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	},
	{
		id: 2,
		caseId: 200,
		reference: 'BC0110001-3',
		status: 'PUBLISHED',
		redacted: true,
		unpublishedUpdates: false,
		received: '2023-03-14T14:28:25.704Z'
	}
];

describe('Post Application Representation Attachment', () => {
	beforeAll(() => {
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Post Representation Attachment', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
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

	it('Post Published Representation Attachment', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);
		databaseConnector.representationAttachment.create.mockResolvedValue({ id: '2' });

		const response = await request
			.post('/applications/1/representations/2/attachment')
			.send({
				documentId: '1'
			})
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
			attachmentId: '2'
		});
	});
});
