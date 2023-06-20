import { AppealSite } from '@pins/appeals';

// TODO: BOAT-245
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
		appealStatement: string;
		applicationForm: string;
		decisionLetter: string;
		designAndAccessStatement?: string;
		newSupportingDocuments: string[];
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
}
