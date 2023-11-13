const guid = '27d0fda4-8a9a-4f5a-a158-68eaea676158';
const version = 1;
const originalFileName = 'mydoc.pdf';
const fileName = 'mydoc';
const folderId = 23;

export const appeal = {
	id: 34,
	reference: 'APP/Q9999/D/21/941501'
};

export const folder = {
	folderId: 23,
	path: 'appellant_case/appealStatement',
	caseId: appeal.reference,
	documents: []
};

export const addDocumentsRequest = {
	blobStorageHost: 'host',
	blobStorageContainer: 'document-service-uploads',
	documents: [
		{
			caseId: appeal.id,
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
		caseId: appeal.id,
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
	case: { reference: appeal.reference },
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
	case: { reference: appeal.reference }
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
	blobStoreUrl: `appeal/APP-Q9999-D-21-941501/${guid}/v1/${fileName}`
};

export const savedFolder = {
	id: folderId,
	path: 'appellant_case/appealStatement',
	caseId: 1,
	documents: [
		{
			caseId: appeal.id,
			folderId,
			guid,
			name: originalFileName
		}
	]
};

export const documentMetaImport = {
	documentGuid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
	caseRef: '600012341',
	version: 1,
	documentType: 'applicationForm',
	published: false,
	sourceSystem: 'back-office',
	origin: null,
	originalFilename: 'appeal-statement.pdf',
	filename: 'appeal-statement.pdf',
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
	blobStoragePath: 'appeal/APPREF-123/v1/appeal-statement.pdf',
	dateCreated: '2023-08-17T15:22:20.827Z',
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'awaiting_upload',
	publishedStatusPrev: null,
	redactedStatus: null,
	redacted: false,
	documentURI:
		'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APPREF-123/c957e9d0-1a02-4650-acdc-f9fdd689c210/v1/appeal-statement.pdf'
};

export const documentVersionDetails = {
	documentGuid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
	version: 1,
	lastModified: null,
	documentType: 'applicationForm',
	published: false,
	sourceSystem: 'back-office',
	origin: null,
	originalFilename: 'appeal-statement.pdf',
	fileName: 'appeal-statement.pdf',
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
	blobStoragePath: 'appeal/APPREF-123/v1/appeal-statement.pdf',
	dateCreated: '2023-08-17T15:22:20.827Z',
	datePublished: null,
	isDeleted: false,
	examinationRefNo: null,
	filter2: null,
	publishedStatus: 'awaiting_upload',
	publishedStatusPrev: null,
	redactionStatusId: null,
	redacted: false,
	documentURI:
		'https://127.0.0.1:10000/devstoreaccount1/document-service-uploads/document-service-uploads/appeal/APPREF-123/c957e9d0-1a02-4650-acdc-f9fdd689c210/v1/appeal-statement.pdf',
	dateReceived: null
};

export const auditTrailUserInfo = {
	id: 1,
	azureAdUserId: '71625421654',
	sapId: ''
};

export const documentVersionAuditEntry = {
	id: 1,
	documentGuid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
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
	guid: 'c957e9d0-1a02-4650-acdc-f9fdd689c210',
	name: 'appeal-statement.pdf',
	folderId: 3779,
	createdAt: '2023-08-17T15:22:20.827Z',
	isDeleted: false,
	latestVersionId: 1,
	caseId: 492,
	documentVersion: [documentVersionDetails],
	versionAudit: [documentVersionAuditEntry]
};
