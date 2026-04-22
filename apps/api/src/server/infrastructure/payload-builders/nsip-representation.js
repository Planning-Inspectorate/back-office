/**
 * @typedef {import('@planning-inspectorate/data-model').Schemas.Representation} NSIPRepresentationSchema
 * @typedef {import('@planning-inspectorate/data-model').Schemas.ServiceUser} ServiceUserSchema
 *
 * @typedef {import('#database-client').Prisma.RepresentationGetPayload<{include: {case: true, user: true, represented: true, representative: true, attachments: true, representationActions: true} }>} RepresentationWithFullDetails
 * @typedef {import('@pins/applications.api').Schema.ServiceUser} ServiceUser
 */

import { buildServiceUserPayload } from '#infrastructure/payload-builders/service-user.js';
import { REPRESENTATION_FROM_TYPE } from '#api-constants';

/**
 * Build Representation message event payload
 *
 * @param {RepresentationWithFullDetails} representation
 * @returns {NSIPRepresentationSchema}
 */
export const buildNsipRepresentationPayload = (representation) => {
	const redacted = Boolean(representation.redacted);
	const lastRepresentativeAction = redacted && representation.representationActions[0];

	let nsipRepresentation = {
		representationId: representation.id,
		referenceId: representation.reference,
		examinationLibraryRef: '',
		caseRef: representation.case.reference,
		caseId: representation.caseId,
		status: representation.status?.toLowerCase(),
		redacted,
		redactedBy: lastRepresentativeAction?.actionBy ?? null,
		redactedNotes: lastRepresentativeAction?.notes ?? null,
		redactedRepresentation: representation.redactedRepresentation ?? null,
		originalRepresentation: representation.originalRepresentation,
		editedRepresentation: representation.editedRepresentation ?? null,
		editNotes: representation.editNotes ?? null,
		representationType: mapRepresentationTypeToSchema(representation.type),
		representedId: representation.represented?.id.toString() ?? null,
		representativeId:
			representation.representedType === REPRESENTATION_FROM_TYPE.AGENT
				? representation.representative?.id?.toString()
				: null,
		representationFrom: representation.representedType ?? null,
		registerFor: null, // unused in CBOS - used in FO journey only
		dateReceived: representation.received?.toISOString() ?? '',
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
 * @param {RepresentationWithFullDetails} representation
 * @returns {NSIPRepresentationSchema}
 */
export const buildNsipRepresentationPayloadForPublish = (representation) => {
	let publishRepresentationPayload = buildNsipRepresentationPayload(representation);
	// @ts-ignore
	publishRepresentationPayload.status = 'published';

	return publishRepresentationPayload;
};

/**
 * Build Representation message event payload which optimistically sets the message status to unpublished before being
 * updated in the database.  This avoids multiple reads of representation data in the controller.
 * The message is idempotent so in case of failure to update in DB users would re-unpublish for eventual consistency.
 *
 * @param {RepresentationWithFullDetails} representation
 * @returns {NSIPRepresentationSchema}
 */
export const buildNsipRepresentationPayloadForUnpublish = (representation) => {
	let unpublishRepresentationPayload = buildNsipRepresentationPayload(representation);
	// @ts-ignore
	unpublishRepresentationPayload.status = 'unpublished';

	return unpublishRepresentationPayload;
};

/**
 * Build Rel Rep Service User event message payload
 *
 * @param {RepresentationWithFullDetails} representation
 * @returns {ServiceUserSchema[]}
 */
export const buildRepresentationServiceUserPayload = (representation) => {
	const serviceUserPayloads = [];
	if (representation.represented) {
		serviceUserPayloads.push(
			buildServiceUserPayload(
				representation.represented,
				representation.case?.reference,
				'RepresentationContact'
			)
		);
	}
	if (representation.representative) {
		serviceUserPayloads.push(
			buildServiceUserPayload(
				representation.representative,
				representation.case?.reference,
				'RepresentationContact'
			)
		);
	}
	return serviceUserPayloads;
};

/**
 * Convert our DB Rep Type to schema enum value,
 * mostly our Sentence case to schema Title Case
 *
 * @param {string |null} representationType
 * @returns
 */
const mapRepresentationTypeToSchema = (representationType) => {
	const representationMap = {
		'Local authorities': 'Local Authorities',
		'Members of the public/businesses': 'Members of the Public/Businesses',
		'Non-statutory organisations': 'Non-Statutory Organisations',
		'Parish councils': 'Parish Councils',
		'Statutory consultees': 'Statutory Consultees'
	};

	return representationMap[representationType] ?? null;
};
