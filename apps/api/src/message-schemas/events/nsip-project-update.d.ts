/**
 * nsip-project-update schema for use in code
 */
export interface NSIPProjectUpdate {
	id: number;
	caseReference: string;
	updateDate?: string;
	updateName?: string;
	updateContentEnglish: string;
	updateContentWelsh?: string;
	updateStatus: ProjectUpdateStatus;
}

export type ProjectUpdateStatus = 'draft' | 'published' | 'unpublished' | 'archived' | string;
