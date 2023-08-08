import { Address, AppealSite } from '@pins/appeals';

export interface Appeal {
	agentName: string;
	allocationDetails: string;
	appealId: number;
	appealReference: string;
	appealSite: Address;
	appealStatus: string;
	appealType: string;
	appellantName: string;
	appellantCaseId: number;
	procedureType: string;
	caseOfficer?: Contact;
	inspector?: Contact;
	developmentType: string;
	decision?: string;
	eventType: string;
	lpaQuestionnaireId?: number | null;
	linkedAppeals: AppealLink[] | [];
	localPlanningDepartment: string;
	otherAppeals: AppealLink[] | [];
	planningApplicationReference: string;
	documentationSummary?: AppealDocumentationSummary;
	startedAt: string | null;
	appealTimetable: AppealTimetable;
	siteVisit: AppealSiteVisit;
	inspectorAccess: AppealInspectorAccess;
	neighbouringSite: AppealNeighbouringSite;
	healthAndSafety: AppealHealthAndSafety;
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
};

export type AppealSiteVisit = {
	visitDate: string;
	visitType: string;
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

export interface SingleLPAQuestionnaireResponse {
	affectsListedBuildingDetails: ListedBuildingDetailsResponse | null;
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	communityInfrastructureLevyAdoptionDate?: Date | null;
	designatedSites?: DesignatedSiteDetails[] | null;
	developmentDescription?: string | null;
	documents: {
		communityInfrastructureLevy: string;
		conservationAreaMapAndGuidance: string;
		consultationResponses: string;
		definitiveMapAndStatement: string;
		emergingPlans: string[];
		environmentalStatementResponses: string;
		issuedScreeningOption: string;
		lettersToNeighbours: string;
		otherRelevantPolicies: string[];
		planningOfficersReport: string;
		policiesFromStatutoryDevelopment: string[];
		pressAdvert: string;
		representationsFromOtherParties: string[];
		responsesOrAdvice: string[];
		screeningDirection: string;
		siteNotice: string;
		supplementaryPlanningDocuments: string[];
		treePreservationOrder: string;
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
	isCommunityInfrastructureLevyFormallyAdopted?: boolean | null;
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
	lpaQuestionnaireId?: number;
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean | null;
	otherAppeals: LinkedAppeal[];
	procedureType?: string;
	scheduleType?: string;
	sensitiveAreaDetails?: string;
	siteWithinGreenBelt?: boolean | null;
	statutoryConsulteesDetails?: string;
}
