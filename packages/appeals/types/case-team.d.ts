import { Address, AppealDocument } from './appeal';

export interface Appeal {
	AppealId: number;
	AppealReference: string;
	AppealSite: Address;
	AppealSiteNearConservationArea: boolean;
	Documents: AppealDocument[];
	ListedBuildingDesc: string;
	LocalPlanningDepartment: string;
	PlanningApplicationreference: string;
	WouldDevelopmentAffectSettingOfListedBuilding: boolean;
	reviewQuestionnaire?: Questionnaire;
	acceptingStatements: boolean;
	acceptingFinalComments: boolean;
	canUploadFinalCommentsUntil?: string;
	canUploadStatementsUntil?: string;
}

export interface AppealSummary {
	AppealId: number;
}

export interface Questionnaire {
	complete: boolean;
	applicationPlanningOfficersReportMissingOrIncorrect: boolean;
	applicationPlansToReachDecisionMissingOrIncorrect: boolean;
	applicationPlansToReachDecisionMissingOrIncorrectDescription?: string;
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: boolean;
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription?: string;
	policiesOtherRelevantPoliciesMissingOrIncorrect: boolean;
	policiesOtherRelevantPoliciesMissingOrIncorrectDescription?: string;
	policiesSupplementaryPlanningDocumentsMissingOrIncorrect: boolean;
	policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription?: string;
	siteConservationAreaMapAndGuidanceMissingOrIncorrect: boolean;
	siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription?: string;
	siteListedBuildingDescriptionMissingOrIncorrect: boolean;
	siteListedBuildingDescriptionMissingOrIncorrectDescription?: string;
	thirdPartyApplicationNotificationMissingOrIncorrect: boolean;
	thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: boolean;
	thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: boolean;
	thirdPartyApplicationPublicityMissingOrIncorrect: boolean;
	thirdPartyRepresentationsMissingOrIncorrect: boolean;
	thirdPartyRepresentationsMissingOrIncorrectDescription?: string;
	thirdPartyAppealNotificationMissingOrIncorrect: boolean;
	thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: boolean;
	thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: boolean;
}
