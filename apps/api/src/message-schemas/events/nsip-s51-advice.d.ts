/**
 * nsip-s51-advice schema for use in code
 */

export interface NSIPS51AdviceSchema {
	adviceId: number;
	adviceReference: string;
	caseId: number;
	caseReference: string;
	title: string;
	from: string;
	agent: string;
	method: 'phone' | 'email' | 'meeting' | 'post';
	enquiryDate: string;
	enquiryDetails: string;
	adviceGivenBy: string;
	adviceDate: string;
	adviceDetails: string;
	status: 'checked' | 'unchecked' | 'readytopublish' | 'published' | 'donotpublish';
	redactionStatus: 'unredacted' | 'redacted';
	attachmentIds: string[];
}
