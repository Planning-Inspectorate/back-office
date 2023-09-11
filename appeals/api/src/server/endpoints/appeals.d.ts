import { Schema } from 'index';

declare global {
	namespace Express {
		interface Request {
			appeal: RepositoryGetByIdResultItem;
			document: Schema.Document;
			notifyClient: NotifyClient;
			visitType: SiteVisitType;
			validationOutcome: ValidationOutcome;
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
	appealReference: string | null;
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
}

interface RepositoryGetAllResultItem {
	address?: Schema.Address | null;
	appealStatus: Schema.AppealStatus[];
	appealType: Schema.AppealType | null;
	createdAt: Date;
	id: number;
	localPlanningDepartment: string;
	reference: string;
}

interface RepositoryGetByIdResultItem {
	address: Schema.Address;
	allocation?: Schema.AppealAllocation | null;
	appealStatus: Schema.AppealStatus[];
	appealTimetable: Schema.AppealTimetable | null;
	appealType: Schema.AppealType | null;
	appellant: Schema.Appellant;
	appellantCase?: Schema.AppellantCase | null;
	caseOfficer: User | null;
	createdAt: Date;
	dueDate: Date | null;
	id: number;
	inspector: User | null;
	inspectorDecision?: { outcome: string } | null;
	linkedAppealId: number | null;
	linkedAppeals: Appeal[];
	localPlanningDepartment: string;
	lpaQuestionnaire: Schema.LPAQuestionnaire | null;
	otherAppeals: Appeal[];
	planningApplicationReference: string;
	reference: string;
	siteVisit: Schema.SiteVisit | null;
	specialisms: Schema.AppealSpecialism[];
	startedAt: Date | null;
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
		communityInfrastructureLevy: FolderInfo;
		conservationAreaMapAndGuidance: FolderInfo;
		consultationResponses: FolderInfo;
		definitiveMapAndStatement: FolderInfo;
		emergingPlans: FolderInfo;
		environmentalStatementResponses: FolderInfo;
		issuedScreeningOption: FolderInfo;
		lettersToNeighbours: FolderInfo;
		otherRelevantPolicies: FolderInfo;
		planningOfficersReport: FolderInfo;
		policiesFromStatutoryDevelopment: FolderInfo;
		pressAdvert: FolderInfo;
		relevantPartiesNotification: FolderInfo;
		representationsFromOtherParties: FolderInfo;
		responsesOrAdvice: FolderInfo;
		screeningDirection: FolderInfo;
		siteNotice: FolderInfo;
		supplementaryPlanningDocuments: FolderInfo;
		treePreservationOrder: FolderInfo;
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
	isConservationArea: boolean | null;
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
	otherAppeals: LinkedAppeal[];
	procedureType?: string;
	scheduleType?: string;
	sensitiveAreaDetails?: string | null;
	siteWithinGreenBelt?: boolean | null;
	statutoryConsulteesDetails?: string | null;
	validation: ValidationOutcomeResponse | null;
}

interface NeighbouringSiteContactsResponse {
	address: AppealSite;
}

interface SingleAppealDetailsResponse {
	agentName?: string | null;
	allocationDetails: AppealAllocation | null;
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appealStatus: string;
	appealTimetable: AppealTimetable | null;
	appealType?: string;
	appellantCaseId?: number;
	appellantName?: string;
	caseOfficer: string | null;
	decision?: string;
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
	linkedAppeals: LinkedAppeal[];
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
		visitDate: Date | null;
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
		appellantId: number;
		company: string | null;
		name: string | null;
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
	siteVisit: {
		siteVisitId: number | null;
		visitType: string | null;
	};
	validation: ValidationOutcomeResponse | null;
	visibility: {
		details: string | null;
		isVisible: boolean | null;
	};
}

interface ValidationOutcomeResponse {
	outcome: string | null;
	incompleteReasons?: string[];
	invalidReasons?: string[];
	otherNotValidReasons?: string;
}

interface AppealListResponse {
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appealStatus: string;
	appealType?: string;
	createdAt: Date;
	localPlanningDepartment: string;
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

interface DocumentInfo {
	id: string;
	name: string;
	folderId: number;
	caseId: number;
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
	agentName: string | null;
	appellantId: number;
	company: string | null;
	email: string;
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
	country?: string;
	county?: string;
	postcode?: string;
	town?: string;
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
	otherNotValidReasons?: string;
	visibilityRestrictions?: string;
}

interface UpdateAppellantCaseValidationOutcome {
	appellantCaseId: number;
	validationOutcomeId: number;
	otherNotValidReasons: string;
	incompleteReasons?: NotValidReasons;
	invalidReasons?: NotValidReasons;
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
	incompleteReasons?: NotValidReasons;
	isConservationArea?: boolean;
	isEnvironmentalStatementRequired?: boolean;
	isGypsyOrTravellerSite?: boolean;
	isListedBuilding?: boolean;
	isPublicRightOfWay?: boolean;
	isSensitiveArea?: boolean;
	isTheSiteWithinAnAONB?: boolean;
	lpaQuestionnaireValidationOutcomeId?: number;
	meetsOrExceedsThresholdOrCriteriaInColumn2?: boolean;
	otherNotValidReasons?: string;
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
	data: {
		lpaQuestionnaireDueDate: string;
		incompleteReasons: number[];
		otherNotValidReasons: string;
	};
	lpaQuestionnaireId: number;
	validationOutcome: ValidationOutcome;
}

interface UpdateAppellantCaseValidationOutcomeParams {
	appeal: {
		appealStatus: AppealStatus[];
		appealType: AppealType;
		appellant: Appellant;
		id: number;
		reference: string;
	};
	appellantCaseId: number;
	data: {
		appealDueDate: string;
		incompleteReasons: number[];
		invalidReasons: number[];
		otherNotValidReasons: string;
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
	caseOfficer?: string | null;
	inspector?: string | null;
}

interface UsersToAssign {
	caseOfficer?: string | null;
	inspector?: string | null;
}

type ListedBuildingDetailsResponse = Pick<ListedBuildingDetails, 'listEntry'>[];

type LookupTables = AppellantCaseIncompleteReason | AppellantCaseInvalidReason | ValidationOutcome;

type NotValidReasons = Array<number | string>;

type AssignedUser = 'caseOfficer' | 'inspector';

export {
	AppealListResponse,
	AppealSite,
	AppealTimetable,
	AssignedUser,
	BankHolidayFeedDivisions,
	BankHolidayFeedEvents,
	DocumentationSummary,
	DocumentInfo,
	FolderInfo,
	LinkedAppeal,
	ListedBuildingDetailsResponse,
	LookupTables,
	NeighbouringSiteContactsResponse,
	NotifyClient,
	NotifyTemplate,
	NotValidReasons,
	RepositoryGetAllResultItem,
	RepositoryGetByIdResultItem,
	SingleAddressResponse,
	SingleAppealDetailsResponse,
	SingleAppellantCaseResponse,
	SingleAppellantResponse,
	SingleLPAQuestionnaireResponse,
	SingleSiteVisitDetailsResponse,
	TimetableDeadlineDate,
	UpdateAddressRequest,
	UpdateAppealRequest,
	UpdateAppellantCaseRequest,
	UpdateAppellantCaseValidationOutcome,
	UpdateAppellantCaseValidationOutcomeParams,
	UpdateAppellantRequest,
	UpdateLPAQuestionaireValidationOutcomeParams,
	UpdateLPAQuestionnaireRequest,
	UpdateTimetableRequest,
	UsersToAssign,
	ValidationOutcomeResponse
};
