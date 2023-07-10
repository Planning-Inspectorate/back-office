export interface CheckboxRadioConditionalHtmlParameter {
	html?: string;
}

export interface CheckboxItemParameter {
	value: string;
	text: string;
	conditional?: CheckboxRadioConditionalHtmlParameter;
	checked?: boolean;
}
