export interface FileUploadInfo {
	documentName: string;
	documentType: string;
	documentSize: number;
	folderId: number;
}

export interface DocumentMetadata {
	blobStorageHost: string;
	blobStorageContainer: string;
	caseId: number;
	documentType: string;
	documentSize: number;
	folderId: number;
	name: string;
}

export interface DocumentUploadInfo {
	blobStoreUrl?: string;
	documentName: string;
	failedReason?: string;
	fileRowId: string;
}

export interface UploadInfo {
	accessToken: AccessToken;
	blobStorageContainer: string;
	blobStorageHost: string;
	documents: DocumentUploadInfo[];
}

export interface BlobInfo {
	blobStoreUrl: string;
	caseType: string;
	caseReference: string;
	documentName?: string;
	GUID: string;
}

export interface DocumentApiRequest {
	blobStorageHost: string;
	blobStorageContainer: string;
	documents: MappedDocument[];
}

export interface DocumentVersionApiRequest {
	blobStorageHost: string;
	blobStorageContainer: string;
	document: MappedDocument;
}

export interface MappedDocument {
	caseId: number;
	documentName: string;
	documentType: string;
	documentSize: number;
	fileRowId: string;
	folderId: number;
}
