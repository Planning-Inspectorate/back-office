export interface S51AdviceDetails {
	id: number | null;
	referenceNumber: string;
	referenceCode: string;
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
	attachments: {
		documentName: any;
		documentType: string;
		documentSize: string;
		dateAdded: string;
		status: string;
		documentGuid: string;
		version: number;
	}[];
}
