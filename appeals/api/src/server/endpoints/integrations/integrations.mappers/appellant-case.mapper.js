// @ts-nocheck
// TODO: schemas (PINS data model)

export const mapAppellantCaseIn = (appeal, appellant) => {
	return {
		applicantFirstName: appellant.firstName,
		applicantSurname: appellant.lastName,
		areAllOwnersKnown: appeal.areAllOwnersKnown || false,
		hasAdvertisedAppeal: appeal.hasAdvertisedAppeal || false,
		hasAttemptedToIdentifyOwners: appeal.hasAttemptedToIdentifyOwners || false,
		hasDesignAndAccessStatement: appeal.hasDesignAndAccessStatement || false,
		hasHealthAndSafetyIssues: appeal.doesSiteHaveHealthAndSafetyIssues || false,
		hasNewPlansOrDrawings: appeal.hasNewPlansOrDrawings || false,
		hasNewSupportingDocuments: appeal.hasNewSupportingDocuments || false,
		hasOtherTenants: appeal.hasOtherTenants || false,
		hasPlanningObligation: appeal.hasPlanningObligation || false,
		hasSeparateOwnershipCertificate: appeal.hasSeparateOwnershipCertificate || false,
		hasSubmittedDesignAndAccessStatement: appeal.hasSubmittedDesignAndAccessStatement || false,
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
		costsAppliedForIndicator: appeal.costsAppliedForIndicator || false,
		decision: appeal.decision || '',
		inspectorAccessDetails: appeal.inspectorAccessDetails || '',
		originalCaseDecisionDate: appeal.originalCaseDecisionDate || new Date().toISOString()
	};
};

export const mapAppellantCaseOut = (appeal) => {
	return {
		applicantFirstName: appeal.applicantFirstName,
		applicantSurname: appeal.applicantSurname,
		areAllOwnersKnown: appeal.areAllOwnersKnown || false,
		hasAdvertisedAppeal: appeal.hasAdvertisedAppeal || false,
		hasAttemptedToIdentifyOwners: appeal.hasAttemptedToIdentifyOwners || false,
		hasDesignAndAccessStatement: appeal.hasDesignAndAccessStatement || false,
		hasHealthAndSafetyIssues: appeal.doesSiteHaveHealthAndSafetyIssues || false,
		hasNewPlansOrDrawings: appeal.hasNewPlansOrDrawings || false,
		hasNewSupportingDocuments: appeal.hasNewSupportingDocuments || false,
		hasOtherTenants: appeal.hasOtherTenants || false,
		hasPlanningObligation: appeal.hasPlanningObligation || false,
		hasSeparateOwnershipCertificate: appeal.hasSeparateOwnershipCertificate || false,
		hasSubmittedDesignAndAccessStatement: appeal.hasSubmittedDesignAndAccessStatement || false,
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
		costsAppliedForIndicator: appeal.costsAppliedForIndicator || false,
		decision: appeal.decision || '',
		inspectorAccessDetails: appeal.inspectorAccessDetails || '',
		originalCaseDecisionDate: appeal.originalCaseDecisionDate
			? appeal.originalCaseDecisionDate.toISOString()
			: new Date().toISOString()
	};
};
