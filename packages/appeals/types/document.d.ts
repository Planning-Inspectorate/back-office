export interface FileUploadInfo {
	documentName: string;
	folderId: number;
	documentType: string;
	documentSize: number;
}

export interface DocumentMetadata {
	name: string;
	caseId: number;
	folderId: number;
	documentType: string;
	documentSize: number;
	blobStorageContainer: string;
}

export interface DocumentUploadInfo {
	documentName: string;
	fileRowId: string;
	blobStoreUrl?: string;
	failedReason?: string;
}

export interface UploadInfo {
	accessToken: AccessToken;
	blobStorageHost: string;
	blobStorageContainer: string;
	documents: DocumentUploadInfo[];
}

export interface BlobInfo {
	caseType: string;
	caseReference: string;
	GUID: string;
	documentName: string;
	blobStoreUrl: string;
}

export interface DocumentApiRequest {
	blobStorageContainer: string;
	documents: MappedDocument[];
}

export interface DocumentVersionApiRequest {
	blobStorageContainer: string;
	document: MappedDocument;
}

export interface MappedDocument {
	documentName: string;
	caseId: number;
	folderId: number;
	documentType: string;
	documentSize: number;
	fileRowId: string;
}
