import * as schema from '@prisma/client';

export {
	Address,
	AppealDetailsFromAppellant,
	Appellant,
	LPAQuestionnaire,
	ReviewQuestionnaire
} from '@prisma/client';

export interface Appeal extends schema.Appeal, AppealRelations {
	appealStatus: AppealStatus[];
}

export interface AppealRelations {
	address?: schema.Address;
	appellant?: schema.Appellant;
	appealDetailsFromAppellant?: schema.AppealDetailsFromAppellant;
	validationDecision?: ValidationDecision[];
	reviewQuestionnaire?: schema.ReviewQuestionnaire[];
	lpaQuestionnaire?: schema.LPAQuestionnaire;
	inspectorDecision?: schema.InspectorDecision;
	siteVisit?: SiteVisit;
}

export interface AppealStatus extends schema.AppealStatus {
	status: AppealStatusType;
}

export type AppealStatusType =
	| 'received_appeal'
	| 'awaiting_validation_info'
	| 'valid_appeal'
	| 'invalid_appeal'
	| 'awaiting_lpa_questionnaire'
	| 'awaiting_lpa_questionnaire_and_statements'
	| 'received_lpa_questionnaire'
	| 'overdue_lpa_questionnaire'
	| 'incomplete_lpa_questionnaire'
	| 'available_for_statements'
	| 'available_final_comments'
	| 'available_for_inspector_pickup'
	| 'complete_lpa_questionnaire'
	| 'site_visit_not_yet_booked'
	| 'site_visit_booked'
	| 'decision_due'
	| 'appeal_decided';

export type AppealDocumentType =
	| 'plans used to reach decision'
	| 'statutory development plan policy'
	| 'other relevant policy'
	| 'supplementary planning document'
	| 'conservation area guidance'
	| 'listed building description'
	| 'application notification'
	| 'application publicity'
	| 'representation'
	| 'planning officers report'
	| 'appeal notification'
	| 'appeal statement'
	| 'decision letter'
	| 'planning application form'
	| 'supporting document';

export type ValidationDecisionType = 'valid' | 'invalid' | 'incomplete';

export interface ValidationDecision extends schema.ValidationDecision {
	decision: ValidationDecisionType;
}

export interface SiteVisit extends schema.SiteVisit {
	visitType: SiteVisitType
}

export type SiteVisitType = 'accompanied' | 'unaccompanied' | 'access required';

export interface InspectorDecision extends schema.InspectorDecision {
	outcome: InspectorDecisionOutcomeType;
}

export type InspectorDecisionOutcomeType = 'allowed' | 'dismissed' | 'split decision';
