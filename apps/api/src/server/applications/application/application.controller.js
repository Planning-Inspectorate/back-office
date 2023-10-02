import { EventType } from '@pins/event-client';
import { head, map } from 'lodash-es';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_PROJECT } from '../../infrastructure/topics.js';
import * as caseRepository from '../../repositories/case.repository.js';
import logger from '../../utils/logger.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { mapDateStringToUnixTimestamp } from '../../utils/mapping/map-date-string-to-unix-timestamp.js';
import { setCaseUnpublishedChangesIfTrue } from '../../utils/published-case-fields-changed.js';
import { buildNsipProjectPayload } from './application.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { getCaseDetails, getCaseByRef, startApplication } from './application.service.js';

/**
 *
 * @param {import("@pins/applications.api").Schema.ServiceCustomer[] | undefined} serviceCustomers
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
 * @type {import("express").RequestHandler}
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
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").CreateUpdateApplication>}
 */
export const updateApplication = async ({ params, body }, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(body);

	const originalResponse = await caseRepository.getById(params.id, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		serviceCustomer: true,
		serviceCustomerAddress: true,
		gridReference: true
	});

	if (!originalResponse) {
		throw new BackOfficeAppError(`Application not found with id ${params.id}`, 404);
	}

	let updateResponse = await caseRepository.updateApplication({
		caseId: params.id,
		applicantId: head(body?.applicants)?.id,
		...mappedApplicationDetails
	});

	if (!updateResponse) {
		throw new BackOfficeAppError('Application not found', 500);
	}

	updateResponse = await setCaseUnpublishedChangesIfTrue(originalResponse, updateResponse);

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
 * @type {import("express").RequestHandler<{id: number}>}
 */
export const startCase = async ({ params }, response) => {
	const { id, reference, status } = await startApplication(params.id);

	response.send({ id, reference, status: mapCaseStatusString(status.toString()) });
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, ?, any>}
 */
export const getApplicationDetails = async ({ params, query }, response) => {
	const applicationDetails = await getCaseDetails(params.id, query);

	response.send(applicationDetails);
};

/**
 * @type {import("express").RequestHandler}
 * */
export const queryApplications = async ({ query }, response) => {
	if (!query.reference) {
		throw new BackOfficeAppError('no `reference` query string was given', 400);
	}

	const application = await getCaseByRef(String(query.reference));
	if (!application) {
		response.end(404);
		return;
	}

	response.send(application);
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, ?, any>}
 */
export const publishCase = async ({ params: { id } }, response) => {
	logger.info(`attempting to publish a case with id ${id}`);

	const publishedCase = await caseRepository.publishCase({
		caseId: id
	});

	if (!publishedCase) {
		throw new BackOfficeAppError(`no case found with id: ${id}`, 404);
	}

	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(publishedCase)],
		EventType.Publish
	);

	logger.info(`successfully published case with id ${id}`);

	response.send({
		publishedDate: mapDateStringToUnixTimestamp(
			String(publishedCase?.CasePublishedState[0]?.createdAt)
		)
	});
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, ?, any>}
 */
export const unpublishCase = async ({ params: { id } }, response) => {
	logger.info(`attempting to unpublish a case with id ${id}`);

	const unpublishedCase = await caseRepository.unpublishCase({
		caseId: id
	});

	if (!unpublishedCase) {
		throw new BackOfficeAppError(`no case found with id: ${id}`, 404);
	}

	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(unpublishedCase)],
		EventType.Unpublish
	);

	logger.info(`successfully unpublished case with id ${id}`);

	response.send({
		unpublishedDate: mapDateStringToUnixTimestamp(
			String(unpublishedCase?.CasePublishedState[0].createdAt)
		)
	});
};
