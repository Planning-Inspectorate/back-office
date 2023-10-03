import * as subscriptionRepository from '#repositories/subscription.respository.js';
import { eventClient } from '#infrastructure/event-client.js';
import { EventType } from '@pins/event-client';
import { NSIP_SUBSCRIPTION } from '#infrastructure/topics.js';
import { buildSubscriptionPayloads, subscriptionToResponse } from './subscriptions.js';
import logger from '#utils/logger.js';
import { createOrUpdateSubscription } from './subscriptions.service.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../constants.js';
import { getPageCount } from '#utils/database-pagination.js';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export async function listSubscriptions(req, res) {
	/**
	 * @type {import('../../repositories/subscription.respository.js').ListSubscriptionOptions}
	 */
	const opts = {
		page: Number(req.query.page) || DEFAULT_PAGE_NUMBER,
		pageSize: Number(req.query.pageSize) || DEFAULT_PAGE_SIZE
	};

	// check filters
	if (req.query.type) {
		opts.type = String(req.query.type);
	}
	if (req.query.caseReference) {
		opts.caseReference = String(req.query.caseReference);
	}
	if (typeof req.query.endAfter === 'string') {
		opts.endAfter = new Date(req.query.endAfter);
	}
	logger.debug(opts, 'listSubscriptions');

	const result = await subscriptionRepository.list(opts);
	const formattedItems = result.items.map(subscriptionToResponse);

	res.send({
		itemCount: result.count,
		items: formattedItems,
		page: opts.page,
		pageCount: getPageCount(result.count, opts.pageSize),
		pageSize: opts.pageSize
	});
}

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export async function getSubscription({ body }, response) {
	// we're expecting strings here, not other possible types (e.g. string[])
	const caseReference = String(body.caseReference);
	const emailAddress = String(body.emailAddress);

	try {
		const res = await subscriptionRepository.findUnique(caseReference, emailAddress);

		if (res === null) {
			response.status(404).send({ errors: { notFound: 'subscription not found' } });
		} else {
			response.send(subscriptionToResponse(res));
		}
	} catch (/** @type {any} */ e) {
		logger.warn(e, 'unhandled error');
		response.status(500).send({
			errors: { unknown: 'unknown internal error' }
		});
	}
}

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export async function putSubscription(request, response) {
	try {
		const { id, created } = await createOrUpdateSubscription(request.body);

		if (created) {
			response.status(201);
		}

		response.send({ id });
	} catch (/** @type {any} */ e) {
		logger.warn(e, 'unhandled error');
		response.status(500).send({
			errors: { unknown: 'unknown internal error' }
		});
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
		if (existing === null) {
			response.status(404).send({ errors: { notFound: 'subscription not found' } });
			return;
		}
		if (existing && existing.startDate) {
			if (existing.startDate > endDate) {
				response.status(400).send({ errors: { endDate: 'endDate must be after startDate' } });
				return;
			}
		}
		const res = await subscriptionRepository.update(id, subscription);

		// since we only allow updating end date (currently), we only need to send update events
		await eventClient.sendEvents(
			NSIP_SUBSCRIPTION,
			buildSubscriptionPayloads(res),
			EventType.Update
		);

		response.send(subscriptionToResponse(res));
	} catch (/** @type {any} */ e) {
		logger.warn(e, 'unhandled error');
		response.status(500).send({
			errors: { unknown: 'unknown internal error' }
		});
	}
}
