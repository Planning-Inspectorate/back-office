// @ts-nocheck
// TODO: schemas (PINS data model)

export const mapAppellantCaseIn = (appeal, appellant) => {
	return {
		applicantFirstName: appellant.firstName,
		applicantSurname: appellant.lastName,
		areAllOwnersKnown: appeal.areAllOwnersKnown || false,
		hasAttemptedToIdentifyOwners: appeal.hasAttemptedToIdentifyOwners || false,
		hasDesignAndAccessStatement: appeal.hasDesignAndAccessStatement || false,
		hasHealthAndSafetyIssues: appeal.doesSiteHaveHealthAndSafetyIssues || false,
		hasNewSupportingDocuments: appeal.hasNewSupportingDocuments || false,
		hasOtherTenants: appeal.hasOtherTenants || false,
		hasPlanningObligation: appeal.hasPlanningObligation || false,
		hasSeparateOwnershipCertificate: appeal.hasSeparateOwnershipCertificate || false,
		hasToldOwners: appeal.hasToldOwners || false,
		hasToldTenants: appeal.hasToldTenants || false,
		healthAndSafetyIssues: appeal.healthAndSafetyIssuesDetails,
		isAgriculturalHolding: appeal.isAgriculturalHolding || false,
		isAgriculturalHoldingTenant: appeal.isAgriculturalHoldingTenant || false,
		isAppellantNamedOnApplication: appeal.isAppellantNamedOnApplication || false,
		isDevelopmentDescriptionStillCorrect: appeal.isDevelopmentDescriptionStillCorrect || false,
		isSiteFullyOwned: appeal.isSiteFullyOwned || false,
		isSitePartiallyOwned: appeal.isSitePartiallyOwned || false,
		isSiteVisibleFromPublicRoad: appeal.isSiteVisible || false,
		newDevelopmentDescription: appeal.newDevelopmentDescription || '',
		visibilityRestrictions: appeal.visibilityRestrictions || '',
		decision: appeal.decision || '',
		originalCaseDecisionDate: appeal.originalCaseDecisionDate || new Date().toISOString(),
		costsAppliedForIndicator: appeal.costsAppliedForIndicator || false,
		inspectorAccessDetails: appeal.inspectorAccessDetails || ''
	};
};

export const mapAppellantCaseOut = (data) => {
	return {
		applicantFirstName: data.applicantFirstName,
		applicantSurname: data.applicantSurname,
		hasAttemptedToIdentifyOwners: data.hasAttemptedToIdentifyOwners,
		hasDesignAndAccessStatement: data.hasDesignAndAccessStatement,
		doesSiteHaveHealthAndSafetyIssues: data.hasHealthAndSafetyIssues,
		hasNewSupportingDocuments: data.hasNewSupportingDocuments,
		hasOtherTenants: data.hasOtherTenants,
		hasPlanningObligation: data.hasPlanningObligation,
		hasSeparateOwnershipCertificate: data.hasSeparateOwnershipCertificate,
		hasToldOwners: data.hasToldOwners,
		hasToldTenants: data.hasToldTenants,
		healthAndSafetyIssuesDetails: data.healthAndSafetyIssues,
		isAgriculturalHolding: data.isAgriculturalHolding,
		isAgriculturalHoldingTenant: data.isAgriculturalHoldingTenant,
		isAppellantNamedOnApplication: data.isAppellantNamedOnApplication,
		isDevelopmentDescriptionStillCorrect: data.isDevelopmentDescriptionStillCorrect,
		isSiteFullyOwned: data.isSiteFullyOwned,
		isSitePartiallyOwned: data.isSitePartiallyOwned,
		isSiteVisible: data.isSiteVisibleFromPublicRoad,
		newDevelopmentDescription: data.newDevelopmentDescription,
		visibilityRestrictions: data.visibilityRestrictions,
		isListedBuilding: data.isListedBuilding || false,
		decision: data.decision || '',
		originalCaseDecisionDate: (data.originalCaseDecisionDate || new Date()).toISOString(),
		costsAppliedForIndicator: data.costsAppliedForIndicator || false,
		inspectorAccessDetails: data.inspectorAccessDetails || ''
	};
};
