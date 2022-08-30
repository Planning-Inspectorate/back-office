import { ValidationErrors } from '@pins/express';
export type ApplicationsCreateConfirmationProps = {
	values: { reference: string };
}

export type ApplicationsCreateCheckYourAnswersProps = {
	values: {
		'keyDates.submissionDatePublished': string;
		'keyDates.submissionDateInternal': string;
	};
	errors?: ValidationErrors;
};

export type ApplicationsCreateCheckYourAnswersBody = {
	submissionDatePublished: string;
	submissionInternalDay: string;
	submissionInternalMonth: string;
	submissionInternalYear: string;
};
