import { EventType } from '@pins/event-client';
import { head, map } from 'lodash-es';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_PROJECT } from '../../infrastructure/topics.js';
import * as caseRepository from '../../repositories/case.repository.js';
import logger from '../../utils/logger.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { mapDateStringToUnixTimestamp } from '../../utils/mapping/map-date-string-to-unix-timestamp.js';
import { buildNsipProjectPayload } from './application.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import {
	getCaseDetails,
	getCaseRepresentation,
	getCaseRepresentations,
	startApplication
} from './application.service.js';
/**
 *
 * @param {import('@pins/api').Schema.ServiceCustomer[] | undefined} serviceCustomers
 * @returns {number[]}
 */
const getServiceCustomerIds = (serviceCustomers) => {
	return map(serviceCustomers, (serviceCustomer) => {
		return serviceCustomer.id;
	});
};

/**
 * Express request handler for creating application
 *
 * @type {import('express').RequestHandler}
 */
export const createApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.createApplication(mappedApplicationDetails);

	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(application)],
		EventType.Create
	);

	const applicantIds = getServiceCustomerIds(application.serviceCustomer);

	response.send({ id: application.id, applicantIds });
};

/**
 * @type {import('express').RequestHandler<{id: number}, ?, import('@pins/applications').CreateUpdateApplication>}
 */
export const updateApplication = async ({ params, body }, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(body);

	const updateResponse = await caseRepository.updateApplication({
		caseId: params.id,
		applicantId: head(body?.applicants)?.id,
		...mappedApplicationDetails
	});

	if (!updateResponse) {
		throw new Error('Application not found');
	}

	// @ts-ignore
	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(updateResponse)],
		EventType.Update
	);

	const applicantIds = getServiceCustomerIds(updateResponse.serviceCustomer);

	response.send({ id: updateResponse.id, applicantIds });
};

/**
 *
 * @type {import('express').RequestHandler<{id: number}>}
 */
export const startCase = async ({ params }, response) => {
	const { id, reference, status } = await startApplication(params.id);

	response.send({ id, reference, status: mapCaseStatusString(status.toString()) });
};

/**
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const getApplicationDetails = async ({ params, query }, response) => {
	const applicationDetails = await getCaseDetails(params.id, query);

	response.send(applicationDetails);
};

/**
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const getApplicationRepresentations = async ({ params, query }, response) => {
	const pageSize = query.pageSize ?? 25;
	const page = query.page ?? 1;
	const under18 = query.under18 ? query.under18 === 'true' : null;
	const status = query.status ? [query.status].flat() : [];

	let filters = null;

	if (status.length > 0 || under18) {
		filters = {
			...(under18 ? { under18 } : {}),
			...(status.length > 0 ? { status } : {})
		};
	}

	let sort = null;

	if (query.sortBy) {
		let field;
		let direction;

		switch (query.sortBy.slice(0, 1)) {
			case '-':
				direction = 'desc';
				field = query.sortBy.slice(1);
				break;

			case '+':
				direction = 'asc';
				field = query.sortBy.slice(1);
				break;

			default:
				direction = 'asc';
				field = query.sortBy;
		}

		sort = [{ [field]: direction }];
	}

	const { count, items } = await getCaseRepresentations(
		params.id,
		{ page, pageSize },
		{
			searchTerm: query.searchTerm,
			filters,
			sort
		}
	);

	response.send({
		page,
		pageSize,
		pageCount: Math.ceil(Math.max(1, count) / pageSize),
		itemCount: count,
		items: items.map((item) => {
			const { contacts, ...rep } = item;

			return {
				...rep,
				...contacts?.[0]
			};
		})
	});
};

/**
 *
 * @type {import('express').RequestHandler<{id: number, repId: number}, ?, ?, any>}
 */
export const getApplicationRepresentation = async ({ params }, response) => {
	const { user, ...representation } = await getCaseRepresentation(params.id, params.repId);

	response.send({
		...representation,
		redactedBy: user
	});
};

/**
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const publishCase = async ({ params: { id } }, response) => {
	logger.info(`attempting to publish a case with id ${id}`);

	const publishedCase = await caseRepository.publishCase({
		caseId: id
	});

	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(publishedCase)],
		EventType.Publish
	);

	logger.info(`successfully published case with id ${id}`);

	response.send({
		publishedDate: mapDateStringToUnixTimestamp(String(publishedCase?.publishedAt))
	});
};
