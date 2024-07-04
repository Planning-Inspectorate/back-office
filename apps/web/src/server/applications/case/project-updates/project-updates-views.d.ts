import { ValidationErrors, ValidationError } from '@pins/express';

export interface ProjectUpdatesFormView {
	case: any;
	title: string;
	buttonText: string;
	backLink?: string;
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
	caseIsWelsh?: boolean;
	title?: string;
	warningText?: string;
	buttonText?: string;
	buttonLink?: string;
	buttonClasses?: string;
	deleteButtonLink?: string;
	preview: { htmlContent?: string; htmlContentWelsh?: string | null };
	backLink?: string;
	form?: {
		name: string;
		value: string;
	};
	// govuk summary list options here
	summary: { rows: any[] };
}
