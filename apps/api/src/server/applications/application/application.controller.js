import { filter, head, map, pick } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { getStorageLocation } from '../../utils/document-storage-api-client.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { getCaseDetails, getFolderDetails, startApplication } from './application.service.js';
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
 *
 * @type {import('express').RequestHandler<{ id: number }, ?, ?, any>}
 */
export const getListOfDocuments = async ({ params }, response) => {
	const folderDetails = await getFolderDetails(params.id);

	response.send(folderDetails);
};

/**
 *
 * @type {import('express').RequestHandler<any, ?, ?, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const caseFromDatabase = await caseRepository.getById(params.id, {});

	// TODO: Here we are going to add document records to the database

	const requestToDocumentStorage = body[''].map(
		(
			/** @type {{ caseType: string; caseReference: string | null | undefined; GUID: string; }} */ document
		) => {
			document.caseType = 'application';
			document.caseReference = caseFromDatabase?.reference;
			document.GUID = '';
			return document;
		}
	);

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	const documentsWithUrls = responseFromDocumentStorage.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	// TODO: get blob store host and container from document storage api
	response.send({ blobStorageHost: '', blobStorageContainer: '', documents: documentsWithUrls });
};
