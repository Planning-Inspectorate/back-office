import { ValidationErrors, ValidationError } from '@pins/express';

export interface ProjectUpdatesFormView {
	case: any;
	title: string;
	buttonText: string;
	errors?: ValidationErrors;
	form: {
		components: FormComponent[];
	};
}

export interface FormComponent {
	type: string;
	name: string;
	errorMessage?: string | ValidationError;
	// any other value for the specific (govuk or otherwise) component
	[key: string]: any;
}

export interface ProjectUpdatesDetailsView {
	case: any;
	title?: string;
	buttonText?: string;
	preview: { html: string };
	form?: {
		name: string;
		value: string;
	};
	// govuk summary list options here
	summary: { rows: any[] };
}
