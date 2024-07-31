import { buildNsipDocumentPayload } from '#infrastructure/payload-builders/nsip-document.js';
import { validateMessageToSchema, validateNsipDocument } from '#utils/schema-test-utils.js';
import { buildDocumentFolderPath } from '../document.service.js';
const { databaseConnector } = await import('#utils/database-connector.js');

describe('validateNsipDocument', () => {
	test('validateNsipDocument maps NSIP Document to NSIP Document Payload', async () => {
		// 1. Arrange
		const nsipDocument = {
			Document: {
				guid: 'document1',
				documentReference: 'EN0110001-000001',
				createdAt: new Date('2023-03-26T00:00:00.000Z'),
				caseId: 1,
				case: {
					id: 1,
					reference: 'EN010120'
				},
				folderId: 2,
				folder: {
					id: 2,
					case: {
						reference: 'EN010120',
						id: 1,
						title: 'EN0110001 - NI Case 3 Name',
						description: 'test',
						createdAt: '2022-01-01T11:59:38.129Z',
						modifiedAt: '2023-03-10T13:49:09.666Z',
						publishedAt: null,
						CaseStatus: [
							{ id: 1, valid: false, status: 'draft' },
							{ id: 2, valid: true, status: 'examination' }
						]
					}
				}
			},
			version: 1,
			lastModified: new Date('2023-03-26T00:00:00.000Z'),
			documentType: 'Rule 8 letter',
			horizonDataID: null,
			published: true,
			sourceSystem: 'back-office-applications',
			origin: 'pins',
			originalFilename: 'original_filename.pdf',
			fileName: 'filename.pdf',
			representative: 'ZZZ Agency',
			description:
				'Attachments to the letter to Department for Business, Energy & Industrial Strategy',
			owner: 'owner1',
			author: 'author1',
			securityClassification: 'public',
			mime: 'application/pdf',
			fileMD5: 'b1946ac92492d2347c6235b4d2611184',
			privateBlobContainer: 'document-uploads',
			privateBlobPath:
				'EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
			publishedBlobContainer: 'document-uploads',
			publishedBlobPath:
				'EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
			virusCheckStatus: 'scanned',
			size: 23452,
			stage: 'examination',
			filter1: 'Deadline 2',
			filter2: 'Scoping Option Report',
			dateCreated: new Date('2023-03-26T00:00:00.000Z'),
			datePublished: new Date('2023-03-26T00:00:00.000Z'),
			isDeleted: false,
			examinationRefNo: 'XXX-0000',
			publishedStatus: 'published',
			redactedStatus: 'not_redacted',
			transcriptGuid: null,
			path: 'EN010120/Folder 1/Folder 2/filename.pdf'
		};

		const folder1 = {
			id: 1,
			parentFolderId: null,
			caseId: 1,
			displayNameEn: 'Folder 1'
		};
		const folder2 = {
			id: 2,
			parentFolderId: 1,
			caseId: 1,
			displayNameEn: 'Folder 2'
		};

		databaseConnector.folder.findUnique
			.mockResolvedValueOnce(folder2)
			.mockResolvedValueOnce(folder1);

		// 2. Act

		// get the folder path and file name, needed for payload
		const filePath = await buildDocumentFolderPath(
			nsipDocument.Document.folderId,
			nsipDocument.Document.folder.case.reference,
			nsipDocument.fileName
		);

		// @ts-ignore
		const result = buildNsipDocumentPayload(nsipDocument, filePath);

		// 3. Assert
		// @ts-ignore
		const expectedResult = {
			documentId: 'document1',
			caseRef: 'EN010120',
			caseId: 1,
			caseType: 'nsip',
			version: 1,
			examinationRefNo: 'XXX-0000',
			filename: 'filename.pdf',
			originalFilename: 'original_filename.pdf',
			size: 23452,
			mime: 'application/pdf',
			documentURI:
				'https://127.0.0.1:10000/document-uploads/EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
			publishedDocumentURI:
				'https://127.0.0.1:10000/document-uploads/EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
			virusCheckStatus: 'scanned',
			fileMD5: 'b1946ac92492d2347c6235b4d2611184',
			dateCreated: '2023-03-26T00:00:00.000Z',
			lastModified: '2023-03-26T00:00:00.000Z',
			redactedStatus: 'not_redacted',
			publishedStatus: 'published',
			datePublished: '2023-03-26T00:00:00.000Z',
			documentType: 'Rule 8 letter',
			securityClassification: 'public',
			sourceSystem: 'back-office-applications',
			origin: 'pins',
			owner: 'owner1',
			author: 'author1',
			representative: 'ZZZ Agency',
			description:
				'Attachments to the letter to Department for Business, Energy & Industrial Strategy',
			documentCaseStage: 'examination',
			filter1: 'Deadline 2',
			filter2: 'Scoping Option Report',
			documentReference: 'EN0110001-000001',
			horizonFolderId: null,
			transcriptId: null,
			path: 'EN010120/Folder 1/Folder 2/filename.pdf'
		};

		expect(result).toEqual(expectedResult);

		const isAllValid = await validateMessageToSchema('nsip-document.schema.json', result);
		if (isAllValid) {
			console.info(`Dummy publishing events ${JSON.stringify(result)}`);
		} else {
			console.info(
				`Message fails schema validation on  - no dummy events broadcast for ${JSON.stringify(
					result
				)}`
			);
		}

		expect(validateNsipDocument(result)).toEqual(true);
	});
});
