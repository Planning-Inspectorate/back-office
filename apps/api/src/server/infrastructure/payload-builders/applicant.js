import { sourceSystem } from './constants.js';

/**
 * @param {import('@pins/applications.api').Schema.ServiceUser} entity
 * @param {string} caseReference
 * @param {'Applicant' | 'Appellant' | 'Agent' | 'RepresentationContact' | 'Subscriber'} caseRole
 *
 * @returns {import('pins-data-model').Schemas.ServiceUser} ServiceUser
 */
export const buildServiceUserPayload = (entity, caseReference, caseRole) => ({
	id: entity.id.toString(),
	organisation: entity.organisationName ?? undefined,
	firstName: entity.firstName ?? undefined,
	lastName: entity.lastName ?? undefined,
	emailAddress: entity.email ?? undefined,
	webAddress: entity.website ?? undefined,
	telephoneNumber: entity.phoneNumber ?? undefined,
	...(entity.address && {
		addressLine1: entity.address.addressLine1 ?? undefined,
		addressLine2: entity.address.addressLine2 ?? undefined,
		addressTown: entity.address.town ?? undefined,
		addressCounty: entity.address.county ?? undefined,
		postcode: entity.address.postcode ?? undefined,
		addressCountry: entity.address.country ?? undefined
	}),
	sourceSuid: entity.id.toString(),
	caseReference: caseReference,
	sourceSystem,
	serviceUserType: caseRole
});
