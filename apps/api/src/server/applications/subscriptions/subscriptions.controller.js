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
export async function getSubscription(request, response) {
	const { query } = request;

	// we're expecting strings here, not other possible types (e.g. string[])
	const caseReference = String(query.caseReference);
	const emailAddress = String(query.emailAddress);

	try {
		const res = await subscriptionRepository.findUnique(caseReference, emailAddress);

		if (res === null) {
			response.status(404).send({ errors: { notFound: 'subscription not found' } });
		} else {
			response.send(res);
		}
	} catch (/** @type {any} */ e) {
		/** @type {Object<string, string>} */
		const errors = {};
		logger.warn(e, 'unhandled error');
		errors.unknown = e.message || 'unknown';
		response.status(400).send({ errors });
	}
}

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

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export async function updateSubscription(request, response) {
	const { body, params } = request;

	const id = parseInt(params.id);
	if (isNaN(id) || id <= 0) {
		response.status(400).send({ errors: { id: 'must be a valid integer > 0' } });
		return;
	}

	const endDate = new Date(body.endDate);

	/** @type {import('@prisma/client').Prisma.SubscriptionUpdateInput} */
	const subscription = {
		endDate
	};

	try {
		const existing = await subscriptionRepository.get(id);
		if (existing && existing.startDate) {
			if (existing.startDate > endDate) {
				response.status(400).send({ errors: { endDate: 'endDate must be after startDate' } });
				return;
			}
		}
		const res = await subscriptionRepository.update(id, subscription);

		await eventClient.sendEvents(
			NSIP_SUBSCRIPTION,
			[buildSubscriptionPayload(res)],
			EventType.Update
		);

		response.send(res);
	} catch (/** @type {any} */ e) {
		/** @type {Object<string, string>} */
		const errors = {};
		let code = 400;
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			errors.code = e.code;
			switch (e.code) {
				case 'P2025':
					errors.notFound = 'subscription not found';
					code = 404;
					break;
			}
		} else {
			logger.warn(e, 'unhandled error');
			errors.unknown = e.message || 'unknown';
		}
		response.status(code).send({ errors });
	}
}
