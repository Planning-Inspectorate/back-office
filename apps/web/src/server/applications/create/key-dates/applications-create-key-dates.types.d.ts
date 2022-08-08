import { ValidationErrors } from '@pins/express';

export type ApplicationsCreateKeyDatesProps = {
	values: {
		'keyDates.firstNotifiedDate': string;
		'keyDates.submissionDate': string;
	};
	errors?: ValidationErrors;
};

export type ApplicationsCreateKeyDatesBody = {
	firstNotifiedDay: string;
	firstNotifiedMonth: string;
	firstNotifiedYear: string;
	submissionDay: string;
	submissionMonth: string;
	submissionYear: string;
};
