import { Folder } from '@pins/appeals/index.js';

export interface CheckboxRadioConditionalHtmlParameter {
	html?: string;
}

export interface CheckboxItemParameter {
	value: string;
	text: string;
	conditional?: CheckboxRadioConditionalHtmlParameter;
	checked?: boolean;
}

export interface DayMonthYear {
	day: number;
	month: number;
	year: number;
}

export type DocumentVirusCheckStatus = 'not_checked' | 'checked' | 'failed_virus_check';

export interface DocumentInfo {
	id: string;
	name: string;
	folderId?: number;
	caseId?: number;
	virusCheckStatus?: DocumentVirusCheckStatus;
	isLateEntry?: boolean;
}

export interface FolderInfo {
	folderId: number;
	path: string;
	documents: DocumentInfo[];
}

declare global {
	namespace Express {
		interface Request {
			currentFolder: Schema.Folder;
			currentAppeal: Appeal;
			apiClient: import('got').Got;
		}
	}
}
