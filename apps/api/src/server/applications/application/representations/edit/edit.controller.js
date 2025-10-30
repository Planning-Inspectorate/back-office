import { updateRepEditRequestToRepository } from './edit.mapper.js';
import { updateEditedRepresentation } from './edit.service.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationEvent } from '#infrastructure/event-broadcasters.js';

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").PatchRepresentationRedact>}
 */
export const patchRepresentationEdit = async ({ params, body }, response) => {
	const { id: caseId, repId: representationId } = params;

	const mappedRepresentation = updateRepEditRequestToRepository(body);

	const representation = await updateEditedRepresentation(
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

	return response.send({
		repId: representation.id,
		editedRepresentation: body.editedRepresentation
	});
};
