import { AppealSite } from '@pins/appeals';

// TODO: BOAT-245

interface DocumentInfo {
	id: string;
	name: string;
	folderId: number;
	caseId: number;
}

interface FolderInfo {
	folderId: number;
	path: string;
	documents: DocumentInfo[];
}

export type AppellantCaseValidationOutcome = 'valid' | 'invalid' | 'incomplete';

export interface AppellantCaseInvalidIncompleteReasonOption {
	id: number;
	name: string;
	hasText: boolean;
}

export interface AppellantCaseInvalidIncompleteReasonResponse {
	name: AppellantCaseInvalidIncompleteReasonOption;
	text?: string[];
}

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
	outcome: string;
	invalidReasons?: AppellantCaseInvalidIncompleteReasonResponse[];
	incompleteReasons?: AppellantCaseInvalidIncompleteReasonResponse[];
}

export interface AppellantCaseSessionValidationOutcome {
	appealId: string;
	validationOutcome: AppellantCaseValidationOutcome;
	reasons?: string | string[];
	reasonsText?: Object<string, string[]>;
}

export interface SingleAppellantCaseResponse {
	agriculturalHolding?: {
		isAgriculturalHolding: boolean | null;
		isTenant: boolean | null;
		hasToldTenants: boolean | null;
		hasOtherTenants: boolean | null;
	};
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appellantCaseId: number;
	appellant: {
		name: string | null;
		company: string | null;
	};
	applicant: {
		firstName: string | null;
		surname: string | null;
	};
	planningApplicationReference: string;
	developmentDescription?: {
		isCorrect: boolean | null;
		details: string | null;
	};
	documents: {
		appealStatement: FolderInfo;
		applicationForm: FolderInfo;
		decisionLetter: FolderInfo;
		designAndAccessStatement?: FolderInfo;
		newSupportingDocuments: FolderInfo;
	};
	hasAdvertisedAppeal: boolean | null;
	hasDesignAndAccessStatement?: boolean | null;
	hasNewPlansOrDrawings?: boolean | null;
	hasNewSupportingDocuments: boolean | null;
	hasSeparateOwnershipCertificate?: boolean | null;
	healthAndSafety: {
		details: string | null;
		hasIssues: boolean | null;
	};
	isAppellantNamedOnApplication: boolean | null;
	localPlanningDepartment: string;
	planningObligation?: {
		hasObligation: boolean | null;
		status: string | null;
	};
	procedureType?: string;
	siteOwnership: {
		areAllOwnersKnown: boolean | null;
		hasAttemptedToIdentifyOwners: boolean | null;
		hasToldOwners: boolean | null;
		isFullyOwned: boolean | null;
		isPartiallyOwned: boolean | null;
		knowsOtherLandowners: string | null;
	};
	visibility: {
		details: string | null;
		isVisible: boolean | null;
	};
	validation: AppellantCaseValidationOutcomeResponse | null;
}
