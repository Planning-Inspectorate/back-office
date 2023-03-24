import { head, map } from 'lodash-es';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_PROJECT } from '../../infrastructure/topics.js';
import * as caseRepository from '../../repositories/case.repository.js';
import logger from '../../utils/logger.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { buildNsipProjectPayload } from './application.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { getCaseDetails, getCaseRepresentations, startApplication } from './application.service.js';
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

	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(application)]);

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
	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(updateResponse)]);

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

	const { count, items } = await getCaseRepresentations(params.id, { page, pageSize });

	response.send({
		page,
		pageSize,
		pageCount: Math.ceil(Math.max(1, count) / pageSize),
		itemCount: count,
		items
	});
};

/**
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const publishCase = async ({ params: { id } }, response) => {
	logger.info(`attempting to publish a case with id ${id}`);

	const publishedDate = await caseRepository.publishCase({
		caseId: id
	});

	logger.info(`successfully published case with id ${id}`);

	response.send({ publishedDate });
};
