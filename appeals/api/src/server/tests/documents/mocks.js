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
	case: { reference: appeal.reference }
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
