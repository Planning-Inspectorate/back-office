import { CaseCreateProps } from '../../applications.types';

export interface ApplicationsCreateKeyDatesBody extends Record<string, string | undefined> {
	'keyDates.preApplication.submissionAtPublished'?: string;
	'keyDates.preApplication.submissionAtInternal'?: string;
	submissionInternalDay?: string;
	submissionInternalMonth?: string;
	submissionInternalYear?: string;
}
export interface ApplicationsCreateKeyDatesProps
	extends CaseCreateProps<ApplicationsCreateKeyDatesBody> {}
