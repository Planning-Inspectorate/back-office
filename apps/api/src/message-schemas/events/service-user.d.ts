/**
 * service-user schema for use in code
 */
export interface ServiceUser {
	id: string;
	salutation?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	addressLine1?: string | null;
	addressLine2?: string | null;
	addressTown?: string | null;
	addressCounty?: string | null;
	postcode?: string | null;
	addressCountry?: string | null;
	organisation?: string | null;
	organisationType?: string | null;
	role?: string | null;
	telephoneNumber?: string | null;
	otherPhoneNumber?: string | null;
	faxNumber?: string | null;
	emailAddress?: string | null;
	webAddress?: string | null;
	serviceUserType: 'Applicant' | 'Appellant' | 'Agent' | 'RepresentationContact' | 'Subscriber';
	caseReference: string;
	sourceSystem: string;
	sourceSuid: string;
}
