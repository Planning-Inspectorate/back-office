export interface Appeal {
	AppealId: number;
	AppealReference: string;
	AppellantName: string;
	AppealStatus: AppealStatus;
	Received: string;
	AppealSite: Address;
	LocalPlanningDepartment: string;
	PlanningApplicationReference: string;
	Documents: AppealDocument[];
	reasons?: IncompleteReasons;
}

// todo: fix this definition
export type AppealSummary = Appeal;

export interface AppealDocument {
	Type: AppealDocumentType;
	Filename: string;
	URL: string;
}

export type AppealDocumentType = 'appeal statement' | 'decision letter' | 'planning application form' | 'supporting document';
export type AppealStatus = 'new' | AppealOutcomeStatus;
export type AppealOutcomeStatus = 'incomplete' | 'valid' | 'invalid';

type ReasonType<Key extends string> = RequireAtLeastOneKey<Record<Key, boolean> & { otherReasons: string }>;

export type IncompleteReasons = ReasonType<
	| 'inflammatoryComments'
	| 'missingApplicationForm'
	| 'missingDecisionNotice'
	| 'missingGroundsForAppeal'
	| 'missingSupportingDocuments'
	| 'namesDoNotMatch'
	| 'openedInError'
	| 'sensitiveInfo'
	| 'wrongAppealTypeUsed'
>;
export type IncompleteReasonType = keyof IncompleteReasons;

export type InvalidReasons = ReasonType<'outOfTime' | 'noRightOfAppeal' | 'notAppealable' | 'lPADeemedInvalid'>;
export type InvalidReasonType = keyof InvalidReasons;
