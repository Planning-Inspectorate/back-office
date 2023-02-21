import { head, map } from 'lodash-es';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_PROJECT } from '../../infrastructure/topics.js';
import * as caseRepository from '../../repositories/case.repository.js';
import logger from '../../utils/logger.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { buildNsipProjectPayload } from './application.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { getCaseDetails, startApplication } from './application.service.js';
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
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns { Promise<void> }
 */
export const createApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.createApplication(mappedApplicationDetails);

	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(application)]);

	const applicantIds = getServiceCustomerIds(application.serviceCustomer);

	response.send({ id: application.id, applicantIds });
};

/**
 * Express request handler function for updating an application.
 *
 * @param {import('express').Request<{id: number}, void, import('@pins/applications').CreateUpdateApplication>} request
 * @param {import('express').Response} response
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const updateApplication = async (request, response) => {
	const { params, body } = request;

	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(body);

	const updateResponse = await caseRepository.updateApplication({
		caseId: params.id,
		applicantId: head(body?.applicants)?.id,
		...mappedApplicationDetails
	});

	if (!updateResponse) {
		throw new Error('Application not found');
	}

	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(updateResponse)]);

	const applicantIds = getServiceCustomerIds(updateResponse.serviceCustomer);

	response.send({ id: updateResponse.id, applicantIds });
};

/**
 * Express request handler to start a case.
 *
 * @param {import('express').Request<{id: number}>} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const startCase = async (request, response) => {
	const { params } = request;

	const { id, reference, status } = await startApplication(params.id);

	response.send({ id, reference, status: mapCaseStatusString(status.toString()) });
};

/**
 * Express request handler for getting application details.
 *
 * @param {import('express').Request<{id: number}, any, any, any>} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {Promise<void>} A Promise that resolves when the request handler has finished processing the request.
 */
export const getApplicationDetails = async (req, res) => {
	const { params, query } = req;

	const applicationDetails = await getCaseDetails(params.id, query);

	res.send(applicationDetails);
};

/**
 * Express request handler to publish a case
 *
 * @type {import('express').RequestHandler<{ id: number }, any, any, any, {}>}
 * @param {import('express').Request<{ id: number }>} request
 * @param {import('express').Response<{}>} response
 * @returns {Promise<void>}
 */
export const publishCase = async (request, response) => {
	const {
		params: { id }
	} = request;

	logger.info(`attempting to publish a case with id ${id}`);

	const publishedDate = await caseRepository.publishCase({
		caseId: id
	});

	logger.info(`successfully published case with id ${id}`);

	response.send({ publishedDate });
};
