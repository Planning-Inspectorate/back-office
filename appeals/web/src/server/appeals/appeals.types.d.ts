export interface CheckboxRadioConditionalHtmlParameter {
	html?: string;
}

export interface CheckboxItemParameter {
	value: string;
	text: string;
	conditional?: CheckboxRadioConditionalHtmlParameter;
	checked?: boolean;
}

export interface SelectItemParameter {
	value: string;
	text: string;
	checked?: boolean;
}

export interface DayMonthYear {
	day: number;
	month: number; // 1-based, i.e. January === 1 (Date stores this as 0-based value, eg. Date.getMonth() called on a date in January will return 0)
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
