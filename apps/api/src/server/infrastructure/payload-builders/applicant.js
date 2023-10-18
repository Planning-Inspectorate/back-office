import { sourceSystem } from './constants.js';

/**
 * @param {import('@pins/applications.api').Schema.ServiceUser} entity
 * @param {string} caseReference
 * @param {'Applicant' | 'Appellant' | 'Agent' | 'RepresentationContact' | 'Subscriber'} caseRole
 *
 * @returns {import('../../../message-schemas/events/service-user.d.ts').ServiceUser} ServiceUser
 */
export const buildServiceUserPayload = (entity, caseReference, caseRole) => ({
	id: entity.id.toString(),
	organisation: entity.organisationName,
	firstName: entity.firstName,
	lastName: entity.lastName,
	emailAddress: entity.email,
	webAddress: entity.website,
	telephoneNumber: entity.phoneNumber,
	...(entity.address && {
		addressLine1: entity.address.addressLine1,
		addressLine2: entity.address.addressLine2,
		addressTown: entity.address.town,
		addressCounty: entity.address.county,
		postcode: entity.address.postcode,
		addressCountry: entity.address.country
	}),
	sourceSuid: entity.id.toString(),
	caseReference: caseReference,
	sourceSystem,
	serviceUserType: caseRole
});
