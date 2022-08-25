import * as schema from '@prisma/client';

export {
	Address,
	AppealDetailsFromAppellant,
	Appellant,
	LPAQuestionnaire,
	ReviewQuestionnaire,
	Region,
	Sector,
	SubSector,
	GridReference,
	ZoomLevel
} from '@prisma/client';

export interface Case extends schema.Case {
	CaseStatus?: CaseStatus;
	ApplicationDetails?: ApplicationDetails;
}

export interface ApplicationDetails extends schema.ApplicationDetails {
	subSector: SubSector;
	region?: Region;
}

export interface SubSector extends schema.SubSector {
	sector?: schema.Sector;
}

export interface ServiceCustomer extends schema.ServiceCustomer {
	address?: schema.Address;
	case?: schema.Case;
}

export interface Appeal extends schema.Appeal {
	appealStatus: AppealStatus[];
	appealType: AppealType;
	address?: schema.Address;
	appellant?: schema.Appellant;
	appealDetailsFromAppellant?: schema.AppealDetailsFromAppellant;
	validationDecision?: ValidationDecision[];
	reviewQuestionnaire?: schema.ReviewQuestionnaire[];
	lpaQuestionnaire?: schema.LPAQuestionnaire;
	inspectorDecision?: InspectorDecision;
	siteVisit?: SiteVisit;
	documents?: AppealDocument[];
}

export interface AppealDocument {
	id: number;
	type: AppealDocumentType;
	filename: string;
	url: string;
}

export interface AppealStatus extends schema.AppealStatus {
	status: AppealStatusType;
	subStateMachineName: AppealStatusMachineType | null;
}

export interface AppealType extends schema.AppealType {
	shorthand: AppealTypeCode;
}

export type AppealTypeCode = 'HAS' | 'FPA';

export type AppealStatusMachineType =
	| 'lpaQuestionnaireAndInspectorPickup'
	| 'statementsAndFinalComments';

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
	| 'available_for_final_comments'
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

export type ValidationDecisionType = 'complete' | 'invalid' | 'incomplete';

export interface ValidValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'complete';
	descriptionOfDevelopment: string;
}

export interface InvalidValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'invalid';
	outOfTime: boolean;
	noRightOfAppeal: boolean;
	notAppealable: boolean;
	lPADeemedInvalid: boolean;
	otherReasons: string | null;
}

export interface IncompleteValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'incomplete';
	namesDoNotMatch: boolean;
	sensitiveInfo: boolean;
	missingApplicationForm: boolean;
	missingDecisionNotice: boolean;
	missingGroundsForAppeal: boolean;
	missingSupportingDocuments: boolean;
	inflammatoryComments: boolean;
	openedInError: boolean;
	wrongAppealTypeUsed: boolean;
	otherReasons: string | null;
}

export type ValidationDecision =
	| ValidValidationDecision
	| InvalidValidationDecision
	| IncompleteValidationDecision;

export interface SiteVisit extends schema.SiteVisit {
	visitType: SiteVisitType;
}

export type SiteVisitType = 'accompanied' | 'unaccompanied' | 'access required';

export interface InspectorDecision extends schema.InspectorDecision {
	outcome: InspectorDecisionOutcomeType;
}

export type InspectorDecisionOutcomeType = 'allowed' | 'dismissed' | 'split decision';

export type CaseStatusNameType =
	| 'Pre-application'
	| 'Acceptance'
	| 'Pre-examination'
	| 'Examination'
	| 'Recommendation'
	| 'Decision'
	| 'Post decision'
	| 'Withdrawn';
