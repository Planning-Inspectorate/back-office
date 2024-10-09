import { request } from '#app-test';

const { databaseConnector } = await import('#utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 1,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		attachments: [
			{
				id: 1,
				documentGuid: 'document-guid',
				Document: {
					guid: 'document-guid',
					isDeleted: false,
					latestDocumentVersion: {
						fileName: 'file1.pdf'
					}
				}
			}
		],
		representationActions: []
	},
	{
		id: 2,
		caseId: 1,
		reference: 'BC0110001-3',
		status: 'PUBLISHED',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z',
		unpublishedUpdates: false,
		attachments: [
			{
				id: 2,
				documentGuid: 'document-guid-2',
				Document: {
					guid: 'document-guid-2',
					isDeleted: false,
					latestDocumentVersion: {
						fileName: 'file2.pdf'
					}
				}
			}
		],
		representationActions: []
	}
];

/**
 * This is  representation[0] after the attached doc has been marked as deleted
 */
const repAfterAttachmentDeletion = {
	id: 1,
	caseId: 1,
	reference: 'BC0110001-2',
	status: 'VALID',
	redacted: true,
	received: '2023-03-14T14:28:25.704Z',
	attachments: [
		{
			id: 1,
			documentGuid: 'document-guid',
			Document: {
				guid: 'document-guid',
				isDeleted: true,
				latestDocumentVersion: {
					fileName: 'file1.pdf'
				}
			}
		}
	],
	representationActions: []
};

describe('Delete Application Representation Attachment', () => {
	beforeAll(() => {
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
	});

	it('Delete Representation Attachment', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findUnique.mockResolvedValue(existingRepresentations[0]);
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

		// deleting the attachment marks it as isDeleted in the doc table
		// check that the attachment does not return after being marked as deleted
		databaseConnector.representation.findUnique.mockResolvedValue(repAfterAttachmentDeletion);
		const getRepAfterDeletingAttachment = await request.get('/applications/1/representations/1');

		expect(getRepAfterDeletingAttachment.body.attachments).toEqual([]);
	});

	it('Delete Published Representation Attachment', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);
		databaseConnector.representationAttachment.delete.mockResolvedValue({ id: '2' });
		databaseConnector.document.update.mockResolvedValue({ id: '2' });

		const response = await request
			.delete('/applications/1/representations/2/attachment/2')
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
