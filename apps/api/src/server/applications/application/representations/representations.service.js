import { eventClient } from '#infrastructure/event-client.js';
import * as representationsRepository from '#repositories/representation.repository.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {{searchTerm: string?, filters: Record<string, string[] | boolean>?, sort: object[]?}} filterAndSort
 * @returns {Promise<{ count: number, items: any[]}>}
 */
export const getCaseRepresentations = async (caseId, pagination, filterAndSort) => {
	return representationsRepository.getByCaseId(caseId, pagination, filterAndSort);
};

/**
 *
 * @param {number} repId
 * @returns {Promise<Prisma.RepresentationSelect>}
 */
export const getCaseRepresentation = async (repId) => {
	return representationsRepository.getById(Number(repId));
};

/**
 *
 * @param {import("#repositories/representation.repository").CreateRepresentationParams} representation
 * @returns {Promise<object>}
 */
export const createCaseRepresentation = async (representation) => {
	return representationsRepository.createApplicationRepresentation(representation);
};

export const updateCaseRepresentation = async (representation, caseId, representationId) => {
	return representationsRepository.updateApplicationRepresentation(
		representation,
		caseId,
		representationId
	);
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<*>}
 */
export const getCaseRepresentationsStatusCount = async (caseId) => {
	return representationsRepository.getStatusCountByCaseId(caseId);
};

/**
 * Broadcast a create / update event message to Service Bus, for a representation, and any service users (reps contact or agent)
 *
 * @param {*} representation
 * @param {EventType} eventType
 * @returns
 */
export const sendRepresentationEventMessage = async (
	representation,
	eventType = EventType.Update
) => {
	const nsipRepresentationPayload = buildNsipRepresentationPayload(representation);
	const serviceUsersPayload = buildRepresentationServiceUserPayload(representation);
	await eventClient.sendEvents(NSIP_REPRESENTATION, nsipRepresentationPayload, eventType);

	// and service users
	await eventClient.sendEvents(SERVICE_USER, serviceUsersPayload, eventType, {
		entityType: 'RepresentationContact'
	});
};

/**
 * Build Representation message event payload
 *
 * @param {Representation} representation
 * @returns {{representationType: *, attachments: *, representationId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, caseRef: *, dateReceived: *, caseId: *, representedType: *, represented: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), representative: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), status: *}|{caseRef: *, representationType: *, attachments: *, representationId: *, redacted, redactedRepresentation, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}|{redactedBy, redactedNotes, caseRef: *, representationType: *, attachments: *, representationId: *, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}}
 */
export const buildNsipRepresentationPayload = (representation) => {
	const redacted = Boolean(representation.redacted);

	let nsipRepresentation = {
		representationId: representation.id,
		referenceId: representation.reference,
		examinationLibraryRef: '',
		caseRef: representation.case.reference,
		caseId: representation.caseId,
		status: representation.status,
		redacted,
		originalRepresentation: representation.originalRepresentation,
		representationType: representation.type,
		representedId: representation.represented?.id.toString(),
		representativeId: representation.representative?.id.toString(),
		representationFrom: representation.representative?.id
			? 'AGENT'
			: representation.representedType,
		registerFor: representation.representedType,
		dateReceived: representation.received,
		attachmentIds: representation.attachments?.map((attachment) => attachment.documentGuid)
	};

	if (redacted) {
		nsipRepresentation = {
			...nsipRepresentation,
			redactedRepresentation: representation.redactedRepresentation
		};

		const representationActions = representation.representationActions.filter(
			(action) => action.type === 'REDACTION'
		);
		if (representationActions.length > 0) {
			const redaction = representationActions[representationActions.length - 1];
			nsipRepresentation = {
				...nsipRepresentation,
				redactedBy: redaction.actionBy,
				redactedNotes: redaction.notes
			};
		}
	}

	return nsipRepresentation;
};

/**
 * Build Representation message event payload which optimistically sets the message status to published before being
 * updated in the database.  This avoids multiple reads of representation data in the controller.
 * The message is idempotent so in case of failure to update in DB users would re-publish for eventual consistency.
 *
 * @param {Representation} representation
 * @returns {{representationType: *, attachments: *, representationId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, caseRef: *, dateReceived: *, caseId: *, representedType: *, represented: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), representative: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), status: *}|{caseRef: *, representationType: *, attachments: *, representationId: *, redacted, redactedRepresentation, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}|{redactedBy, redactedNotes, caseRef: *, representationType: *, attachments: *, representationId: *, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}}
 */
export const buildNsipRepresentationPayloadForPublish = (representation) => {
	let publishRepresentationPayload = buildNsipRepresentationPayload(representation);
	publishRepresentationPayload.status = 'PUBLISHED';
	return publishRepresentationPayload;
};

/**
 * Build Rel Rep Service User event message payload
 *
 * @param {Prisma.RepresentationSelect} representation
 * @returns {ServiceUser[]}
 */
export const buildRepresentationServiceUserPayload = (representation) => {
	const serviceUserPayloads = [];
	if (representation.represented)
		serviceUserPayloads.push(mapRepresentationServiceUser(representation.represented));
	if (representation.representative)
		serviceUserPayloads.push(mapRepresentationServiceUser(representation.representative));
	return serviceUserPayloads;
};

const mapRepresentationServiceUser = (entity) => ({
	id: entity.id.toString(),
	firstName: entity.firstName,
	lastName: entity.lastName,
	addressLine1: entity.address?.addressLine1,
	addressLine2: entity.address?.addressLine2,
	addressTown: entity.address?.town,
	addressCounty: entity.address?.county,
	addressCountry: entity.address?.country,
	postcode: entity.address?.postcode,
	organisation: entity.organisationName,
	role: entity.jobTitle,
	telephoneNumber: entity.phoneNumber,
	emailAddress: entity.email,
	serviceUserType: 'RepresentationContact',
	sourceSuid: entity.id.toString()
});
