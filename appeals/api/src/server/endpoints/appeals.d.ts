import { LPAQuestionnaire } from '#utils/db-client';
import { Schema } from 'index';

declare global {
	namespace Express {
		interface Request {
			appeal: RepositoryGetByIdResultItem;
			appealTypes: Schema.AppealType[];
			document: Schema.Document;
			notifyClient: NotifyClient;
			visitType: SiteVisitType;
			validationOutcome: ValidationOutcome;
			documentRedactionStatusIds: number[];
		}
	}
}

interface NotifyClient {
	sendEmail: (
		template: NotifyTemplate,
		recipientEmail?: string,
		personalisation: { [key: string]: string }
	) => void;
}

interface NotifyTemplate {
	id: string;
}

interface TimetableDeadlineDate {
	[key: string]: Date;
}

interface LinkedAppeal {
	appealId: number | null;
	appealReference: string;
	isParentAppeal: boolean;
	linkingDate: Date;
	appealType?: string;
	relationshipId: number;
	externalSource: boolean;
	externalAppealType?: string;
}

interface LinkableAppealSummary {
	appealId: string | undefined;
	appealReference: string | undefined;
	appealType: string | undefined;
	appealStatus: string;
	siteAddress: AppealSite;
	localPlanningDepartment: string;
	appellantName: string | undefined;
	agentName?: string | undefined | null;
	submissionDate: string;
	source: 'horizon' | 'back-office';
}

interface RelatedAppeal {
	appealId: number | null;
	appealReference: string;
	linkingDate: Date;
	relationshipId: number;
	externalSource: boolean;
}

interface AppealSite {
	addressId?: number;
	addressLine1?: string;
	addressLine2?: string;
	town?: string;
	county?: string;
	postCode?: string | null;
}

interface AppealTimetable {
	appealTimetableId: number;
	finalCommentReviewDate?: Date | null;
	lpaQuestionnaireDueDate: Date | null;
	statementReviewDate?: Date | null;
	issueDeterminationDate?: Date | null;
	completeDate?: Date | null;
}

interface RepositoryGetAllResultItem {
	address?: Schema.Address | null;
	appealStatus: Schema.AppealStatus[];
	appealType: Schema.AppealType | null;
	createdAt: Date;
	id: number;
	lpa: LPA;
	lpaQuestionnaire?: Schema.LPAQuestionnaire | null;
	reference: string;
	appealTimetable?: Schema.AppealTimetable | null;
	dueDate: Date | null;
	appellantCase?: Schema.AppellantCase | null;
}

interface RepositoryGetByIdResultItem {
	address: Schema.Address | null;
	neighbouringSites?: NeighbouringSite[] | null;
	allocation?: Schema.AppealAllocation | null;
	appealStatus: Schema.AppealStatus[];
	appealTimetable: Schema.AppealTimetable | null;
	appealType: Schema.AppealType | null;
	appellant: Schema.ServiceUser | null;
	agent: Schema.ServiceUser | null;
	appellantCase?: Schema.AppellantCase | null;
	auditTrail: Schema.AuditTrail[] | null;
	caseOfficer: User | null;
	createdAt: Date;
	dueDate: Date | null;
	id: number;
	inspector: User | null;
	transferredCaseId?: string | null;
	resubmitTypeId?: number | null;
	inspectorDecision?: Schema.InspectorDecision | null;
	linkedAppeals: Schema.AppealRelationship[] | null;
	relatedAppeals: Schema.AppealRelationship[] | null;
	lpa: LPA;
	lpaQuestionnaire: Schema.LPAQuestionnaire | null;
	planningApplicationReference: string;
	reference: string;
	resubmitTypeId?: number;
	siteVisit: Schema.SiteVisit | null;
	specialisms: Schema.AppealSpecialism[];
	startedAt: Date | null;
	updatedAt: Date | null;
}

interface BankHolidayFeedEvent {
	title: string;
	date: string;
	notes: string;
}

interface BankHolidayFeedEvents extends Array<BankHolidayFeedEvent> {}

