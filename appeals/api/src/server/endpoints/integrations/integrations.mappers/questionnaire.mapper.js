// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: address mismatch in the commented fields below

export const mapQuestionnaireIn = (questionnaire) => {
	return {
		isCorrectAppealType: questionnaire.isAppealTypeAppropriate || false,
		doesAffectAListedBuilding:
			questionnaire.doesTheDevelopmentAffectTheSettingOfAListedBuilding || false,
		//affectedListedBuildings,
		inCAOrrelatesToCA: questionnaire.inCAOrRelatesToCA || false,
		siteWithinGreenBelt: questionnaire.siteWithinGreenBelt || false,
		//howYouNotifiedPeople,
		hasRepresentationsFromOtherParties: questionnaire.hasRepresentationsFromOtherParties || false,
		doesSiteRequireInspectorAccess: questionnaire.doesSiteRequireInspectorAccess || false,
		isAffectingNeighbouringSites: questionnaire.doPlansAffectNeighbouringSite || false,
		//doesSiteHaveHealthAndSafetyIssues
		healthAndSafetyDetails: questionnaire.healthAndSafetyIssuesDetails,
		//nearbyCaseReferences,
		hasExtraConditions: questionnaire.hasExtraConditions || false,
		extraConditions: questionnaire.extraConditions
	};
};

export const mapQuestionnaireOut = (data) => {
	return {
		isAppealTypeAppropriate: data?.isCorrectAppealType,
		doesTheDevelopmentAffectTheSettingOfAListedBuilding: data?.doesAffectAListedBuilding,
		//affectedListedBuildings,
		inCAOrRelatesToCA: data?.inCAOrrelatesToCA,
		siteWithinGreenBelt: data?.siteWithinGreenBelt,
		//howYouNotifiedPeople,
		hasRepresentationsFromOtherParties: data?.hasRepresentationsFromOtherParties,
		doesSiteRequireInspectorAccess: data?.doesSiteRequireInspectorAccess,
		doPlansAffectNeighbouringSite: data?.isAffectingNeighbouringSites,
		//doesSiteHaveHealthAndSafetyIssues
		healthAndSafetyIssuesDetails: data?.healthAndSafetyDetails,
		//nearbyCaseReferences,
		hasExtraConditions: data?.hasExtraConditions,
		extraConditions: data?.extraConditions
	};
};
