export interface FolderDetails {
	id: number;
	displayNameEn: string;
	displayOrder?: number | null;
	stage?: string;
	isCustom: boolean;
}

export interface ChildFolderTemplate {
	create: FolderTemplate[];
}
export interface FolderTemplate {
	displayNameEn: string;
	displayOrder: number;
	caseId?: number;
	childFolders?: ChildFolderTemplate;
	stage?: string | null;
	isCustom?: boolean;
}
