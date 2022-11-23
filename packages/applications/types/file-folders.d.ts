export interface FolderDetails {
	id: number;
	displayNameEn: string;
	displayOrder?: number | null;
}

export interface FolderTemplate {
	displayNameEn: string;
	displayOrder: number;
	caseId?: number;
	childFolders?: FolderTemplate[] | null;
}
