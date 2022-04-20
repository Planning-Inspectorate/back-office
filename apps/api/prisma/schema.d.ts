export interface Appeal {
  id: number;
  appealStatus: AppealStatus[];
  reference: string;
  localPlanningDepartment: string;
  planningApplicationReference: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  userId?: number;
  inspectorDecision?: InspectorDecision;
  siteVisit?: SiteVisit;
}

export interface AppealStatus {
  id: number;
  valid: boolean;
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
	| 'available_for_inspector_pickup'
	| 'complete_lpa_questionnaire'
	| 'site_visit_not_yet_booked'
	| 'site_visit_booked'
	| 'decision_due'
	| 'appeal_decided';

export interface InspectorDecision {
  id: number;
  appealId: number;
  outcome: string;
  decisionLetterFilename?: string;
}

export interface SiteVisit {
  id: number;
  appealId: number;
  visitDate: Date;
  visitSlot: string;
  visitType: string;
}

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
