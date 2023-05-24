export interface ProjectUpdate {
	id: number;
	caseId: number;
	authorId: number | null;
	dateCreated: string;
	emailSubscribers: boolean;
	status: ProjectUpdateStatus;
	datePublished?: string;
	htmlContent: string;
}

export type ProjectUpdateStatus =
	| 'draft'
	| 'to-publish'
	| 'published'
	| 'unpublished'
	| 'archived'
	| string;
