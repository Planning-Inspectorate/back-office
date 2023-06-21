import { buildNsipDocumentPayload } from '../document.js';
import { validateNsipDocument } from '../../../../utils/schema-test-utils.js';

describe('validateNsipDocument', () => {
	test('validateNsipDocument maps NSIP Document to NSIP Document Payload', () => {
		// 1. Arrange
		const nsipDocument = {
			Document: {
				guid: 'document1',
				createdAt: new Date('2023-03-26T00:00:00.000Z'),
				case: {
					reference: 'EN010120'
				}
			},
			version: 1,
			lastModified: new Date('2023-03-26T00:00:00.000Z'),
			documentType: 'Rule 8 letter',
			published: true,
			sourceSystem: 'back_office',
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
			path: 'EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
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
			documentURI: 'https://published/en010120/filename.pdf'
		};
		// 2. Act
		// @ts-ignore
		const result = buildNsipDocumentPayload(nsipDocument);

		// 3. Assert
		/** @type {import('../document.js').NsipDocumentPayload} */
		// @ts-ignore
		const expectedResult = {
			documentId: 'document1',
			caseRef: 'EN010120',
			version: '1',
			examinationRefNo: 'XXX-0000',
			filename: 'filename.pdf',
			originalFilename: 'original_filename.pdf',
			size: 23452,
			mime: 'application/pdf',
			documentURI: 'https://published/en010120/filename.pdf',
			path: 'EN010011/2.Post-Submission/Application-Documents/Application-Form/Letter.PDF',
			virusCheckStatus: 'scanned',
			fileMD5: 'b1946ac92492d2347c6235b4d2611184',
			dateCreated: '2023-03-26T00:00:00.000Z',
			lastModified: '2023-03-26T00:00:00.000Z',
			redactedStatus: 'not_redacted',
			publishedStatus: 'published',
			datePublished: '2023-03-26T00:00:00.000Z',
			documentType: 'Rule 8 letter',
			securityClassification: 'public',
			sourceSystem: 'back_office',
			origin: 'pins',
			owner: 'owner1',
			author: 'author1',
			representative: 'ZZZ Agency',
			description:
				'Attachments to the letter to Department for Business, Energy & Industrial Strategy',
			stage: 'examination',
			filter1: 'Deadline 2',
			filter2: 'Scoping Option Report'
		};

		expect(expectedResult).toEqual(result);
		expect(validateNsipDocument(result)).toEqual(true);
	});
});
