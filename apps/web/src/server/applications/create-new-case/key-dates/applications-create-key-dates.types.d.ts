import { CaseCreateProps } from '../../applications.types';

export interface ApplicationsCreateKeyDatesBody extends Record<string, string | undefined> {
	'keyDates.submissionDatePublished'?: string;
	'keyDates.submissionDateInternal'?: string;
	submissionInternalDay?: string;
	submissionInternalMonth?: string;
	submissionInternalYear?: string;
}
export interface ApplicationsCreateKeyDatesProps
	extends CaseCreateProps<ApplicationsCreateKeyDatesBody> {}
