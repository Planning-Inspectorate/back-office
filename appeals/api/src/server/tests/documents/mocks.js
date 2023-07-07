/** @typedef {import('@pins/appeals/index.js').FileUploadInfo} FileUploadInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/** @typedef {import('@pins/appeals/index.js').MappedDocument} MappedDocument */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/**
 * @returns {DocumentApiRequest}
 */
const guid = '27d0fda4-8a9a-4f5a-a158-68eaea676158';
const version = 1;
const originalFileName = 'mydoc.pdf';
const fileName = 'mydoc';

export const appeal = {
	id: 34,
	reference: 'APP/Q9999/D/21/941501'
};

export const folder = {
	id: 23,
	displayName: 'myfolder',
	path: 'appellantCase/appealStatement',
	caseId: appeal.reference,
	documents: []
};

export const newDocRequest = {
	blobStorageContainer: 'document-service-uploads',
	documents: [
		{
			caseId: appeal.id,
			documentName: originalFileName,
			documentType: 'application/pdf',
			documentSize: 14699,
			fileRowId: `file_row_1685470289030_16995`,
			folderId: folder.id
		}
	]
};

export const newDocVersionRequest = {
	blobStorageContainer: 'document-service-uploads',
	document: {
		caseId: appeal.id,
		documentName: originalFileName,
		documentType: 'application/pdf',
		documentSize: 14699,
		fileRowId: `file_row_1685470289030_16995`,
		folderId: folder.id
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
