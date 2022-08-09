import { filter, map, pick, pickBy } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationDetails } from '../../utils/mapping/map-case-details.js';
import { mapCaseStatusString } from '../../utils/mapping/map-case-status-string.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';
import { startApplication } from './application.service.js';
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
		applicantId: body.applicant?.id,
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

const findModelsToInclude = (query) => {
	return {
		subSector: query.subSector,
		sector: query.sector,
		applicationDetails: query.keyDates !== false,
		zoomLevel: query.mapZoomLevel !== false,
		regions: query.regions !== false && typeof query !== 'undefined',
		caseStatus: query.status,
		serviceCustomer: query.applicant !== false && typeof query.applicant !== 'undefined',
		serviceCustomerAddress:
			query?.applicant?.address !== false && typeof query?.applicant?.address !== 'undefined',
		gridReference: query.gridReference !== false && typeof query.gridReference !== 'undefined'
	};
};

/**
 *
 * @type {import('express').RequestHandler}
 */
export const getApplicationDetails = async (request, response) => {
	const defaultModelsToInclude = {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		serviceCustomer: true,
		serviceCustomerAddress: true,
		gridReference: true
	};

	const modelsToInclude = request.query.query
		? findModelsToInclude(JSON.parse(request.query.query))
		: defaultModelsToInclude;

	const getCaseDetails = await caseRepository.getById(
		Number.parseInt(request.params.id, 10),
		modelsToInclude
	);

	const applicationDetailsFormatted = await mapApplicationDetails(getCaseDetails);

	if (request.query.query) {
		const findTruthyValues = pickBy({ id: true, ...JSON.parse(request.query.query) }, (value) => {
			return value;
		});
		const findKey = Object.keys(findTruthyValues);

		const detailsExtracted = pick(applicationDetailsFormatted, findKey);

		response.send(detailsExtracted);
	} else {
		response.send(applicationDetailsFormatted);
	}
};
