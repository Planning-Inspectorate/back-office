import * as representationsRepository from '#repositories/representation.repository.js';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import {
	buildNsipRepresentationPayload,
	buildNsipRepresentationStatusUpdatePayload,
	buildRepresentationServiceUserPayload
} from './representation.js';
import { setRepresentationsAsPublished } from '#repositories/representation.repository.js';

export const publishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const representations = await representationsRepository.getPublishableRepresentationsById(
		caseId,
		representationIds
	);

	if (representations.length > 0) {
		const nsipRepresentationsPayload = representations.map(buildNsipRepresentationPayload);
		const serviceUsersPayload = representations.flatMap(buildRepresentationServiceUserPayload);

		await eventClient.sendEvents(
			NSIP_REPRESENTATION,
			nsipRepresentationsPayload,
			EventType.Publish
		);
		await eventClient.sendEvents(SERVICE_USER, serviceUsersPayload, EventType.Publish, {
			entityType: 'RepresentationContact'
		});

		await setRepresentationsAsPublished(representations, actionBy);
	}

	return representations;
};

export const publishRepresentationStatusUpdate = async (representation, newStatus) =>
	eventClient.sendEvents(
		NSIP_REPRESENTATION,
		buildNsipRepresentationStatusUpdatePayload(representation, newStatus),
		EventType.Update
	);
