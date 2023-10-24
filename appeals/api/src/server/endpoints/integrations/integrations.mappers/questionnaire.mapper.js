// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: address mismatch in the commented fields below

export const mapQuestionnaireIn = (questionnaire) => {
	return {
		sentAt: new Date().toISOString(),
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
		hasExtraConditions: questionnaire.hasExtraConditions || false,
		extraConditions: questionnaire.extraConditions
	};
};

export const mapQuestionnaireOut = (data) => {
	return {
		questionnaireReceived: data?.sentAt,
		questionnaireDueDate: data?.appealTimeTable?.lpaQuestionnaireDueDate,
		isAppealTypeAppropriate: data?.isCorrectAppealType,
		doesTheDevelopmentAffectTheSettingOfAListedBuilding: data?.doesAffectAListedBuilding || false,
		//affectedListedBuildings,
		inCAOrRelatesToCA: data?.inCAOrrelatesToCA || false,
		siteWithinGreenBelt: data?.siteWithinGreenBelt || false,
		//howYouNotifiedPeople,
		hasRepresentationsFromOtherParties: data?.hasRepresentationsFromOtherParties || false,
		doesSiteRequireInspectorAccess: data?.doesSiteRequireInspectorAccess || false,
		doPlansAffectNeighbouringSite: data?.isAffectingNeighbouringSites || false,
		//doesSiteHaveHealthAndSafetyIssues
		//healthAndSafetyIssuesDetails: data?.healthAndSafetyDetails,
		//nearbyCaseReferences,
		hasExtraConditions: data?.hasExtraConditions || data?.extraConditions?.length,
		extraConditions: data?.extraConditions || ''
	};
};
