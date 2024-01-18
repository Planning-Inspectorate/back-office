import { Address } from '@pins/appeals';
import { LPAQuestionnaireValidationOutcomeResponse } from './lpa-questionnaire/lpa-questionnaire.types';
import {
	SingleAppealDetailsResponse,
	AppealTimetable,
	DocumentationSummaryEntry,
	DocumentationSummary,
	FolderInfo
} from '@pins/appeals.api/src/server/endpoints/appeals';
import { SiteVisit } from '@pins/appeals.api/src/database/schema';

export interface AppealHealthAndSafetyEntry {
	details: string | null;
	hasIssues: boolean | null;
}

export interface AppealHealthAndSafety {
	appellantCase: AppealHealthAndSafetyEntry;
	lpaQuestionnaire: AppealHealthAndSafetyEntry;
}

export interface AppealAllocationDetails {
	level: string;
	band: number;
	specialisms: string[];
}

export type Contact = {
	name: string;
	email: string;
	phone: string;
};

export type AppealLink = {
	appealId: number;
	appealReference: string;
};

export type AppealTimetable = {
	finalCommentReviewDate: string | null;
	lpaQuestionnaireDueDate: string | null;
	statementReviewDate: string | null;
	issueDeterminationDate: string | null;
	completeDate: string | null;
};

export type AppealSiteVisit = {
	siteVisitId: number | null;
	visitType: string | null;
	visitDate: string | null;
	visitStartTime?: string | null;
	visitEndTime?: string | null;
};

export type DocumentStatus = 'received' | 'not_received' | 'incomplete' | 'invalid' | 'valid';

export type AppealDocumentationSummaryItem = {
	status: DocumentStatus;
	dueDate: string | null;
};

export type AppealDocumentationSummary = {
	appellantCase: AppealDocumentationSummaryItem;
	lpaQuestionnaire: AppealDocumentationSummaryItem;
};

export type AppealInspectorAccessEntry = {
	details: string | null;
	isRequired: boolean | null;
};

export type AppealInspectorAccess = {
	appellantCase: AppealInspectorAccessEntry;
	lpaQuestionnaire: AppealInspectorAccessEntry;
};

export type AppealHealthAndSafetyEntry = {
	details: string | null;
	hasIssues: boolean | null;
};

export type AppealHealthAndSafety = {
	appellantCase: AppealHealthAndSafetyEntry;
	lpaQuestionnaire: AppealHealthAndSafetyEntry;
};

export type AppealNeighbouringSiteContact = {
	address: Address;
	contactId: number;
	email: string;
	firstName: string;
	lastName: string;
	telephone: string;
};

export type AppealNeighbouringSite = {
	contacts: AppealNeighbouringSiteContact[];
	isAffected: boolean;
};

export interface LpaQuestionnaire {
	constraints: LpaQuestionnaireFullAppealConstraints;
	environmentalImpact: LpaQuestionnaireFullAppealEnvironmentalImpact;
	notifyingPeople: LpaQuestionnaireFullAppealNotifyingPeople;
	consultationResponse: LpaQuestionnaireFullAppealConsultationResponses;
	planningOfficerReportAndPolicies: LpaQuestionnaireFullAppealReportAndPolicies;
	siteAccess: LpaQuestionnaireFullAppealSiteAccess;
	appealProcess: LpaQuestionnaireFullAppealProcess;
}

export type LpaQuestionnaireFullAppealConstraints = {
	isListedBuilding: boolean;
	// listedBuilding: Yes
	listedBuildingDetails?: ListedBuildingDetail;
	affectsListedBuilding: boolean;
	// affectsListedBuilding: Yes
	affectsListedBuildingDetails?: ListedBuildingDetail;
	affectsScheduledMonument: boolean;
	inConservationArea: ConservationAreaOption;
	// inConservationArea: In a conservation area || Next to a conservation area
	conservationAreaMapAndGuidanceDocument?: AppealDocument;
	protectedSpecies: boolean;
	greenBelt: boolean;
	areaOfOutstandingBeauty: boolean;
	designatedSites: DesignatedSite[] | string[];
	treePreservationOrder: boolean;
	// treePreservationOrder: Yes
	treePreservationOrderDocument?: AppealDocument;
	gypsyOrTraveller: boolean;
	publicRightOfWay: boolean;
	// publicRightOfWay: Yes
	definitiveMapAndStatementDocument?: AppealDocument;
};

