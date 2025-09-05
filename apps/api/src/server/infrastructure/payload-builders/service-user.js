import { sourceSystem } from './constants.js';

/**
 * @param {import('@pins/applications.api').Schema.ServiceUser} entity
 * @param {string} caseReference
 * @param {'Applicant' | 'Appellant' | 'Agent' | 'RepresentationContact' | 'Subscriber'} caseRole
 *
 * @returns {import('@planning-inspectorate/data-model').Schemas.ServiceUser} ServiceUser
 */
export const buildServiceUserPayload = (entity, caseReference, caseRole) => ({
	// TODO: Note Mar 2024: full fat schema validation - we do not have organisationType, salutation, otherPhoneNumber, or faxNumber - so nulls are sent
	id: entity.id.toString(),
	organisation: entity.organisationName ?? null,
	organisationType: null,
	salutation: null,
	firstName: entity.firstName ?? null,
	lastName: entity.lastName ?? null,
	emailAddress: entity.email ?? null,
	webAddress: entity.website ?? null,
	telephoneNumber: entity.phoneNumber ?? null,
	addressLine1: entity.address?.addressLine1 ?? null,
	addressLine2: entity.address?.addressLine2 ?? null,
	addressTown: entity.address?.town ?? null,
	addressCounty: entity.address?.county ?? null,
	postcode: entity.address?.postcode ?? null,
	addressCountry: entity.address?.country ?? null,
	sourceSuid: entity.id.toString(),
	caseReference: caseReference,
	sourceSystem,
	serviceUserType: caseRole,
	role: entity.jobTitle ?? null,
	otherPhoneNumber: null,
	faxNumber: null
});
