import { updateRepRedactRequestToRepository } from './redact.mapper.js';
import { updateRedactedRepresentation } from './redact.service.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationEvent } from '#infrastructure/event-broadcasters.js';

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").PatchRepresentationRedact>}
 */
export const patchRepresentationRedact = async ({ params, body }, response) => {
	const { id: caseId, repId: representationId } = params;

	const mappedRepresentation = updateRepRedactRequestToRepository(body);

	const representation = await updateRedactedRepresentation(
		mappedRepresentation,
		Number(caseId),
		Number(representationId)
	);

	// broadcast update event message
	await broadcastNsipRepresentationEvent(representation, EventType.Update);

	if (!representation) {
		return response
			.status(400)
			.json({ errors: { representation: `Error updating representation` } });
	}

	return response.send({ repId: representation.id, redacted: representation.redacted });
};