export type LpaQuestionnaireFullAppealEnvironmentalImpact = {
	scheduleType: ScheduleTypeOption;
	// ScheduleType 1 or environmentStatementNeeded: Yes
	environmentalStatementComplete?:
		| 'Yes, we did the environmental statement'
		| 'No, we have a negative screening direction';
	// Yes
	environmentStatementDocument?: AppealDocument;
	// No
	screeningDirectionDocument?: AppealDocument;
	// No or schedule 2
	issuedScreeningOpinion?: boolean;
	// Yes
	screeningOpinionDocument?: AppealDocument;
	environmentStatementNeeded?: boolean;
	// No -> No more questions
	// No
	applicantDidEnvironmentalStatement?: boolean;
	// No -> No more questions
	// Yes or environmentalStatementComplete: Yes
	responsesForEnvironmentalStatement?: AppealDocument;
	siteNotice?: AppealDocument;
	// ScheduleType 2
	developmentDescription?: DevelopmentDescription;
	affectSensitiveArea?: {
		answer: boolean;
		// Yes
		details?: string; //free form
	};
	meetsOrExceedsColumn2?: boolean;
};

export type LpaQuestionnaireFullAppealNotifyingPeople = {
	notificationMethod: NotificationMethodOptions;
	siteNotice?: AppealDocument;
	letterSentToNeighbours?: AppealDocument;
	pressAdvert?: AppealDocument;
};

export type LpaQuestionnaireFullAppealConsultationResponses = {
	statutoryConsultees: {
		answer: boolean;
		details?: string;
	};
	responsesOrAdviceToUpload: boolean;
	responsesOrAdviceDocuments?: AppealDocument[];
	representationsFromOtherParties: boolean;
	representationsFromOtherPartiesDocuments?: AppealDocument[];
};

export type LpaQuestionnaireFullAppealReportAndPolicies = {
	officerReportDocument: AppealDocument;
	policiesDocuments: AppealDocument[];
	emergingPlan: boolean;
	//Yes
	emergingPlanDocuments?: AppealDocument[];
	otherPoliciesDocuments: AppealDocument[];
	hasSupplimentaryPlanningDocuments: boolean;
	//Yes
	supplimentaryPlanningDocuments?: AppealDocument[];
	communityInfrastructureLevy: boolean;
	//Yes
	communityInfrastructureLevyDocument?: AppealDocument;
	communityInfrastructureLevyAdopted?: boolean;
	communityInfrastructureLevyToBeAdoptedDate?: string;
};

export type LpaQuestionnaireFullAppealSiteAccess = {
	siteVisibility: boolean;
	inspectorAccess: {
		answer: boolean;
		details: string;
	};
	healthAndSafetyIssues: {
		answer: boolean;
		details?: string;
	};
};

export type LpaQuestionnaireFullAppealProcess = {
	procedureType: {
		type: ProcedureType;
		inquiryDays?: number;
	};
	otherAppeals: {
		answer: boolean;
		appealReferences?: string; // free form: more than one seperated by comma -> maybe converted to array??
	};
	statementOfCase: boolean;
};

export type ProcedureType = 'Written representations' | 'Hearing' | 'Inquiry';

export type NotificationMethodOptions =
	| 'A site notice'
	| 'Letter/email to interested parties'
	| 'A press advert';

export type DevelopmentDescription =
	| 'Agriculture and aquaculture'
	| 'Changes and extensions'
	| 'Chemical industry (unless included in Schedule 1)'
	| 'Energy industry'
	| 'Extractive industry'
	| 'Food industry'
	| 'Infrastructure projects'
	| 'Mineral industry'
	| 'Other projects'
	| 'Production and processing of metals'
	| 'Rubber industry'
	| 'Textile, leather, wood and paper industries'
	| 'Tourism and leisure';

export type ListedBuildingDetail = {
	grade: ListedBuildingGrade;
	description: string;
};

export type ListedBuildingGrade = 'Grade I';

export interface AppealDocument {
	Type: DocumentType;
	Filename: string;
	URL: string;
}

export type DocumentType =
	| 'plans used to reach decision'
	| 'statutory development plan policy'
	| 'other relevant policy'
	| 'supplementary planning document'
	| 'conservation area guidance'
	| 'listed building description'
	| 'application notification'
	| 'application publicity'
	| 'representation'
	| 'planning officers report'
	| 'appeal notification'
	| 'appeal statement'
	| 'decision letter'
	| 'planning application form'
	| 'supporting document';

export type ConservationAreaOption =
	| 'In a conservation area'
	| 'Next to a conservation area'
	| 'No, it is not in or next to a conservation area';

export type DesignatedSite =
	| 'SSSI (site of special scientific interest)'
	| 'cSAC (candidate special area of conservation)'
	| 'SAC (special area of conservation)'
	| 'pSPA (potential special protection area)'
	| 'SPA Ramsar (Ramsar special protection area)'
	| '	No, it is not in, near or likely to affect any designated sites';

export type ScheduleTypeOption = 'Yes, schedule 1' | 'Yes, schedule 2' | 'No';

interface NeighbouringSiteContactsResponse {
	address: Address;
}

