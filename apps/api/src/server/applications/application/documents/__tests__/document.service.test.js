import { describe, jest } from '@jest/globals';
import config from '#config/config.js';
const { databaseConnector } = await import('#utils/database-connector.js');

import {
	createDocumentVersion,
	getApplicationDocumentWebfilter,
	isFolderApplicationDocuments
} from '../document.service.js';
import { extractYouTubeURLFromHTML } from '../../../documents/documents.service.js';

/**
 * @type {Object<string, any>}
 */
const envConfig = {};
const envKeys = ['blobStorageUrl', 'blobStorageContainer'];
const saveEnvVars = () => {
	for (const key of envKeys) {
		envConfig[key] = config[key];
	}
};
const restoreEnvVars = () => {
	for (const key of envKeys) {
		config[key] = envConfig[key];
	}
};

const application = {
	id: 100000000,
	reference: 'BC0110001',
	modifiedAt: '2024-01-17T14:32:37.530Z',
	createdAt: '2024-01-16T16:44:26.710Z',
	description:
		'A description of test case 1 which is a case of subsector type Office Use. A David case',
	title: 'Office Use Test Application 1',
	hasUnpublishedChanges: true,
	applicantId: 100000000,
	ApplicationDetails: {
		id: 100000000,
		caseId: 100000000,
		subSectorId: 1,
		locationDescription: null,
		zoomLevelId: 4,
		caseEmail: null,
		subSector: {
			id: 1,
			abbreviation: 'BC01',
			name: 'office_use',
			displayNameEn: 'Office Use',
			displayNameCy: 'Office Use',
			sectorId: 1,
			sector: {
				id: 1,
				abbreviation: 'BC',
				name: 'business_and_commercial',
				displayNameEn: 'Business and Commercial',
				displayNameCy: 'Business and Commercial'
			}
		}
	}
};

const caseId = 1234;
const documentGuid = '1111-2222-3333';

const document = {
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1
};

const documentWithVersions = {
	guid: documentGuid,
	documentReference: 'BC0110001-000003',
	documentName: 'test',
	folderId: 1111,
	caseId: caseId,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1,
	fromFrontOffice: false,
	documentVersion: [
		{
			documentGuid: documentGuid + '1',
			version: 1,
			author: 'test',
			publishedStatus: 'published',
			fileName: 'Small',
			mime: 'application/pdf',
			size: 7945,
			owner: 'William Wordsworth'
		},
		{
			documentGuid: documentGuid,
			version: 2,
			author: 'test',
			fileName: 'Small1',
			publishedStatus: 'not_checked',
			mime: 'application/pdf',
			size: 7945,
			owner: 'William Wordsworth'
		}
	]
};

const documentWithVersionsUnpublished = {
	guid: documentGuid,
	documentName: 'test',
	folderId: 1111,
	documentSize: 1111,
	documentType: 'test',
	latestVersionId: 1,
	documentVersion: [
		{
			version: 1,
			author: 'test',
			publishedStatus: 'awaiting_check'
		},
		{
			version: 2,
			author: 'test'
		}
	]
};

const docVersionAfterUpdate = {
	documentGuid: documentGuid,
	version: 2,
	lastModified: null,
	documentType: null,
	published: false,
	sourceSystem: 'back-office-applications',
	origin: null,
	originalFilename: 'Small7.pdf',
	fileName: 'Small',
	representative: null,
	description: null,
	owner: 'Annamae Moore',
	author: null,
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	virusCheckStatus: null,
	size: 7945,
	stage: null,
	filter1: null,
	privateBlobContainer: 'private-blob',
	privateBlobPath: '/application/BC0110001/5d4826de-40f5-4b01-a72b-fa507c818799/2',
	publishedBlobContainer: null,
	publishedBlobPath: null,
	dateCreated: new Date('2024-01-31T14:18:26.889Z'),
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'not_checked',
	publishedStatusPrev: null,
	redactedStatus: 'redacted',
	redacted: false,
	transcriptGuid: null,
	Document: {
		guid: documentGuid,
		documentReference: 'BC0110001-000004',
		folderId: 8,
		createdAt: '2024-01-31T14:18:26.834Z',
		isDeleted: false,
		latestVersionId: 1,
		caseId: caseId,
		documentType: 'document',
		fromFrontOffice: false,
		folder: {
			case: {
				id: caseId,
				reference: 'BC0110001',
				modifiedAt: '2024-01-17T14:32:37.530Z',
				createdAt: '2024-01-16T16:44:26.710Z',
				description: 'A description of test case 1 which is a case of subsector type Office Use.',
				title: 'Office Use Test Application 1',
				hasUnpublishedChanges: true,
				applicantId: 100000000,
				CaseStatus: [{ id: 1, valid: true, status: 'draft' }]
			}
		}
	}
};

