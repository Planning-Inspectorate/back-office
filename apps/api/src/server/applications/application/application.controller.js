import { filter, map } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { mapCaseDetails } from '../../utils/mapping/map-case-details.js';
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
 * @type {import('express').RequestHandler}
 */
export const updateApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const updateResponse = await caseRepository.updateApplication({
		caseId: Number.parseInt(request.params.id, 10),
		applicantId: request.body.applicant?.id,
		...mappedApplicationDetails
	});

	const updatedCase = getCaseAfterUpdate(updateResponse);

	const applicantIds = getServiceCustomerIds(updatedCase.serviceCustomer);

	response.send({ id: updatedCase.id, applicantIds });
};

/** 
 * @type {import('express').RequestHandler}
*/
export const getApplicationDetails = async (request, response) => {
	const getCaseDetails = await caseRepository.getById(
		Number.parseInt(request.params.id));
	
	// let mapCaseDetails = pick(getCaseDetails, ['id', 
	// 								'reference', 
	// 								'status', 
	// 								'title', 
	// 								'description', 
	// 								'ApplicationDetails',
	// 								'ApplicationDetails.subSector.sector', 
	// 								'ApplicationDetails.subSector',
	// 								'ApplicationDetails.regions',
	// 								'serviceCustomer'
	// 								]);

   response.send(mapCaseDetails(getCaseDetails))

};