interface SingleLPAQuestionnaireResponse {
	affectsListedBuildingDetails: ListedBuildingDetailsResponse | null;
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	communityInfrastructureLevyAdoptionDate?: Date | null;
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
		notifyingParties: FolderInfo | {};
		officersReport: FolderInfo | {};
		otherRelevantPolicies: FolderInfo | {};
		policiesFromStatutoryDevelopment: FolderInfo | {};
		pressAdvert: FolderInfo | {};
		representations: FolderInfo | {};
		responsesOrAdvice: FolderInfo | {};
		screeningDirection: FolderInfo | {};
		siteNotices: FolderInfo | {};
		supplementaryPlanningDocuments: FolderInfo | {};
		treePreservationOrder: FolderInfo | {};
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
	isAffectingNeighbouringSites?: boolean | null;
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
	lpaQuestionnaireId?: number;
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean | null;
	neighbouringSiteContacts: NeighbouringSiteContactsResponse[] | null;
	otherAppeals: string[];
	procedureType?: string;
	scheduleType?: string;
	sensitiveAreaDetails?: string | null;
	siteWithinGreenBelt?: boolean | null;
	statutoryConsulteesDetails?: string | null;
	validation: ValidationOutcomeResponse | null;
}

interface NeighbouringSiteContactsResponse {
	address: AppealSite;
	firstName: string | null;
	lastName: string | null;
}

interface SingleAppealDetailsResponse {
	allocationDetails: AppealAllocation | null;
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appealStatus: string;
	transferStatus?: {
		transferredAppealType: string;
		transferredAppealReference: string;
	};
	appealTimetable: AppealTimetable | null;
	appealType?: string;
	resubmitTypeId?: number;
	appellantCaseId: number;
	appellant?: {
		firstName: string;
		lastName: string;
		email?: string | null;
	};
	agent?: {
		firstName: string;
		lastName: string;
		email: string;
	};
	caseOfficer: string | null;
	decision: {
		folderId: number;
		outcome?: string;
		documentId?: string;
		letterDate?: Date;
		virusCheckStatus?: string;
	};
	documentationSummary: DocumentationSummary;
	healthAndSafety: {
		appellantCase: {
			details: string | null;
			hasIssues: boolean | null;
		};
		lpaQuestionnaire: {
			details: string | null;
			hasIssues: boolean | null;
		};
	};
	inspector: string | null;
	inspectorAccess: {
		appellantCase: {
			details: string | null;
			isRequired: boolean | null;
		};
		lpaQuestionnaire: {
			details: string | null;
			isRequired: boolean | null;
		};
	};
	isParentAppeal: boolean | null;
	isChildAppeal: boolean | null;
	linkedAppeals: LinkedAppeal[];
	otherAppeals: RelatedAppeal[];
	localPlanningDepartment: string;
	lpaQuestionnaireId: number | null;
	neighbouringSite: {
		contacts: NeighbouringSiteContactsResponse[] | null;
		isAffected: boolean | null;
	};
	otherAppeals: LinkedAppeal[];
	planningApplicationReference: string;
	procedureType: string | null;
	siteVisit: {
		siteVisitId: number | null;
		visitDate: Date | null;
		visitStartTime: string | null;
		visitEndTime: string | null;
		visitType: string | null;
	};
	startedAt: Date | null;
}

interface AppealAllocation {
	level: string;
	band: number;
	specialisms: string[];
}

interface SingleAppellantCaseResponse {
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
		firstName: string;
		surname: string;
	};
	applicant: {
		firstName: string | null;
		surname: string | null;
	};
	planningApplicationReference: string;
	developmentDescription?: {
		details: string | null;
		isCorrect: boolean | null;
	};
	documents: {
		appealStatement: FolderInfo | {};
		applicationForm: FolderInfo | {};
		decisionLetter: FolderInfo | {};
		designAndAccessStatement?: FolderInfo | {};
		newSupportingDocuments: FolderInfo | {};
		additionalDocuments: FolderInfo | {};
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
	validation: ValidationOutcomeResponse | null;
	visibility: {
		details: string | null;
		isVisible: boolean | null;
	};
}

interface ValidationOutcomeResponse {
	outcome: string | null;
	incompleteReasons?: IncompleteInvalidReasonsResponse[];
	invalidReasons?: IncompleteInvalidReasonsResponse[];
}

interface AppealListResponse {
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appealStatus: string;
	appealType?: string;
	createdAt: Date;
	localPlanningDepartment: string;
	lpaQuestionnaireId?: number | null;
	appealTimetable?: AppealTimetable;
	appellantCaseStatus: string;
	lpaQuestionnaireStatus: string;
	dueDate: Date | undefined | null;
	isParentAppeal: boolean | null;
	isChildAppeal: boolean | null;
}

type BankHolidayFeedDivisions =
	| 'england-and-wales'
	| 'northern-ireland'
	| 'scotland'
	| 'united-kingdom';

interface DocumentationSummaryEntry {
	status: string;
	dueDate: Date | undefined | null;
}

interface DocumentationSummary {
	appellantCase?: DocumentationSummaryEntry;
	lpaQuestionnaire?: DocumentationSummaryEntry;
}

interface FolderInfo {
	folderId: number;
	path: string;
	documents: DocumentInfo[];
}

