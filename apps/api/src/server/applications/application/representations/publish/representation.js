/**
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
		representedId: representation.represented?.id,
		representativeId: representation.representative?.id,
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
 *
 * @param {Prisma.RepresentationSelect} representation
 * @param {string} newStatus
 * @returns {{}|{representationId, status}}
 */
export const buildNsipRepresentationStatusUpdatePayload = (representation, newStatus) => {
	if (!representation) return [];
	return [
		{
			representationId: representation.id,
			status: newStatus
		}
	];
};

/**
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
