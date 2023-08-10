/**
 * Project update type returned by the API
 */
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
	type: ProjectUpdateType;
}

export type ProjectUpdateStatus =
	| 'draft'
	| 'ready-to-publish'
	| 'published'
	| 'ready-to-unpublish'
	| 'unpublished'
	| 'archived'
	| string;

export type ProjectUpdateType =
	| 'general'
	| 'applicationSubmitted'
	| 'applicationDecided'
	| 'registrationOpen'
	| string;

/**
 * Project update notificaiton log type returned by the API
 */
export interface ProjectUpdateNotificationLog {
	id: number;
	projectUpdateId: number;
	subscriptionId: number;
	entryDate: string;
	emailSent: boolean;
	functionInvocationId: string;
}

/**
 * Type used for notification log create requests
 */
export interface ProjectUpdateNotificationLogCreateReq extends ProjectUpdateNotificationLog {
	id?: number;
}
