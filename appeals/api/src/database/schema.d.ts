import * as schema from '#utils/db-client';
import { APPEAL_TYPE_SHORTHAND_FPA, APPEAL_TYPE_SHORTHAND_HAS } from '#endpoints/constants';

export {
	Address,
	AppealRelationship,
	AppellantCase,
	AppellantCaseIncompleteReason,
	AppellantCaseInvalidReason,
	AppellantCaseIncompleteReasonOnAppellantCase,
	AppellantCaseInvalidReasonOnAppellantCase,
	DocumentRedactionStatus,
	DocumentVersion,
	KnowledgeOfOtherLandowners,
	LPA,
	LPAQuestionnaire,
	NeighbouringSite,
	NeighbouringSiteContact,
	ReviewQuestionnaire,
	LPAQuestionnaireIncompleteReason,
	LPAQuestionnaireValidationOutcome,
	AppellantCaseValidationOutcome,
	PlanningObligationStatus,
	SiteVisitType,
	User,
	ServiceUser
} from '#utils/db-client';

export interface Appeal extends schema.Appeal {
	address?: schema.Address;
	appellantCase?: schema.AppellantCase;
	appealStatus: AppealStatus[];
	appealTimetable?: AppealTimetable;
	appealType: AppealType;
	appellant?: schema.ServiceUser;
	agent?: schema.ServiceUser;
	allocation?: schema.AppealAllocation;
	specialisms: AppealSpecialism[];
	createdAt: Date;
	documents?: Document[];
	folders?: Folder[];
	dueDate?: Date;
	id: number;
	inspectorDecision?: InspectorDecision;
	lpa: schema.LPA;
	lpaQuestionnaire?: schema.LPAQuestionnaire;
	planningApplicationReference: string;
	reference: string;
	reviewQuestionnaire?: schema.ReviewQuestionnaire[];
	siteVisit?: SiteVisit;
	startedAt: Date;
	validationDecision?: ValidationDecision[];
}

export interface AppellantCase extends schema.AppellantCase {
	knowledgeOfOtherLandowners?: PlanningObligationStatus | null;
	planningObligationStatus?: PlanningObligationStatus | null;
	appellantCaseValidationOutcome: AppellantCaseValidationOutcome | null;
	appellantCaseIncompleteReasonsOnAppellantCases: AppellantCaseIncompleteReasonOnAppellantCase[];
	appellantCaseInvalidReasonsOnAppellantCases: AppellantCaseInvalidReasonOnAppellantCase[];
}

export interface Folder extends schema.Folder {
	documents?: schema.Document[] | null;
}

export interface Document extends schema.Document {
	latestDocumentVersion?: schema.DocumentVersion | null;
	documentVersion?: schema.DocumentVersion[] | null;
}

export interface DocumentVersions extends schema.Document {
	documentVersions?: schema.DocumentVersion[] | null;
}

export interface AppealStatus extends schema.AppealStatus {
	status: string;
	subStateMachineName: string | null;
}

export interface AppealType extends schema.AppealType {
	shorthand: AppealTypeCode;
	type: string;
}

export interface AppealTimetable extends schema.AppealTimetable {
	finalCommentReviewDate: Date | null;
	issueDeterminationDate: Date | null;
	lpaQuestionnaireDueDate: Date | null;
	statementReviewDate: Date | null;
}

export type AppealTypeCode = APPEAL_TYPE_SHORTHAND_FPA | APPEAL_TYPE_SHORTHAND_HAS;

export type AppealStatusMachineType =
	| 'lpaQuestionnaireAndInspectorPickup'
	| 'statementsAndFinalComments';

export type AppealStatusType =
	| 'received_appeal'
	| 'awaiting_validation_info'
	| 'valid_appeal'
	| 'invalid_appeal'
	| 'awaiting_lpa_questionnaire'
	| 'awaiting_lpa_questionnaire_and_statements'
	| 'received_lpa_questionnaire'
	| 'overdue_lpa_questionnaire'
	| 'incomplete_lpa_questionnaire'
	| 'available_for_statements'
	| 'available_for_final_comments'
	| 'available_for_inspector_pickup'
	| 'complete_lpa_questionnaire'
	| 'site_visit_not_yet_booked'
	| 'site_visit_booked'
	| 'decision_due'
	| 'appeal_decided';

export type AppealDocumentType =
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

export type ValidationDecisionType = 'complete' | 'invalid' | 'incomplete';

export interface ValidValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'complete';
	descriptionOfDevelopment: string;
}

export interface InvalidValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'invalid';
	outOfTime: boolean;
	noRightOfAppeal: boolean;
	notAppealable: boolean;
	lPADeemedInvalid: boolean;
	otherReasons: string | null;
}

export interface NeighbouringSite extends schema.NeighbouringSite {
	address: schema.Address;
}

export interface IncompleteValidationDecision {
	id: number;
	appealId: number;
	createdAt: Date;
	decision: 'incomplete';
	namesDoNotMatch: boolean;
	sensitiveInfo: boolean;
	missingApplicationForm: boolean;
	missingDecisionNotice: boolean;
	missingGroundsForAppeal: boolean;
	missingSupportingDocuments: boolean;
	inflammatoryComments: boolean;
	openedInError: boolean;
	wrongAppealTypeUsed: boolean;
	otherReasons: string | null;
}

