import { Address } from './address';

export interface Contact {
	id?: number;
	organisationName?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	email?: string;
	address?: Address;
	jobTitle?: string;
	phoneNumber?: string;
	type?: string;
	under18?: string;
	contactMethod?: string;
}

export interface CreateUpdateRepresentation {
	status?: string;
	redacted?: boolean;
	received?: Date;
	originalRepresentation?: string;
	represented?: Contact;
	representative?: Contact;
}
