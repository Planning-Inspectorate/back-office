export interface ProjectUpdate {
	id: number;
	caseId: number;
	authorId: number | null;
	dateCreated: string;
	emailSubscribers: boolean;
	sentToSubscribers: boolean;
	status: ProjectUpdateStatus;
	datePublished?: string;
	title: string | null;
	htmlContent: string;
	htmlContentWelsh: string | null;
}

export type ProjectUpdateStatus =
	| 'draft'
	| 'to-publish'
	| 'published'
	| 'unpublished'
	| 'archived'
	| string;
