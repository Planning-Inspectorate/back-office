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

declare global {
	namespace Express {
		interface Request {
			currentFolder: Schema.Folder;
		}
	}
}
