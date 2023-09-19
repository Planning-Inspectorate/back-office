export interface ApplicationsS51CreateBody {
	caseId: number;
	title: string;
	enquirer?: string;
	enquiryMethod: string;
	enquiryDate: string;
	enquiryDetails: string;
	adviser: string;
	adviceDate: string;
	adviceDetails: string;
	enquirerFirstName?: string;
	enquirerLastName?: string;
}

export interface ApplicationsS51CreatePayload {
	caseId: number;
	title: string;
	enquirer?: string;
	enquiryMethod: string;
	enquiryDate: Date;
	enquiryDetails: string;
	adviser: string;
	adviceDate: Date;
	adviceDetails: string;
	firstName?: string;
	lastName?: string;
}

export interface ApplicationsS51UpdateBody {
	title?: string;
	enquirer?: string;
	enquiryMethod?: string;
	'enquiryDate.day'?: string;
	'enquiryDate.month'?: string;
	'enquiryDate.year'?: string;
	enquiryDetails?: string;
	adviser?: string;
	'adviceDate.day'?: string;
	'adviceDate.month'?: string;
	'adviceDate.year'?: string;
	adviceDetails?: string;
	firstName?: string;
	lastName?: string;
	redactedStatus?: string;
	publishedStatus?: string;
}

export interface ApplicationsS51UpdatePayload {
	title?: string;
	enquirer?: string;
	enquiryMethod?: string;
	enquiryDate?: Date;
	enquiryDetails?: string;
	adviser?: string;
	adviceDate?: Date;
	adviceDetails?: string;
	firstName?: string;
	lastName?: string;
	redactedStatus?: string;
	publishedStatus?: string;
	redacted?: boolean;
	status?: string;
	items?: { id: number }[];
}

// S51 type for the creation journey
// Object coming from API has a different structure defined in the general types files
// applications.types.d.ts
export interface S51AdviceForm {
	title?: string;
	enquirerFirstName: string;
	enquirerLastName: string;
	enquirerOrganisation: string;
	enquiryMethod: string;
	'enquiryDate.day'?: string;
	'enquiryDate.month'?: string;
	'enquiryDate.year'?: string;
	enquiryDetails: string;
	adviser: string;
	'adviceDate.day'?: string;
	'adviceDate.month'?: string;
	'adviceDate.year'?: string;
	adviceDetails: string;
}

export interface S51BlobResponse {
	blobStorageHost: string;
	documents: {
		documentName: string;
		blobStoreUrl: string;
	}[];
}

export interface ApplicationsS51ChangeStatusBodyPayload {
	redacted?: boolean;
	status?: string;
	items?: Array<{ id: number }>;
}
export interface ApplicationsS51ChangeStatusBody {
	isRedacted: string;
	status: string;
	selectAll: boolean;
	selectedFilesIds: string[];
}
