import * as representationsRepository from '#repositories/representation.repository.js';
import { eventClient } from '#infrastructure/event-client.js';
import logger from '#utils/logger.js';
import { NSIP_REPRESENTATION, SERVICE_USER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import {
	buildNsipRepresentationPayload,
	buildRepresentationServiceUserPayload
} from '../representations.service.js';
import { setRepresentationsAsPublished } from '#repositories/representation.repository.js';
import { verifyNotTraining } from '../../application.validators.js';

/**
 * @param {number} caseId
 * @param {number[]} representationIds
 * @param {string} actionBy
 * */
export const publishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const representations = await representationsRepository.getPublishableRepresentationsById(
		caseId,
		representationIds
	);

	if (representations.length > 0) {
		const nsipRepresentationsPayload = representations.map(buildNsipRepresentationPayload);
		const serviceUsersPayload = representations.flatMap(buildRepresentationServiceUserPayload);

		try {
			await verifyNotTraining(caseId);

			await eventClient.sendEvents(
				NSIP_REPRESENTATION,
				nsipRepresentationsPayload,
				EventType.Publish
			);
			await eventClient.sendEvents(SERVICE_USER, serviceUsersPayload, EventType.Publish, {
				entityType: 'RepresentationContact'
			});
		} catch (/** @type {*} */ err) {
			logger.info(`Blocked sending event for representations: ${representationIds}`, err.message);
		}

		await setRepresentationsAsPublished(representations, actionBy);
	}

	return representations;
};
