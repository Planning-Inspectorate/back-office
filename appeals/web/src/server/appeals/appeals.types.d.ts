import { Folder } from '@pins/appeals/index.js';
/** @typedef {import('./appeal-details.types').Appeal} Appeal */

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

declare global {
	namespace Express {
		interface Request {
			currentFolder: Schema.Folder;
			currentAppeal: Appeal;
			apiClient: import('got').Got;
		}
	}
}
