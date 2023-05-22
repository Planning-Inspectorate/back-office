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
	caseProcedure: string;
	caseOfficer?: Contact;
	inspector?: Contact;
	developmentType: string;
	decision?: string;
	eventType: string;
	linkedAppeal: AppealLink | null;
	localPlanningDepartment: string;
	otherAppeals: [AppealLink] | [];
	planningApplicationReference: string;
	documentationStatus?: object;
	startedAt?: string | null;
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
