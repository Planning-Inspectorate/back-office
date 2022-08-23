import { ValidationErrors } from '@pins/express';

export type ApplicationsCreateKeyDatesProps = {
	values: {
		'keyDates.submissionDatePublished'?: string;
		'keyDates.submissionDateInternal'?: string;
	};
	errors?: ValidationErrors;
};

export type ApplicationsCreateKeyDatesBody = {
	'keyDates.submissionDatePublished': string;
	submissionInternalDay: string;
	submissionInternalMonth: string;
	submissionInternalYear: string;
};
