export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
};

export interface Address {
	addressLine1: string;
	addressLine2?: string;
	town: string;
	county?: string;
	postcode: string;
}
export interface Sector {
	id: number;
	abbreviation: string;
	displayNameEn: string;
	displayNameCy?: string;
	name: string;
}

export interface Document {}

export type DomainType = 'case-officer' | 'case-admin-officer' | 'inspector';

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

export interface Application {
	id: number;
	name: string;
	reference: string;
	sector: Sector;
	subSector: Sector;
	description: string;
	stage: string;
	submittedDate: string;
	examinationStartDate: string;
	deadlineForCloseOfExamination: string;
	deadlineSubmissionOfRecommendation: string;
	deadlineDecision: string;
	localPlanningDepartment: string;
	address: Address;
	documents: Document[];
}

export interface ApplicationSummary {
	id: number;
	modifiedDate: string;
	reference: string;
	sector: Sector;
	subSector: Sector;
}
