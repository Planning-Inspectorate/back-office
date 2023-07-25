export interface ApplicationsS51CreateBody {
	caseId: number;
	title: string;
	enquirer: string;
	enquiryMethod: string;
	enquiryDate: string;
	enquiryDetails: string;
	adviser: string;
	adviceDate: string;
	adviceDetails: string;
}

export interface ApplicationsS51CreatePayload {
	caseId: number;
	title: string;
	enquirer: string;
	enquiryMethod: string;
	enquiryDate: Date;
	enquiryDetails: string;
	adviser: string;
	adviceDate: Date;
	adviceDetails: string;
}
