import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import { filter, head, map } from 'lodash-es';
import fs from 'node:fs';
import * as caseRepository from '../../repositories/case.repository.js';
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
 * @type {import('express').RequestHandler}
 */
// @ts-ignore
export const createTimetable = async (request, response) => {
	const credential = new AzureKeyCredential('');
	const client = new DocumentAnalysisClient(
		'https://form-recognizer-pins-dev.cognitiveservices.azure.com/',
		credential
	);

	// Form Recognizer supports many different types of files.
	const file = fs.createReadStream('rule8.pdf');

	const poller = await client.beginAnalyzeDocument('prebuilt-layout', file, {
		// The timetable is actually spread across pages 7-30, but:
		// "with a free tier subscription, only the first two pages are processed with a free tier subscription, only the first two pages are processed"
		// source: https://learn.microsoft.com/en-gb/azure/applied-ai-services/form-recognizer/concept-general-document?view=form-recog-3.0.0#input-requirements
		pages: '7-9'
	});

	const result = await poller.pollUntilDone();

	const timetable = getResults(result);

	response.send({ timetable });
};

// @ts-ignore
const getResults = (result) => {
	// @ts-ignore
	const cells = result.tables.flatMap((t) => t.cells).filter((c) => c.kind !== 'columnHeader');

	let temporaryResult = null;

	const results = [];

	for (const cell of cells) {
		switch (cell.columnIndex) {
			case 0:
				if (temporaryResult) {
					results.push(getItem(temporaryResult));
				}

				temporaryResult = {
					item: cell.content,
					content: '',
					date: ''
				};
				break;
			case 1:
				// @ts-ignore
				temporaryResult.content += cell.content;
				break;
			case 2:
				// @ts-ignore
				temporaryResult.date += cell.content;
				break;
			default:
				throw new Error('Unexpected column index');
		}
	}

	results.push(getItem(temporaryResult));

	return results;
};

// @ts-ignore
const getItem = (rawItem) => {
	// @ts-ignore
	const splitContent = rawItem.content.split('•');

	return {
		// @ts-ignore
		item: rawItem.item,
		// @ts-ignore
		date: new Date(rawItem.date),
		// @ts-ignore
		description: splitContent[0].includes('Deadline') ? splitContent[0].trim() : rawItem.content,
		// @ts-ignore
		lineItems: splitContent[0].includes('Deadline')
			? splitContent.slice(1).map((sc) => sc.trim())
			: [],
		// @ts-ignore
		type: splitContent[0].includes('Deadline') ? 'Deadline' : 'Other'
	};
};