interface LatestDocumentVersionInfo {
	published: boolean | null | undefined;
	draft: boolean;
	dateReceived: Date | null | undefined;
	redactionStatusId: number | null | undefined;
	documentGuid?: string | null | undefined;
	version?: number | null | undefined;
	lastModified?: any;
	documentType?: string | null | undefined;
	sourceSystem?: string | null | undefined;
	origin?: any;
	originalFilename?: string | null | undefined;
	fileName?: string | null | undefined;
	representative?: any;
	description?: any;
	owner?: any;
	author?: any;
	securityClassification?: any;
	mime?: string | null | undefined;
	horizonDataID?: any;
	fileMD5?: any;
	path?: any;
	virusCheckStatus?: any;
	size?: number | null | undefined;
	stage?: string | null | undefined;
	blobStorageContainer?: string | null | undefined;
	blobStoragePath?: string | null | undefined;
	dateCreated?: string | null | undefined;
	datePublished?: any;
	isDeleted?: boolean | null | undefined;
	isLateEntry?: boolean | null | undefined;
	redactionStatus?: number | null | undefined;
	redacted?: boolean | null | undefined;
	documentURI?: string | null | undefined;
}

interface DocumentInfo {
	id: string;
	name: string;
	createdAt?: string;
	folderId?: number;
	caseId?: number;
	virusCheckStatus?: any;
	latestDocumentVersion?: LatestDocumentVersionInfo;
	isLateEntry?: boolean;
}

interface SingleSiteVisitDetailsResponse {
	appealId: number;
	visitDate: Date | null;
	siteVisitId: number;
	visitEndTime: string | null;
	visitStartTime: string | null;
	visitType: string;
}

interface SingleAppellantResponse {
	appellantId: number;
	name: string;
}

interface UpdateAppellantRequest {
	name?: string;
}

interface SingleAddressResponse {
	addressId: number;
	addressLine1: string | null;
	addressLine2: string | null;
	country: string | null;
	county: string | null;
	postcode: string | null;
	town: string | null;
}

interface UpdateAddressRequest {
	addressLine1?: string;
	addressLine2?: string;
	addressCountry?: string;
	addressCounty?: string;
	postcode?: string;
	addressTown?: string;
}

interface UpdateAppellantCaseRequest {
	appellantCaseValidationOutcomeId?: number;
	applicantFirstName?: string;
	applicantSurname?: string;
	areAllOwnersKnown?: boolean;
	hasAdvertisedAppeal?: boolean;
	hasAttemptedToIdentifyOwners?: boolean;
	hasHealthAndSafetyIssues?: boolean;
	healthAndSafetyIssues?: string;
	isSiteFullyOwned?: boolean;
	isSitePartiallyOwned?: boolean;
	isSiteVisibleFromPublicRoad?: boolean;
	visibilityRestrictions?: string;
}

interface UpdateAppellantCaseValidationOutcome {
	appellantCaseId: number;
	validationOutcomeId: number;
	incompleteReasons?: IncompleteInvalidReasons;
	invalidReasons?: IncompleteInvalidReasons;
	appealId?: number;
	timetable?: TimetableDeadlineDate;
	startedAt?: Date;
}

interface UpdateLPAQuestionnaireRequest {
	appealId?: number;
	designatedSites?: number[];
	doesAffectAListedBuilding?: boolean;
	doesAffectAScheduledMonument?: boolean;
	hasCompletedAnEnvironmentalStatement?: boolean;
	hasProtectedSpecies?: boolean;
	hasTreePreservationOrder?: boolean;
	includesScreeningOption?: boolean;
	incompleteReasons?: IncompleteInvalidReasons;
	isConservationArea?: boolean;
	isEnvironmentalStatementRequired?: boolean;
	isGypsyOrTravellerSite?: boolean;
	isListedBuilding?: boolean;
	isPublicRightOfWay?: boolean;
	isSensitiveArea?: boolean;
	isTheSiteWithinAnAONB?: boolean;
	lpaQuestionnaireValidationOutcomeId?: number;
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean;
	scheduleTypeId?: number;
	sensitiveAreaDetails?: string;
	timetable?: TimetableDeadlineDate;
	validationOutcomeId?: number;
}

interface UpdateLPAQuestionaireValidationOutcomeParams {
	appeal: {
		id: number;
		appealStatus: AppealStatus[];
		appealType: AppealType;
	};
	azureAdUserId: string;
	data: {
		lpaQuestionnaireDueDate: string;
		incompleteReasons: IncompleteInvalidReasons;
	};
	lpaQuestionnaireId: number;
	validationOutcome: ValidationOutcome;
}

