import { filter, head, map, pick } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import { getStorageLocation } from '../../utils/document-storage-api-client.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
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
 *
 * @type {import('express').RequestHandler<any, ?, ?, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documents = body[''];

	const caseFromDatabase = await caseRepository.getById(params.id, {});

	const documentsToSendToDatabase = documents.map(
		(/** @type {{ documentName: any; folderId: any; }} */ document) => {
			return { name: document.documentName, folderId: document.folderId };
		}
	);

	const documentsFromDatabase = await Promise.all(
		documentsToSendToDatabase.map(
			(/** @type {{ name: string; folderId: number; }} */ documentToDatabase) => {
				return documentRepository.upsert(documentToDatabase);
			}
		)
	);

	const requestToDocumentStorage = documentsFromDatabase.map((document) => {
		return {
			caseType: 'application',
			caseReference: caseFromDatabase?.reference,
			GUID: document.guid,
			documentName: document.name
		};
	});

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	await Promise.all(
		responseFromDocumentStorage.documents.map((documentWithPath) => {
			return documentRepository.update(documentWithPath.GUID, {
				blobStorageContainer: responseFromDocumentStorage.blobStorageContainer,
				blobStoragePath: documentWithPath.blobStoreUrl
			});
		})
	);

	const documentsWithUrls = responseFromDocumentStorage.documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	response.send({
		blobStorageHost: responseFromDocumentStorage.blobStorageHost,
		blobStorageContainer: responseFromDocumentStorage.blobStorageContainer,
		documents: documentsWithUrls
	});
};
