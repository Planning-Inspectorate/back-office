import { householdAppeal } from '#tests/appeals/mocks.js';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { mapCaseReferenceForStorageUrl } from '#endpoints/documents/documents.mapper.js';

const guid = '27d0fda4-8a9a-4f5a-a158-68eaea676158';
const version = 1;
const originalFileName = 'mydoc.pdf';
const fileName = 'mydoc.pdf';
const folderId = 23;
const blobStoreUrl = `appeal/${mapCaseReferenceForStorageUrl(
	householdAppeal.reference
)}/${guid}/v1/${fileName}`;

export const folder = {
	folderId: 23,
	path: 'appellant_case/appealStatement',
	caseId: householdAppeal.reference,
	documents: []
};

export const addDocumentsRequest = {
	blobStorageHost: 'host',
	blobStorageContainer: 'document-service-uploads',
	documents: [
		{
			caseId: householdAppeal.id,
			documentName: originalFileName,
			documentType: 'application/pdf',
			documentSize: 14699,
			fileRowId: `file_row_1685470289030_16995`,
			folderId
		}
	]
};

export const addDocumentVersionRequest = {
	blobStorageHost: 'host',
	blobStorageContainer: 'document-service-uploads',
	document: {
		caseId: householdAppeal.id,
		documentName: originalFileName,
		documentType: 'application/pdf',
		documentSize: 14699,
		fileRowId: `file_row_1685470289030_16995`,
		folderId
	}
};

export const documentCreated = {
	guid,
	name: fileName,
	case: { reference: householdAppeal.reference },
	latestDocumentVersion: {
		version: 1
	},
	receivedAt: new Date().toISOString(),
	redactionStatus: {
		id: 1,
		name: 'Redacted'
	}
};

export const documentUpdated = {
	guid,
	name: fileName,
	latestVersionId: version,
	case: { reference: householdAppeal.reference }
};

export const documentVersionUpdated = {
	guid,
	name: fileName,
	latestVersionId: 2
};

export const documentVersionCreated = {
	documentGuid: guid,
	fileName,
	version
};

export const documentVersionRetrieved = {
	documentGuid: guid,
	fileName,
	version,
	parentDocument: documentUpdated
};

export const blobInfo = {
	caseType: 'appeal',
	caseReference: folder.caseId,
	GUID: guid,
	documentName: fileName,
	versionId: 1,
	blobStoreUrl: blobStoreUrl
};

export const savedFolder = {
	id: folderId,
	path: 'appellant_case/appealStatement',
	caseId: 1,
	documents: [
		{
			caseId: householdAppeal.id,
			folderId,
			guid,
			name: originalFileName,
			isDeleted: false
		}
	]
};

export const documentMeta = {
	documentGuid: guid,
	caseRef: householdAppeal.reference,
	version: 1,
	documentType: 'applicationForm',
	published: false,
	sourceSystem: 'back-office-appeals',
	origin: null,
	originalFilename: originalFileName,
	filename: fileName,
	representative: null,
	description: null,
	owner: null,
	author: null,
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	path: null,
	virusCheckStatus: null,
	size: 146995,
	stage: 'appellant_case',
	filter1: null,
	blobStorageContainer: 'document-service-uploads',
	blobStoragePath: blobStoreUrl,
	dateCreated: '2023-08-17T15:22:20.827Z',
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'awaiting_upload',
	publishedStatusPrev: null,
	redactedStatus: null,
	redacted: false,
	documentURI: `https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/${blobStoreUrl}`
};

export const documentVersionDetails = {
	documentGuid: guid,
	version: 1,
	lastModified: null,
	documentType: 'applicationForm',
	published: false,
	sourceSystem: 'back-office-appeals',
	origin: null,
	originalFilename: fileName,
	fileName: originalFileName,
	representative: null,
	description: null,
	owner: null,
	author: null,
	securityClassification: null,
	mime: 'application/pdf',
	horizonDataID: null,
	fileMD5: null,
	path: null,
	virusCheckStatus: null,
	size: 146995,
	stage: 'appellant_case',
	filter1: null,
	blobStorageContainer: 'document-service-uploads',
	blobStoragePath: blobStoreUrl,
	dateCreated: '2023-08-17T15:22:20.827Z',
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'awaiting_upload',
	publishedStatusPrev: null,
	redactionStatusId: null,
	redacted: false,
	documentURI: `https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/${blobStoreUrl}`,
	dateReceived: null
};

export const auditTrailUserInfo = {
	id: 1,
	azureAdUserId: azureAdUserId,
	sapId: ''
};

export const documentVersionAuditEntry = {
	id: 1,
	documentGuid: guid,
	version: 1,
	auditTrailId: 1,
	action: 'Create',
	auditTrail: {
		id: 1,
		appealId: 1,
		userId: 1,
		loggedAt: '2023-11-10',
		details: '',
		user: auditTrailUserInfo
	}
};

export const documentDetails = {
	guid: guid,
	name: fileName,
	folderId: 3779,
	createdAt: '2023-08-17T15:22:20.827Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 492,
	documentVersion: [documentVersionDetails],
	versionAudit: [documentVersionAuditEntry]
};

export const folderWithDocs = {
	folderId: 1,
	path: 'path/to/document/folder',
	documents: [
		{
			id: 'fdadc281-f686-40ee-97cf-9bafdd02b1cb',
			name: 'an appeal related document.pdf',
			folderId: 1,
			caseId: 2
		}
	]
};
