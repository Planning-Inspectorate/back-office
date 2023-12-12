// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: address mismatch in the commented fields below

export const mapQuestionnaireIn = (appeal) => {
	return {
		extraConditions: appeal.extraConditions || '',
		receivedAt: new Date().toISOString(),
		sentAt: appeal.sentAt || new Date().toISOString(),
		communityInfrastructureLevyAdoptionDate: appeal.communityInfrastructureLevyAdoptionDate,
		developmentDescription: appeal.developmentDescription,
		doesAffectAListedBuilding: appeal.doesTheDevelopmentAffectTheSettingOfAListedBuilding || false,
		doesAffectAScheduledMonument: appeal.doesAffectAScheduledMonument || false,
		doesSiteHaveHealthAndSafetyIssues: appeal.doesSiteHaveHealthAndSafetyIssues || false,
		doesSiteRequireInspectorAccess: appeal.doesSiteRequireInspectorAccess || false,
		hasCommunityInfrastructureLevy: appeal.hasCommunityInfrastructureLevy || false,
		hasCompletedAnEnvironmentalStatement: appeal.hasCompletedAnEnvironmentalStatement || false,
		hasEmergingPlan: appeal.hasEmergingPlan || false,
		hasExtraConditions: appeal.hasExtraConditions || false,
		hasOtherAppeals: appeal.hasOtherAppeals || false,
		hasProtectedSpecies: appeal.hasProtectedSpecies || false,
		hasRepresentationsFromOtherParties: appeal.hasRepresentationsFromOtherParties || false,
		hasResponsesOrStandingAdviceToUpload: appeal.hasResponsesOrStandingAdviceToUpload || false,
		hasStatementOfCase: appeal.hasStatementOfCase || false,
		hasStatutoryConsultees: appeal.hasStatutoryConsultees || false,
		hasSupplementaryPlanningDocuments: appeal.hasSupplementaryPlanningDocuments || false,
		hasTreePreservationOrder: appeal.hasTreePreservationOrder || false,
		healthAndSafetyDetails:
			appeal.healthAndSafetyIssuesDetails || appeal.healthAndSafetyIssuesDetails,
		inCAOrrelatesToCA: appeal.inCAOrRelatesToCA || false,
		includesScreeningOption: appeal.includesScreeningOption || false,
		inquiryDays: appeal.inquiryDays,
		inspectorAccessDetails: appeal.inspectorAccessDetails,
		isCommunityInfrastructureLevyFormallyAdopted:
			appeal.isCommunityInfrastructureLevyFormallyAdopted || false,
		isDevelopmentInOrNearDesignatedSites: appeal.isDevelopmentInOrNearDesignatedSites || false,
		isEnvironmentalStatementRequired: appeal.isEnvironmentalStatementRequired || false,
		isGypsyOrTravellerSite: appeal.isGypsyOrTravellerSite || false,
		isListedBuilding: appeal.isListedBuilding || false,
		isPublicRightOfWay: appeal.isPublicRightOfWay || false,
		isSensitiveArea: appeal.isSensitiveArea || false,
		isSiteVisible: appeal.isSiteVisible || false,
		isTheSiteWithinAnAONB: appeal.isTheSiteWithinAnAONB || false,
		sensitiveAreaDetails: appeal.sensitiveAreaDetails,
		siteWithinGreenBelt: appeal.siteWithinGreenBelt || false,
		statutoryConsulteesDetails: appeal.statutoryConsulteesDetails,
		isAffectingNeighbouringSites:
			appeal.isAffectingNeighbouringSites || appeal.doPlansAffectNeighbouringSite || false,
		isConservationArea: appeal.isConservationArea || false,
		isCorrectAppealType: appeal.isCorrectAppealType || appeal.isAppealTypeAppropriate || false
	};
};

export const mapQuestionnaireOut = (appeal) => {
	return {
		extraConditions: appeal?.extraConditions || '',
		receivedAt: appeal?.receivedAt,
		sentAt: appeal?.sentAt,
		communityInfrastructureLevyAdoptionDate: appeal?.communityInfrastructureLevyAdoptionDate,
		developmentDescription: appeal?.developmentDescription,
		doesAffectAListedBuilding: appeal?.doesTheDevelopmentAffectTheSettingOfAListedBuilding || false,
		doesAffectAScheduledMonument: appeal?.doesAffectAScheduledMonument || false,
		doesSiteHaveHealthAndSafetyIssues: appeal?.doesSiteHaveHealthAndSafetyIssues || false,
		doesSiteRequireInspectorAccess: appeal?.doesSiteRequireInspectorAccess || false,
		hasCommunityInfrastructureLevy: appeal?.hasCommunityInfrastructureLevy || false,
		hasCompletedAnEnvironmentalStatement: appeal?.hasCompletedAnEnvironmentalStatement || false,
		hasEmergingPlan: appeal?.hasEmergingPlan || false,
		hasExtraConditions: appeal?.hasExtraConditions || false,
		hasOtherAppeals: appeal?.hasOtherAppeals || false,
		hasProtectedSpecies: appeal?.hasProtectedSpecies || false,
		hasRepresentationsFromOtherParties: appeal?.hasRepresentationsFromOtherParties || false,
		hasResponsesOrStandingAdviceToUpload: appeal?.hasResponsesOrStandingAdviceToUpload || false,
		hasStatementOfCase: appeal?.hasStatementOfCase || false,
		hasStatutoryConsultees: appeal?.hasStatutoryConsultees || false,
		hasSupplementaryPlanningDocuments: appeal?.hasSupplementaryPlanningDocuments || false,
		hasTreePreservationOrder: appeal?.hasTreePreservationOrder || false,
		healthAndSafetyIssuesDetails: appeal?.healthAndSafetyIssuesDetails,
		inCAOrrelatesToCA: appeal?.inCAOrRelatesToCA || false,
		includesScreeningOption: appeal?.includesScreeningOption || false,
		inquiryDays: appeal?.inquiryDays,
		//inspectorAccessDetails: appeal?.inspectorAccessDetails,
		isCommunityInfrastructureLevyFormallyAdopted:
			appeal?.isCommunityInfrastructureLevyFormallyAdopted || false,
		isDevelopmentInOrNearDesignatedSites: appeal?.isDevelopmentInOrNearDesignatedSites || false,
		isEnvironmentalStatementRequired: appeal?.isEnvironmentalStatementRequired || false,
		isGypsyOrTravellerSite: appeal?.isGypsyOrTravellerSite || false,
		isListedBuilding: appeal?.isListedBuilding || false,
		isPublicRightOfWay: appeal?.isPublicRightOfWay || false,
		isSensitiveArea: appeal?.isSensitiveArea || false,
		isSiteVisible: appeal?.isSiteVisible || false,
		isTheSiteWithinAnAONB: appeal?.isTheSiteWithinAnAONB || false,
		sensitiveAreaDetails: appeal?.sensitiveAreaDetails,
		siteWithinGreenBelt: appeal?.siteWithinGreenBelt || false,
		statutoryConsulteesDetails: appeal?.statutoryConsulteesDetails,
		doPlansAffectNeighbouringSite: appeal?.isAffectingNeighbouringSites || false,
		isConservationArea: appeal?.isConservationArea || false,
		isAppealTypeAppropriate: appeal?.isCorrectAppealType || false
	};
};
