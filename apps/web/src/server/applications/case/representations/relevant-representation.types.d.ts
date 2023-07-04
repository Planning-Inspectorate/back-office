export type Representation = {
	id: number;
	reference: string;
	status: string;
	contacts: Contact[];
	redacted: boolean;
	received: string;
	originalRepresentation: string;
	representationExcerpt: string;
	redactedRepresentation: string;
	redactedRepresentationExcerpt: string;
	redactedNotes: string;
	redactedNotesExcerpt: string;
	redactedBy: string;
	type: string;
	attachments: string
};

export type Address = {
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	county: string | null;
	postcode: string | null;
	country: string | null;
};

export type Contact = {
	id?: number | null;
	type?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	fullName?: string | null;
	organisationName?: string | null;
	type?: string;
	jobTitle?: string | null;
	under18?: boolean | null;
	email?: string | null;
	phoneNumber?: string | null;
	contactMethod?: string | null;
	address?: Address;
};
