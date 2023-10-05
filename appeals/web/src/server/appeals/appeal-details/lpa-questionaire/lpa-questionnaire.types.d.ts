import { NotValidReasonResponse } from '../appeal-details.types';

export type LPAQuestionnaireValidationOutcome = 'complete' | 'incomplete';

export interface LPAQuestionnaireSessionValidationOutcome {
	appealId: string;
	validationOutcome: LPAQuestionnaireValidationOutcome;
	reasons: string | string[];
	reasonsText: { [key: string]: string[] };
	appealReference: string;
	lpaQuestionnaireId: string;
}

interface LPAQuestionnaireIncompleteReasonRequest {
	id: number;
	text?: string[];
}

export interface LPAQuestionnaireValidationOutcomeRequest {
	validationOutcome: LPAQuestionnaireValidationOutcome;
	incompleteReasons?: LPAQuestionnaireIncompleteReasonRequest[];
	lpaQuestionnaireDueDate?: string;
}

export interface LPAQuestionnaireValidationOutcomeResponse {
	outcome: LPAQuestionnaireValidationOutcome;
	incompleteReasons?: NotValidReasonResponse[];
}