export interface SingleLPAQuestionnaireResponse {
	affectsListedBuildingDetails: ListedBuildingDetailsResponse | null;
	appealId: number;
	appealReference: string;
	appealSite: Address;
	communityInfrastructureLevyAdoptionDate?: string | null;
	designatedSites?: DesignatedSiteDetails[] | null;
	developmentDescription?: string | null;
	documents: {
		communityInfrastructureLevy: FolderInfo | {};
		conservationAreaMap: FolderInfo | {};
		consultationResponses: FolderInfo | {};
		definitiveMapAndStatement: FolderInfo | {};
		emergingPlans: FolderInfo | {};
		environmentalStatementResponses: FolderInfo | {};
		issuedScreeningOption: FolderInfo | {};
		lettersToNeighbours: FolderInfo | {};
		otherRelevantPolicies: FolderInfo | {};
		officersReport: FolderInfo | {};
		policiesFromStatutoryDevelopment: FolderInfo | {};
		pressAdvert: FolderInfo | {};
		relevantPartiesNotification: FolderInfo | {};
		representations: FolderInfo | {};
		responsesOrAdvice: FolderInfo | {};
		screeningDirection: FolderInfo | {};
		siteNotices: FolderInfo | {};
		supplementaryPlanningDocuments: FolderInfo | {};
		treePreservationOrder: FolderInfo | {};
		notifyingParties: FolderInfo | {};
		additionalDocuments: FolderInfo | {};
	};
	doesAffectAListedBuilding?: boolean | null;
	doesAffectAScheduledMonument?: boolean | null;
	doesSiteHaveHealthAndSafetyIssues?: boolean | null;
	doesSiteRequireInspectorAccess?: boolean | null;
	extraConditions?: string | null;
	hasCommunityInfrastructureLevy?: boolean | null;
	hasCompletedAnEnvironmentalStatement?: boolean | null;
	hasEmergingPlan?: boolean | null;
	hasExtraConditions?: boolean | null;
	hasOtherAppeals?: boolean | null;
	hasProtectedSpecies?: boolean | null;
	hasRepresentationsFromOtherParties?: boolean | null;
	hasResponsesOrStandingAdviceToUpload?: boolean | null;
	hasStatementOfCase?: boolean | null;
	hasStatutoryConsultees?: boolean | null;
	hasSupplementaryPlanningDocuments?: boolean | null;
	hasTreePreservationOrder?: boolean | null;
	healthAndSafetyDetails?: string | null;
	inCAOrrelatesToCA?: boolean | null;
	includesScreeningOption?: boolean | null;
	inquiryDays?: number | null;
	inspectorAccessDetails?: string | null;
	isAffectingNeighbouringSites: boolean | null;
	isCommunityInfrastructureLevyFormallyAdopted?: boolean | null;
	isConservationArea?: boolean | null;
	isCorrectAppealType: boolean | null;
	isEnvironmentalStatementRequired?: boolean | null;
	isGypsyOrTravellerSite?: boolean | null;
	isListedBuilding?: boolean | null;
	isPublicRightOfWay?: boolean | null;
	isSensitiveArea?: boolean | null;
	isSiteVisible?: boolean | null;
	isTheSiteWithinAnAONB?: boolean | null;
	listedBuildingDetails: ListedBuildingDetailsResponse | null;
	localPlanningDepartment: string | null;
	lpaNotificationMethods?: LPANotificationMethodDetails[] | null;
	lpaQuestionnaireId: number;
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean | null;
	neighbouringSiteContacts: NeighbouringSiteContactsResponse[] | null;
	otherAppeals: LinkedAppeal[];
	procedureType?: string;
	scheduleType?: string;
	sensitiveAreaDetails?: string;
	siteWithinGreenBelt?: boolean | null;
	statutoryConsulteesDetails?: string;
	validation: LPAQuestionnaireValidationOutcomeResponse | null;
}

export type BodyValidationOutcome = Object<string, string | string[]>;

// The following types are required because the corresponding types defined in the API specify Date fields, but the dates are formatted as strings in the API response data

export interface WebAppealTimetable extends AppealTimetable {
	finalCommentReviewDate?: string | null;
	lpaQuestionnaireDueDate: string | null;
	statementReviewDate?: string | null;
	issueDeterminationDate?: string | null;
	completeDate?: string | null;
}

export interface WebSiteVisit extends SiteVisit {
	visitDate: string | null;
	siteVisitId: number | null;
	visitEndTime: string | null;
	visitStartTime: string | null;
	visitType: string | null;
}

export interface WebDocumentationSummaryEntry extends DocumentationSummaryEntry {
	status: string;
	dueDate: string | undefined | null;
}

export interface WebDocumentationSummary extends DocumentationSummary {
	appellantCase?: WebDocumentationSummaryEntry;
	lpaQuestionnaire?: WebDocumentationSummaryEntry;
}

export interface WebAppeal extends SingleAppealDetailsResponse {
	appealTimetable: WebAppealTimetable | null;
	siteVisit: WebSiteVisit | null;
	startedAt: string | null;
	documentationSummary: WebDocumentationSummary;
}
