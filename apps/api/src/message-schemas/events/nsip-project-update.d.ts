import { ProjectUpdateStatus } from '@pins/applications';

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
