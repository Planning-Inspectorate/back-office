import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
import { request } from '../../../../app-test.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');
const { eventClient } = await import('../../../../infrastructure/event-client.js');

describe('Mark-as-published', () => {
	test('Marks a document as published', async () => {
		// Arrange
		const updatedDocument = {
			Document: {
				guid: 'document_to_publish_guid'
			},
			version: 1,
			originalFilename: 'original_filename.pdf',
			fileName: 'filename.pdf',
			size: 23452,
			dateCreated: new Date('2023-03-26T00:00:00.000Z'),
			privateBlobContainer: 'document-uploads',
			privateBlobPath: 'published/en010120-filename.pdf'
		};

		const application1 = applicationFactoryForTests({
			id: 1,
			title: 'EN010003 - NI Case 3 Name',
			description: 'EN010003 - NI Case 3 Name Description',
			caseStatus: 'pre-application'
		});

		databaseConnector.case.findUnique.mockResolvedValue(application1);
		databaseConnector.documentVersion.update.mockResolvedValue(updatedDocument);

		// Act
		const response = await request
			.post('/applications/1/documents/1111-2222-3333/version/1/mark-as-published')
			.send({
				publishedBlobPath: 'published/en010120-filename.pdf',
				publishedBlobContainer: 'published-documents',
				publishedDate: new Date('2023-01-01T00:00:00Z')
			});

		// Assert

		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			data: {
				datePublished: new Date('2023-01-01T00:00:00Z'),
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'published/en010120-filename.pdf',
				publishedStatus: 'published',
				publishedStatusPrev: 'publishing'
			},
			include: {
				Document: {
					include: {
						case: true
					}
				}
			},
			where: {
				documentGuid_version: {
					documentGuid: '1111-2222-3333',
					version: 1
				}
			}
		});

		const expectedEventPayload = {
			documentId: 'document_to_publish_guid',
			version: 1,
			filename: 'filename.pdf',
			originalFilename: 'original_filename.pdf',
			size: 23452,
			documentURI: 'https://127.0.0.1:10000/document-uploads/published/en010120-filename.pdf',
			dateCreated: '2023-03-26T00:00:00.000Z'
		};

		expect(response.status).toEqual(200);

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-document',
			[expectedEventPayload],
			'Update',
			{
				publishing: 'true'
			}
		);
	});
});
