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

declare global {
	namespace Express {
		interface Request {
			currentFolder: Schema.Folder;
			currentAppeal: Appeal;
			apiClient: import('got').Got;
		}
	}
}
