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
			finalEventsDueDate: TimetableDeadline;
			interestedPartyRepsDueDate?: TimetableDeadline;
			questionnaireDueDate: TimetableDeadline;
			statementDueDate?: TimetableDeadline;
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
	finalEventsDueDate: Date | null;
	interestedPartyRepsDueDate?: Date | null;
	questionnaireDueDate: Date | null;
	statementDueDate?: Date | null;
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
	localPlanningDepartment: string;
	planningApplicationReference: string;
	reference: string;
	siteVisit?: { visitDate: Date } | null;
	startedAt: Date | null;
}

interface BankHolidayFeedEvent {
	title: string;
	date: string;
	notes: string;
}

interface BankHolidayFeedEvents extends Array<BankHolidayFeedEvent> {}

type BankHolidayFeedDivisions =
	| 'england-and-wales'
	| 'northern-ireland'
	| 'scotland'
	| 'united-kingdom';

export {
	AppealSite,
	AppealTimetable,
	BankHolidayFeedDivisions,
	BankHolidayFeedEvents,
	TimetableDeadlineDate,
	LinkedAppeal,
	RepositoryGetAllResultItem,
	RepositoryGetByIdResultItem,
	TimetableConfig
};
