export interface S51AdviceDetails {
	id: number | null;
	referenceNumber: string;
	title: String;
	enquirer?: string;
	firstName?: string;
	lastName?: string;
	enquiryMethod: string;
	enquiryDate: number;
	enquiryDetails: string;
	adviser: string;
	adviceDate: number;
	adviceDetails: string;
	redactedStatus: string;
	publishedStatus: string;
	dateCreated: number;
	dateUpdated: number;
}