interface UpdateAppellantCaseValidationOutcomeParams {
	appeal: {
		appealStatus: AppealStatus[];
		appealType: AppealType;
		appellant: Appellant;
		agent: Agent;
		id: number;
		reference: string;
	};
	appellantCaseId: number;
	azureAdUserId: string;
	data: {
		appealDueDate: string;
		incompleteReasons: IncompleteInvalidReasons;
		invalidReasons: IncompleteInvalidReasons;
	};
	notifyClient: NotifyClient;
	validationOutcome: ValidationOutcome;
}

interface UpdateTimetableRequest {
	finalCommentReviewDate?: Date;
	issueDeterminationDate?: Date;
	lpaQuestionnaireDueDate?: Date;
	statementReviewDate?: Date;
}

interface UpdateAppealRequest {
	dueDate?: string;
	startedAt?: string;
	caseOfficer?: number | null;
	inspector?: number | null;
}

interface SetAppealDecisionRequest {
	documentDate: Date;
	documentGuid: string;
	version: number;
	outcome: string;
}

interface SetInvalidAppealDecisionRequest {
	outcome: string;
	invalidDecisionReason: string;
}

interface AppealRelationshipRequest {
	parentRef: string;
	parentId?: number | null;
	childRef: string;
	childId: number | null;
}

interface UsersToAssign {
	caseOfficer?: string | null;
	inspector?: string | null;
}

interface NotValidReasonOption {
	id: number;
	name: string;
	hasText: boolean;
}

interface IncompleteInvalidReasonsResponse {
	name: NotValidReasonOption;
	text?: string[];
}

interface SingleFolderResponse {
	id: number;
	path: string;
	caseId: number;
	documents: DocumentInfo[] | null;
}

interface CreateAuditTrail {
	appealId: number;
	azureAdUserId?: string;
	details: string;
}

interface CreateAuditTrailRequest {
	appealId: number;
	details: string;
	loggedAt: Date;
	userId: number;
}

type GetAuditTrailsResponse = {
	azureAdUserId: string;
	details: string;
	loggedDate: Date;
}[];

type UpdateDocumentsRequest = {
	id: string;
	receivedDate: string;
	redactionStatus: number;
	latestVersion: number;
	published: boolean;
	draft: boolean;
}[];

type UpdateDocumentsAvCheckRequest = {
	id: string;
	virusCheckStatus: string;
	version: number;
}[];

type ListedBuildingDetailsResponse = Pick<ListedBuildingDetails, 'listEntry'>[];

type LookupTables = AppellantCaseIncompleteReason | AppellantCaseInvalidReason | ValidationOutcome;

type IncompleteInvalidReasons = {
	id: number;
	text?: string[];
}[];

type AssignedUser = 'caseOfficer' | 'inspector';

export {
	AppealListResponse,
	AppealSite,
	AppealTimetable,
	AssignedUser,
	BankHolidayFeedDivisions,
	BankHolidayFeedEvents,
	CreateAuditTrail,
	CreateAuditTrailRequest,
	DocumentationSummary,
	LatestDocumentVersionInfo,
	DocumentInfo,
	FolderInfo,
	NotValidReasonOption,
	IncompleteInvalidReasons,
	IncompleteInvalidReasonsResponse,
	LinkedAppeal,
	LinkableAppealSummary,
	RelatedAppeal,
	ListedBuildingDetailsResponse,
	LookupTables,
	NeighbouringSiteContactsResponse,
	NotifyClient,
	NotifyTemplate,
	RepositoryGetAllResultItem,
	RepositoryGetByIdResultItem,
	SingleAddressResponse,
	SingleAppealDetailsResponse,
	SingleAppellantCaseResponse,
	SingleAppellantResponse,
	GetAuditTrailsResponse,
	SingleFolderResponse,
	SingleLPAQuestionnaireResponse,
	SingleSiteVisitDetailsResponse,
	TimetableDeadlineDate,
	UpdateAddressRequest,
	UpdateAppealRequest,
	UpdateAppellantCaseRequest,
	UpdateAppellantCaseValidationOutcome,
	UpdateAppellantCaseValidationOutcomeParams,
	UpdateAppellantRequest,
	UpdateDocumentsRequest,
	UpdateDocumentsAvCheckRequest,
	UpdateLPAQuestionaireValidationOutcomeParams,
	UpdateLPAQuestionnaireRequest,
	UpdateTimetableRequest,
	UsersToAssign,
	ValidationOutcomeResponse,
	SetAppealDecisionRequest,
	SetInvalidAppealDecisionRequest,
	AppealRelationshipRequest
};
