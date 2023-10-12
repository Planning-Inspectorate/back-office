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
	attachments: array;
	representationActions: RepresentationAction[];
};

export type Address = {
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	county?: string | null;
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
	jobTitle?: string | null;
	under18?: boolean | null;
	email?: string | null;
	phoneNumber?: string | null;
	contactMethod?: string | null;
	address?: Address;
};

export type RepresentationAction = {
	type: string;
	actionBy: string;
	redactStatus: boolean | null;
	previousRedactStatus: boolean | null;
	status: string | null;
	previousStatus: string | null;
	invalidReason: string | null;
	referredTo: string | null;
	actionDate: string;
	notes: string | null;
};

export type PublishableRep = {
	id: number;
	reference: string;
	status: string;
	redacted: boolean;
	received: string;
	firstName: string;
	lastName: string;
	organisationName: string | null;
};

export type PublishableReps = {
	previouslyPublished: boolean;
	itemCount: number;
	items: PublishableRep[];
};
