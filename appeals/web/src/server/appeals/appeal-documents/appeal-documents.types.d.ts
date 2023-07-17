export interface FolderInfo {
	folderId: number;
	path: string;
	documents: DocumentInfo[];
}

export interface DocumentInfo {
	id: string;
	name: string;
	folderId: number;
	caseId: number;
}
