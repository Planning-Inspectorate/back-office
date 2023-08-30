import * as representationsRepository from '#repositories/representation.repository.js';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import {
	buildNsipRepresentationPayload,
	buildNsipRepresentationStatusUpdatePayload
} from './representation.js';
import { setRepresentationsAsPublished } from '#repositories/representation.repository.js';

export const publishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const representations = await representationsRepository.getPublishableRepresentationsById(
		caseId,
		representationIds
	);

	const nsipRepresentationsPayload = representations.map(buildNsipRepresentationPayload);
	await eventClient.sendEvents(NSIP_REPRESENTATION, nsipRepresentationsPayload, EventType.Publish);

	await setRepresentationsAsPublished(representations, actionBy);

	return representations;
};

export const publishRepresentationStatusUpdate = async (representation, newStatus) =>
	eventClient.sendEvents(
		NSIP_REPRESENTATION,
		buildNsipRepresentationStatusUpdatePayload(representation, newStatus),
		EventType.Update
	);
