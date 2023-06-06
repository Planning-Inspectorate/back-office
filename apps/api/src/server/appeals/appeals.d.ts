declare global {
	namespace Express {
		interface Request {
			appeal: RepositoryGetByIdResultItem;
		}
	}
}

interface TimetableDeadline {
	daysFromStartDate: number;
}

interface TimetableConfig {
	timetable: {
		[key: string]: {
			finalCommentReviewDate?: TimetableDeadline;
			lpaQuestionnaireDueDate: TimetableDeadline;
			statementReviewDate?: TimetableDeadline;
		};
	};
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
	address?: import('@pins/api').Schema.Address | null;
	appealStatus: { status: string; subStateMachineName: string | null }[];
	appealType: { shorthand: string; type: item } | null;
	createdAt: Date;
	id: number;
	localPlanningDepartment: string;
	reference: string;
}

interface RepositoryGetByIdResultItem {
	address?: import('@pins/api').Schema.Address | null;
	appealDetailsFromAppellant?: import('@pins/api').Schema.AppealDetailsFromAppellant | null;
	appealStatus: { status: string; subStateMachineName: string | null }[];
	appealTimetable: import('@pins/api').Schema.AppealTimetable | null;
	appealType: { shorthand: string; type: string } | null;
	appellant?: import('@pins/api').Schema.Appellant | null;
	createdAt: Date;
	id: number;
	inspectorDecision?: { outcome: string } | null;
	linkedAppealId: number | null;
	linkedAppeals: Appeal[];
	localPlanningDepartment: string;
	lpaQuestionnaire: import('@pins/api').Schema.LPAQuestionnaire | null;
	otherAppeals: Appeal[];
	planningApplicationReference: string;
	reference: string;
	siteVisit?: { visitDate: Date } | null;
	startedAt: Date | null;
	lpaQuestionnaire?: import('@pins/api').Schema.LPAQuestionnaire;
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
	sensitiveAreaDetails?: string | null;
	siteWithinGreenBelt?: boolean | null;
	statutoryConsulteesDetails?: string | null;
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
	appellantName?: string;
	decision?: string;
	isParentAppeal: boolean | null;
	linkedAppeals: LinkedAppeal[];
	localPlanningDepartment: string;
	lpaQuestionnaireId: number | null;
	otherAppeals: LinkedAppeal[];
	planningApplicationReference: string;
	procedureType: string | null;
	siteVisit: { visitDate?: Date | null };
	startedAt: Date | null;
	documentationSummary: DocumentationSummary;
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

type ListedBuildingDetailsResponse = Pick<ListedBuildingDetails, 'grade' | 'description'>[];

export {
	AppealListResponse,
	AppealSite,
	AppealTimetable,
	BankHolidayFeedDivisions,
	BankHolidayFeedEvents,
	TimetableDeadlineDate,
	LinkedAppeal,
	ListedBuildingDetailsResponse,
	RepositoryGetAllResultItem,
	RepositoryGetByIdResultItem,
	DocumentationSummary,
	SingleAppealDetailsResponse,
	SingleLPAQuestionnaireResponse,
	TimetableConfig
};
