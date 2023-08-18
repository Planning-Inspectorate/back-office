export interface AddDocumentsRequest {
	blobStorageHost: string;
	blobStorageContainer: string;
	documents: MappedDocument[];
}

export interface AddDocumentVersionRequest {
	blobStorageHost: string;
	blobStorageContainer: string;
	document: MappedDocument;
}

export interface MappedDocument {
	caseId: number;
	documentName: string;
	documentType: string;
	mimeType: string;
	documentSize: number;
	stage: string;
	fileRowId: string;
	folderId: number;
}

export interface AddDocumentsResponse {
	documents: (BlobInfo | null)[];
}

export interface BlobInfo {
	documentName: string;
	GUID: string;
	blobStoreUrl: string;
	caseType?: string | undefined;
	caseReference?: string | undefined;
	fileRowId?: string | undefined;
}

export interface UploadRequest {
	accessToken: AccessToken;
	blobStorageContainer: string;
	blobStorageHost: string;
	blobStoreUrl: string;
	documents: BlobInfo[];
}

export interface DocumentMetadata {
	blobStorageHost: string;
	blobStorageContainer: string;
	caseId: number;
	mime: string;
	stage: string;
	documentType: string;
	documentSize: number;
	folderId: number;
	name: string;
}
