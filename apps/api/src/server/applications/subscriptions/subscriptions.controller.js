import * as subscriptionRepository from '../../repositories/subscription.respository.js';
import { eventClient } from '../../infrastructure/event-client.js';
import { EventType } from '@pins/event-client';
import { NSIP_SUBSCRIPTION } from '../../infrastructure/topics.js';
import { buildSubscriptionPayload } from './subscriptions.js';
import logger from '../../utils/logger.js';
import { Prisma } from '@prisma/client';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export async function createSubscription(request, response) {
	const { body } = request;

	/** @type {import('@prisma/client').Prisma.SubscriptionCreateInput} */
	const subscription = {
		caseReference: body.caseReference,
		emailAddress: body.emailAddress,
		subscriptionType: body.subscriptionType
	};

	if (body.startDate) {
		subscription.startDate = new Date(body.startDate);
	}
	if (body.endDate) {
		subscription.endDate = new Date(body.endDate);
	}
	if (body.language) {
		subscription.language = body.language;
	}

	try {
		const res = await subscriptionRepository.create(subscription);

		await eventClient.sendEvents(
			NSIP_SUBSCRIPTION,
			[buildSubscriptionPayload(res)],
			EventType.Create
		);

		response.send({ id: res.id });
	} catch (/** @type {any} */ e) {
		/** @type {Object<string, string>} */
		const errors = {};
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			errors.code = e.code;
			if (e.code === 'P2002') {
				errors.constraint = 'caseReference and emailAddress combination must be unique';
			}
		} else {
			logger.warn(e, 'unhandled error');
			errors.unknown = e.message || 'unknown';
		}
		response.status(400).send({ errors });
	}
}
