export interface Address {
	AddressLine1: string;
	AddressLine2?: string;
	Town: string;
	County?: string;
	PostCode: string;
}

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

export interface AppealSummary {
	appealId: number;
	appealReference: string;
	appealStatus: string;
}

export interface AppealList {
	itemCount: number;
	items: AppealSummary[];
	page: number;
	pageCount: number;
	pageSize: number;
}

export interface PaginationItem {
	number?: number;
	href?: string;
	current?: boolean;
	ellipsis?: boolean;
}

export interface Pagination {
	items: PaginationItem[];
	previous: PaginationItem;
	next: PaginationItem;
}

export type AppealStatus =
	| 'ready_to_start'
	| 'lpa_questionnaire_due'
	| 'statement_review'
	| 'final_comment_review'
	| 'arrange_site_visit'
	| 'issue_determination'
	| 'complete';

export interface AppealSite {
	addressLine1?: string;
	addressLine2?: string;
	town?: string;
	county?: string;
	postCode?: string | null;
}

export interface SearchInputFieldObject {
	id: string;
	name: string;
	value?: string;
	errorMessage?: object | null;
}
