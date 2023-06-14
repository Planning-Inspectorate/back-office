import { Address } from '@pins/appeals';
export interface Appeal {
	agentName: string;
	allocationDetails: string;
	appealId: number;
	appealReference: string;
	appealSite: Address;
	appealStatus: string;
	appealType: string;
	appellantName: string;
	procedureType: string;
	caseOfficer?: Contact;
	inspector?: Contact;
	developmentType: string;
	decision?: string;
	eventType: string;
	linkedAppeals: AppealLink[] | [];
	localPlanningDepartment: string;
	otherAppeals: [AppealLink] | [];
	planningApplicationReference: string;
	documentationSummary?: object;
	startedAt: string | null;
	appealTimetable: AppealTimetable;
	siteVisit: AppealSiteVisit;
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
};
