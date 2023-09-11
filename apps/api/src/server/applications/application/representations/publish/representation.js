/**
 *
 * @param {Representation} representation
 * @returns {{representationType: *, attachments: *, representationId: *, originalRepresentation: *, representationFrom: *, examinationLibraryRef: string, referenceId: *, caseRef: *, dateReceived: *, caseId: *, represented: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), representative: ({}|{firstName: *, lastName: *, under18: *, organisationName: *, emailAddress: *, telephone: *, id: *, contactMethod: *}), registerFor: *, status: *}|{caseRef: *, representationType: *, attachments: *, representationId: *, redacted, redactedRepresentation, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}|{redactedBy, redactedNotes, caseRef: *, representationType: *, attachments: *, representationId: *, dateReceived: *, caseId: *, originalRepresentation: *, examinationLibraryRef: string, referenceId: *, status: *}}
 */
export const buildNsipRepresentationPayload = (representation) => {
	let nsipRepresentation = {
		representationId: representation.id,
		referenceId: representation.reference,
		examinationLibraryRef: '',
		caseRef: representation.case.reference,
		caseId: representation.caseId,
		status: representation.status,
		originalRepresentation: representation.originalRepresentation,
		representationType: representation.type,
		dateReceived: representation.received,
		attachments: representation.attachments?.map(buildAttachment)
	};

	const representative = representation.contacts.find((contact) => contact.type === 'AGENT');
	const represented = representation.contacts.find((contact) => contact.type !== 'AGENT');
	nsipRepresentation = {
		...nsipRepresentation,
		representationFrom: (representative || represented)?.type,
		representative: buildNsipInterestedPartyPayload(representative),
		registerFor: represented?.type,
		represented: buildNsipInterestedPartyPayload(represented)
	};

	if (representation.redacted) {
		nsipRepresentation = {
			...nsipRepresentation,
			redacted: representation.redacted,
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

const buildNsipInterestedPartyPayload = (representationContact) => {
	if (!representationContact) return {};
	return {
		id: representationContact.representationId,
		firstName: representationContact.firstName,
		lastName: representationContact.lastName,
		under18: representationContact.under18,
		organisationName: representationContact.organisationName,
		contactMethod: representationContact.contactMethod,
		emailAddress: representationContact.email,
		telephone: representationContact.phoneNumber
	};
};

const buildAttachment = (attachment) => {
	return {
		documentId: attachment.documentGuid
	};
};
