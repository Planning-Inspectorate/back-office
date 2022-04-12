import { RequireAtLeastOneKey } from "@pins/platform";
import { RequestHandler } from 'express';

declare module '@pins/validation' {
	export const validateAppealDetails: RequestHandler;
	export const validateAppellantName: RequestHandler;
	export const validateAppealSite: RequestHandler;
	export const validateLocalPlanningDepartment: RequestHandler;
	export const validatePlanningApplicationReference: RequestHandler;
	export const validateReviewOutcomeStatus: RequestHandler;
	export const validateIncompleteReviewOutcome: RequestHandler;
	export const validateInvalidReviewOutcome: RequestHandler;
	export const validateValidReviewOutcome: RequestHandler;
}

export interface Address {
	AddressLine1: string;
	AddressLine2?: string;
	Town: string;
	County?: string;
	PostCode: string;
};

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
