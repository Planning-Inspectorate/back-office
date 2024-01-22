import { Address } from '@pins/appeals';
import { NotValidReasonOption, NotValidReasonResponse } from '../appeal-details.types';

export type AppellantCaseValidationOutcome = 'valid' | 'invalid' | 'incomplete';

export interface AppellantCaseNotValidReasonRequest {
	id: number;
	text?: string[];
}

export interface AppellantCaseValidationOutcomeRequest {
	validationOutcome: AppellantCaseValidationOutcome;
	invalidReasons?: AppellantCaseNotValidReasonRequest[];
	incompleteReasons?: AppellantCaseNotValidReasonRequest[];
	appealDueDate?: string;
}

export interface AppellantCaseValidationOutcomeResponse {
	outcome: AppellantCaseValidationOutcome;
	invalidReasons?: NotValidReasonResponse[];
	incompleteReasons?: NotValidReasonResponse[];
}

export interface AppellantCaseSessionValidationOutcome {
	appealId: string;
	validationOutcome: AppellantCaseValidationOutcome;
	reasons?: string | string[];
	reasonsText?: Object<string, string[]>;
}
