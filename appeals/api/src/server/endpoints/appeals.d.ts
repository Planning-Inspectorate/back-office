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
	addressLine1?: string;
	addressLine2?: string;
	town?: string;
	county?: string;
	postCode?: string | null;
}

interface AppealTimetable {
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
	address?: Schema.Address | null;
	appealStatus: Schema.AppealStatus[];
	appealTimetable: Schema.AppealTimetable | null;
	appealType: Schema.AppealType | null;
	appellant: Schema.Appellant | null;
	appellantCase?: Schema.AppellantCase | null;
	createdAt: Date;
	id: number;
	inspectorDecision?: { outcome: string } | null;
	linkedAppealId: number | null;
	linkedAppeals: Appeal[];
	localPlanningDepartment: string;
	lpaQuestionnaire: Schema.LPAQuestionnaire | null;
	otherAppeals: Appeal[];
	planningApplicationReference: string;
	reference: string;
	siteVisit: Schema.SiteVisit | null;
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
	isAffectingNeighbouringSites?: boolean | null;
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
	email: Schema.NeighbouringSiteContact.email;
	firstName: Schema.NeighbouringSiteContact.firstName;
	lastName: Schema.NeighbouringSiteContact.lastName;
	telephone: Schema.NeighbouringSiteContact.telephone;
}

interface SingleAppealDetailsResponse {
	agentName?: string | null;
	allocationDetails: string;
	appealId: number;
	appealReference: string;
	appealSite: AppealSite;
	appealStatus: string;
	appealTimetable: AppealTimetable;
	appealType?: string;
	appellantCaseId?: number;
	appellantName?: string;
	decision?: string;
	documentationSummary: DocumentationSummary;
	isParentAppeal: boolean | null;
	linkedAppeals: LinkedAppeal[];
	localPlanningDepartment: string;
	lpaQuestionnaireId: number | null;
	otherAppeals: LinkedAppeal[];
	planningApplicationReference: string;
	procedureType: string | null;
	siteVisit: { visitDate?: Date | null };
	startedAt: Date | null;
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
		name: string | null;
		company: string | null;
	};
	applicant: {
		firstName: string | null;
		surname: string | null;
	};
	planningApplicationReference: string;
	developmentDescription?: {
		isCorrect: boolean | null;
		details: string | null;
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

type ListedBuildingDetailsResponse = Pick<ListedBuildingDetails, 'grade' | 'description'>[];

type LookupTables = AppellantCaseIncompleteReason | AppellantCaseInvalidReason | ValidationOutcome;

type NotValidReasons = Array<number | string>;

export {
	AppealListResponse,
	AppealSite,
	AppealTimetable,
	BankHolidayFeedDivisions,
	BankHolidayFeedEvents,
	DocumentationSummary,
	DocumentInfo,
	FolderInfo,
	LinkedAppeal,
	ListedBuildingDetailsResponse,
	LookupTables,
	NotifyClient,
	NotifyTemplate,
	NotValidReasons,
	RepositoryGetAllResultItem,
	RepositoryGetByIdResultItem,
	SingleAppealDetailsResponse,
	SingleAppellantCaseResponse,
	SingleLPAQuestionnaireResponse,
	SingleSiteVisitDetailsResponse,
	TimetableDeadlineDate,
	ValidationOutcomeResponse
};