export type ValidationDecision =
	| ValidValidationDecision
	| InvalidValidationDecision
	| IncompleteValidationDecision;

export interface SiteVisit extends schema.SiteVisit {
	siteVisitType?: SiteVisitType;
}

export interface InspectorDecision extends schema.InspectorDecision {
	outcome: InspectorDecisionOutcomeType;
}

export type InspectorDecisionOutcomeType = 'allowed' | 'dismissed' | 'split decision';

export interface DocumentDetails {
	documentId: number | null;
	sourceSystem: string;
	documentGuid: string | null;
	fileName: String;
	originalFilename: string;
	version;
	datePublished: number | null;
	documentURI: string | null;
	blobStorageContainer: string;
	author: string;
	dateCreated: number | null;
	publishedStatus: string;
	redactedStatus: string;
	size: number;
	mime: string;
	description: string | null;
	version: number | null;
	representative: string | null;
	documentType: string | null;
	caseRef: string | null;
}

export interface LPAQuestionnaire extends schema.LPAQuestionnaire {
	communityInfrastructureLevyAdoptionDate: Date | null;
	designatedSites: DesignatedSite[] | null;
	developmentDescription: string | null;
	doesAffectAListedBuilding: boolean | null;
	doesAffectAScheduledMonument: boolean | null;
	doesSiteHaveHealthAndSafetyIssues: boolean | null;
	doesSiteRequireInspectorAccess: boolean | null;
	extraConditions: string | null;
	hasCommunityInfrastructureLevy: boolean | null;
	hasCompletedAnEnvironmentalStatement: boolean | null;
	hasEmergingPlan: boolean | null;
	hasExtraConditions: boolean | null;
	hasOtherAppeals: boolean | null;
	hasProtectedSpecies: boolean | null;
	hasRepresentationsFromOtherParties: boolean | null;
	hasResponsesOrStandingAdviceToUpload: boolean | null;
	hasStatementOfCase: boolean | null;
	hasStatutoryConsultees: boolean | null;
	hasSupplementaryPlanningDocuments: boolean | null;
	hasTreePreservationOrder: boolean | null;
	healthAndSafetyDetails: string | null;
	id: number;
	inCAOrrelatesToCA: boolean | null;
	includesScreeningOption: boolean | null;
	inquiryDays: number | null;
	inspectorAccessDetails: string | null;
	isCommunityInfrastructureLevyFormallyAdopted: boolean | null;
	isCorrectAppealType: boolean | null;
	isEnvironmentalStatementRequired: boolean | null;
	isGypsyOrTravellerSite: boolean | null;
	isListedBuilding: boolean | null;
	isPublicRightOfWay: boolean | null;
	isSensitiveArea: boolean | null;
	isSiteVisible: boolean | null;
	isTheSiteWithinAnAONB: boolean | null;
	listedBuildingDetails: ListedBuildingDetails[] | null;
	lpaNotificationMethods: LPANotificationMethod[] | null;
	lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire:
		| LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire[]
		| null;
	lpaQuestionnaireValidationOutcome: LPAQuestionnaireValidationOutcome | null;
	meetsOrExceedsThresholdOrCriteriaInColumn2: boolean | null;
	neighbouringSiteContact: NeighbouringSiteContact[] | null;
	procedureType: ProcedureType | null;
	scheduleType: ScheduleType | null;
	sensitiveAreaDetails: string | null;
	siteWithinGreenBelt: boolean | null;
	statutoryConsulteesDetails?: string | null;
}

export interface Specialism {
	name: string;
}

export interface AppealSpecialism {
	specialism: Specialism;
}

export interface ProcedureType {
	name: string;
}

export interface ScheduleType {
	name: string;
}

export interface DesignatedSiteDetails {
	name: string;
	description: string;
}

export interface DesignatedSite {
	designatedSite: DesignatedSiteDetails;
}

export interface LPANotificationMethodDetails {
	name: string;
}

export interface LPANotificationMethod {
	lpaNotificationMethod: LPANotificationMethodDetails;
}

export interface ListedBuildingDetails extends schema.ListedBuildingDetails {
	listEntry: string | null;
	affectsListedBuilding: boolean;
}

export interface LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire
	extends schema.LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire {
	lpaQuestionnaireIncompleteReason: LPAQuestionnaireIncompleteReason;
	lpaQuestionnaireIncompleteReasonText: LPAQuestionnaireIncompleteReasonText[];
}

export interface NeighbouringSiteContact extends schema.NeighbouringSiteContact {
	address: AppealSite;
}

export interface AppellantCaseIncompleteReasonOnAppellantCase
	extends schema.AppellantCaseIncompleteReasonOnAppellantCase {
	appellantCaseIncompleteReason: AppellantCaseIncompleteReason;
	appellantCaseIncompleteReasonText: AppellantCaseIncompleteReasonText[];
}

export interface AppellantCaseInvalidReasonOnAppellantCase
	extends schema.AppellantCaseInvalidReasonOnAppellantCase {
	appellantCaseInvalidReason: AppellantCaseInvalidReason;
	appellantCaseInvalidReasonText: AppellantCaseInvalidReasonText[];
}

export interface AuditTrail extends schema.AuditTrail {
	user: User;
}
