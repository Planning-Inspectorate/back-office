import { filter, head, map } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { transitionState } from '../../utils/transition-state.js';
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
 * @type {import('express').RequestHandler}
 */
export const createApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.createApplication(mappedApplicationDetails);

	const applicantIds = getServiceCustomerIds(application.serviceCustomer);

	response.send({ id: application.id, applicantIds });
};

/**
 *
 * @param {import('@pins/api').Schema.BatchPayload} updateResponse
 * @returns {import('@pins/api').Schema.Case}
 */
const getCaseAfterUpdate = (updateResponse) => {
	return filter(updateResponse, (result) => {
		return typeof result.id !== 'undefined';
	})[0];
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

	const updatedCase = getCaseAfterUpdate(updateResponse);

	const applicantIds = getServiceCustomerIds(updatedCase.serviceCustomer);

	response.send({ id: updatedCase.id, applicantIds });
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
 * @type {import('express').RequestHandler<{caseId: string, documentGUID: string }, ?, import('@pins/applications').UpdateDocumentStatus>}
 */
export const updateDocumentStatus = async ({ params, body }, response) => {
	const getDocumentDetails = await documentRepository.getByDocumentGUID(params.documentGUID);

	const getCaseById = await folderRepository.getById(getDocumentDetails?.folderId);

	const caseId = getCaseById?.caseId;

	const nextStatusInDocumentStateMachine = transitionState({
		caseType: 'document',
		status: getDocumentDetails?.status,
		machineAction: body.machineAction,
		context: {},
		throwError: true
	});

	const updatedDocumentStatus = nextStatusInDocumentStateMachine.value;

	const updateResponse = await documentRepository.updateDocumentStatus({
		guid: params.documentGUID,
		status: updatedDocumentStatus
	});

	response.send({ caseId, guid: updateResponse.guid, status: updateResponse.status });
};