describe('Document service test', () => {
	beforeAll(() => {
		saveEnvVars();

		config.blobStorageUrl = 'blob-store-host';
		config.blobStorageContainer = 'blob-store-container';
	});
	beforeEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		restoreEnvVars();
	});

	test('createDocumentVersion throws error when case not exist', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		await expect(createDocumentVersion(document, caseId, documentGuid)).rejects.toThrow(Error);
	});

	test('createDocumentVersion throws error when document not exist', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);
		await expect(createDocumentVersion(document, caseId, documentGuid)).rejects.toThrow(Error);
	});

	test('createDocumentVersion uploads new version of document', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersions);
		databaseConnector.documentVersion.update.mockResolvedValue(docVersionAfterUpdate);

		const response = await createDocumentVersion(document, caseId, documentGuid);

		expect(response.blobStorageHost).toEqual('blob-store-host');
		expect(response.privateBlobContainer).toEqual('blob-store-container');
		expect(response.documents).toEqual([
			{
				GUID: documentGuid,
				blobStoreUrl: `/application/${application.reference}/${documentGuid}/2`,
				caseReference: application.reference,
				caseType: 'application',
				documentName: document.documentName,
				version: 2
			}
		]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(1);
	});

	test('createDocumentVersion uploads new version of document and does not unblish the document', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(documentWithVersionsUnpublished);
		databaseConnector.documentVersion.update.mockResolvedValue(docVersionAfterUpdate);

		const response = await createDocumentVersion(document, caseId, documentGuid);

		expect(response.blobStorageHost).toEqual('blob-store-host');
		expect(response.privateBlobContainer).toEqual('blob-store-container');
		expect(response.documents).toEqual([
			{
				GUID: documentGuid,
				blobStoreUrl: `/application/${application.reference}/${documentGuid}/2`,
				caseReference: application.reference,
				caseType: 'application',
				documentName: document.documentName,
				version: 2
			}
		]);
		expect(databaseConnector.document.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.upsert).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.document.update).toHaveBeenCalledTimes(1);
		expect(databaseConnector.documentActivityLog.create).toHaveBeenCalledTimes(1);
	});

	describe('extractYouTubeURLFromHTML', () => {
		it('correctly extracts a valid youtube src from an iframe tag within an html document', () => {
			const expectedSrc = 'https://www.youtube.com/embed/hHEvsjxSbU8?si=-eTnuGjPKCN8PRgI';
			const html = `<html lang="en"><body><iframe class="dummy-class" src="${expectedSrc}" id="dummy-id"></iframe></body></html>`;
			const src = extractYouTubeURLFromHTML(html);
			expect(src).toEqual(expectedSrc);
		});

		it('correctly extracts a valid youtube src from an iframe tag within an html document when iframe is in capitals', () => {
			const expectedSrc = 'https://www.youtube.com/embed/hHEvsjxSbU8?si=-eTnuGjPKCN8PRgI';
			const html = `<HTML LANG='en'><BODY><IFRAME CLASS='dummy-class' SRC='${expectedSrc}' ID='dummy-id'></IFRAME></BODY></HTML>`;
			const src = extractYouTubeURLFromHTML(html);
			expect(src).toEqual(expectedSrc);
		});

		it('fails when there is no iframe in the html', () => {
			const expectedSrc = 'https://www.youtube.com/embed/hHEvsjxSbU8?si=-eTnuGjPKCN8PRgI';
			const html = `<HTML LANG='en'><BODY><IMG class='dummy-class' src='${expectedSrc}' id='dummy-id'></IMG></BODY></HTML>`;
			expect(() => {
				extractYouTubeURLFromHTML(html);
			}).toThrow('No iframe found in the HTML');
		});

		it('fails when there is no src sttribute in the iframe in the html', () => {
			const html = `<html lang="en"><body><iframe class="dummy-class" id="dummy-id"></iframe></body></html>`;
			expect(() => {
				extractYouTubeURLFromHTML(html);
			}).toThrow('No iframe src found in the HTML');
		});

		it('fails when an invalid youtube url is found in the iframe', () => {
			const invalidUrl = 'https://badurl.com';
			const html = `<html lang="en"><body><iframe class="dummy-class" src='${invalidUrl}' id="dummy-id"></iframe></body></html>`;
			expect(() => {
				extractYouTubeURLFromHTML(html);
			}).toThrow(`iframe src is not a YouTube URL: ${invalidUrl}`);
		});
	});

	describe('#isFolderApplicationDocuments', () => {
		it('should return FALSE when folder is not within Acceptance > Application documents', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Not Application documents', id: 2 }
			];

			expect(isFolderApplicationDocuments(folderPath)).toBe(false);
		});
		it('should return TRUE when folder is contained within Acceptance > Application documents', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 }
			];
			expect(isFolderApplicationDocuments(folderPath)).toBe(true);
		});
	});
	describe('#getApplicationDocumentWebfilter', () => {
		it('should return correct webfilter for APPLICATION_FORM folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Application form', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Application form');
		});

		it('should return correct webfilter for COMPULSORY_ACQUISITION_INFORMATION folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Compulsory acquisition information', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Adequacy of Consultation Representation');
		});

		it('should return correct webfilter for DCO_DOCUMENTS folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'DCO documents', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Draft Development Consent Order');
		});

		it('should return correct webfilter for ENVIRONMENTAL_STATEMENT folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Environmental statement', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Environmental statement');
		});

		it('should return correct webfilter for OTHER_DOCUMENTS folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Other documents', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Other documents');
		});

		it('should return correct webfilter for PLANS folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Plans', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Plans');
		});

		it('should return correct webfilter for REPORTS folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Reports', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Reports');
		});

		it('should return correct webfilter for ADDITIONAL_REG_6_INFORMATION folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'Additional Reg 6 information', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('Additional Reg 6 Information');
		});

		it('should return empty string for a unknown folder', () => {
			const folderPath = [
				{ displayNameEn: 'Acceptance', id: 1 },
				{ displayNameEn: 'Application documents', id: 2 },
				{ displayNameEn: 'UNKNOWN FOLDER', id: 3 }
			];
			const result = getApplicationDocumentWebfilter(folderPath);
			expect(result).toBe('');
		});
	});
});
