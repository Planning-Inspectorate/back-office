import { SubscriptionType } from '@pins/applications';

/**
 * folder schema for use in code
 */
export interface Folder {
	id: number;
	caseReference: string;
	displayNameEnglish: string;
	displayNameWelsh?: string;
	parentFolderId?: number;
}
