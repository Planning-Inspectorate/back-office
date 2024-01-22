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

declare global {
	namespace Express {
		interface Request {
			currentFolder: Schema.Folder;
			currentAppeal: Appeal;
			apiClient: import('got').Got;
		}
	}
}
