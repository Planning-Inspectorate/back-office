export interface FolderDetails {
	id: number;
	displayNameEn: string;
	displayOrder?: number | null;
}

export interface FolderTemplate {
	uniqueId: number;
	displayNameEn: string;
	displayOrder: number;
	childFolders?: FolderTemplate[];
}
