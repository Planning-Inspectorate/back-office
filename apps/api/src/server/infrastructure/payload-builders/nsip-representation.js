/**
 * @typedef {import('pins-data-model').Schemas.Representation} NSIPRepresentationSchema
 * @typedef {import('pins-data-model').Schemas.ServiceUser} ServiceUserSchema
 *
 * @typedef {import('@prisma/client').Prisma.RepresentationGetPayload<{include: {case: true, user: true, represented: true, representative: true, attachments: true, representationActions: true} }>} RepresentationWithFullDetails
 * @typedef {import('@pins/applications.api').Schema.ServiceUser} ServiceUser
 */

/**
 * Build Representation message event payload
 *
 * @param {RepresentationWithFullDetails} representation
 * @returns {NSIPRepresentationSchema}
 */
export const buildNsipRepresentationPayload = (representation) => {
	const redacted = Boolean(representation.redacted);

	let nsipRepresentation = {
		representationId: representation.id,
		referenceId: representation.reference,
		examinationLibraryRef: '',
		caseRef: representation.case.reference,
		caseId: representation.caseId,
		status: mapRepresentationStatusToSchema(representation.status),
		redacted,
		originalRepresentation: representation.originalRepresentation,
		representationType: mapRepresentationTypeToSchema(representation.type),
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
 * @param {RepresentationWithFullDetails} representation
 * @returns {NSIPRepresentationSchema}
 */
export const buildNsipRepresentationPayloadForPublish = (representation) => {
	let publishRepresentationPayload = buildNsipRepresentationPayload(representation);
	// @ts-ignore
	publishRepresentationPayload.status = mapRepresentationStatusToSchema('PUBLISHED');

	return publishRepresentationPayload;
};

/**
 * Build Rel Rep Service User event message payload
 *
 * @param {RepresentationWithFullDetails} representation
 * @returns {ServiceUserSchema[]}
 */
export const buildRepresentationServiceUserPayload = (representation) => {
	const serviceUserPayloads = [];
	if (representation.represented)
		serviceUserPayloads.push(mapRepresentationServiceUser(representation.represented));
	if (representation.representative)
		serviceUserPayloads.push(mapRepresentationServiceUser(representation.representative));
	return serviceUserPayloads;
};

/**
 *
 * @param {ServiceUser} entity
 * @returns {ServiceUserSchema}
 */
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

/**
 * Convert BOAS rep status to the schema enum value
 * currently upper case to lower, eg 'AWAITING_REVIEW' to 'awaiting_review'
 *
 * @param {string} status
 */
const mapRepresentationStatusToSchema = (status) => {
	// TODO: Note at Mar 2024, we have 2 options not in schema: DRAFT, and WITHDRAWN
	return status.toLowerCase();
};

/**
 * Convert our DB Rep Type to schema enum value,
 * mostly our Sentence case to schema Title Case
 *
 * @param {string |null} representationType
 * @returns
 */
const mapRepresentationTypeToSchema = (representationType) => {
	let schemaRepresentationType = null;

	switch (representationType) {
		case 'Local authorities':
			schemaRepresentationType = 'Local authorities';
			break;
		case 'Members of the public/businesses':
			schemaRepresentationType = 'Members of the Public/Businesses';
			break;
		case 'Non-statutory organisations':
			schemaRepresentationType = 'Non-Statutory Organisations';
			break;
		case 'Parish councils':
			schemaRepresentationType = 'Parish Councils';
			break;
		case 'Statutory consultees':
			schemaRepresentationType = 'Statutory Consultees';
			break;
		// TODO: Note at Mar 2024, Schema has 2 options we do not have: Public & Businesses, and Another Individual
	}

	return schemaRepresentationType;
};
