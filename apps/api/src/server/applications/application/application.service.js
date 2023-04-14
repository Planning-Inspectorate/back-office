import { EventType } from '@pins/event-client';
import { isArray, isEmpty, pick, pickBy } from 'lodash-es';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_PROJECT } from '../../infrastructure/topics.js';
import * as caseRepository from '../../repositories/case.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import * as representationsRepository from '../../repositories/representation.repository.js';
import { breakUpCompoundStatus } from '../../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../../utils/build-appeal-compound-status.js';
import { mapApplicationDetails } from '../../utils/mapping/map-case-details.js';
import { transitionState } from '../../utils/transition-state.js';
import { buildNsipProjectPayload } from './application.js';

/**
 *
 * @param {Object<any, string>} errors
 * @param {string | number | object[] | undefined | null} field
 * @param {string} fieldName
 * @returns {void}
 */
const addErrorIfMissing = (errors, field, fieldName) => {
	if (field === null || typeof field === 'undefined' || (isArray(field) && isEmpty(field))) {
		errors[fieldName] = `Missing ${fieldName}`;
	}
};

class StartApplicationError extends Error {
	/**
	 * @param {string} message
	 * @param {number} code
	 */
	constructor(message, code) {
		super(message);
		this.code = code;
	}
}

/**
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.Case>}
 * @throws {Error}
 */
const verifyAllApplicationDetailsPresent = async (id) => {
	const caseDetails = await caseRepository.getById(id, {
		applicationDetails: true,
		caseStatus: true,
		regions: true,
		subSector: true,
		sector: true,
		gridReference: true
	});

	if (caseDetails === null) {
		throw new StartApplicationError('Not able to obtain case', 500);
	}

	const errors = {};

	addErrorIfMissing(errors, caseDetails?.title, 'title');
	addErrorIfMissing(errors, caseDetails?.description, 'description');
	addErrorIfMissing(
		errors,
		caseDetails?.ApplicationDetails?.locationDescription,
		'projectLocation'
	);
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.subSectorId, 'subSector');
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.subSector?.sectorId, 'sector');
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.regions, 'regions');
	addErrorIfMissing(errors, caseDetails?.gridReference?.easting, 'gridReferenceEasting');
	addErrorIfMissing(errors, caseDetails?.gridReference?.northing, 'gridReferenceNorthing');

	if (!isEmpty(errors)) {
		throw new StartApplicationError(JSON.stringify(errors), 400);
	}

	return caseDetails;
};

/**
 * @param {number} id
 * @returns {Promise<{id: number | undefined, reference: string | null | undefined, status: import('xstate').StateValue}>}
 */
export const startApplication = async (id) => {
	const caseDetails = await verifyAllApplicationDetailsPresent(id);

	const applicationStatus = buildAppealCompundStatus(caseDetails?.CaseStatus);

	const nextStatusInStateMachine = transitionState({
		caseType: 'application',
		status: applicationStatus,
		machineAction: 'START',
		context: {},
		throwError: true
	});

	const nextStatusForRepository = breakUpCompoundStatus(
		nextStatusInStateMachine.value,
		caseDetails.id.toString()
	);

	const updatedCase = await caseRepository.updateApplicationStatusAndDataById(
		caseDetails.id,
		caseDetails.ApplicationDetails?.id,
		{
			status: nextStatusForRepository,
			data: {},
			currentStatuses: caseDetails.CaseStatus,
			setReference: true
		},
		folderRepository.createFolders(caseDetails.id)
	);

	if (!updatedCase) {
		throw new Error('Case does not exist');
	}

	await eventClient.sendEvents(
		NSIP_PROJECT,
		[buildNsipProjectPayload(caseDetails)],
		EventType.Update
	);

	return {
		id: updatedCase.id,
		reference: updatedCase?.reference,
		status: nextStatusInStateMachine.value
	};
};

/**
 *
 * @param {any} value
 * @returns {boolean}
 */
const notFalseOrUndefined = (value) => {
	return value !== false && typeof value !== 'undefined';
};

const defaultInclusions = {
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

/**
 *
 * @param {{subSector?: boolean | object, sector?: boolean | object, caseEmail?: boolean | object, keyDates?: boolean | object, geographicalInformation?: boolean | object, locationDescription?: boolean | object, regions?: boolean | object, status?: boolean | object, applicants?: boolean | object, applicantsAddress?: boolean | object}} query
 * @returns {object}
 */
const inclusionsUsingQuery = (query) => {
	return {
		subSector: notFalseOrUndefined(query?.subSector) || notFalseOrUndefined(query?.sector),
		sector: notFalseOrUndefined(query?.sector),
		applicationDetails:
			notFalseOrUndefined(query?.keyDates) ||
			notFalseOrUndefined(query?.geographicalInformation) ||
			notFalseOrUndefined(query?.caseEmail),
		zoomLevel: notFalseOrUndefined(query?.geographicalInformation),
		regions:
			notFalseOrUndefined(query?.regions) || notFalseOrUndefined(query?.geographicalInformation),
		caseStatus: query?.status,
		serviceCustomer: notFalseOrUndefined(query?.applicants),
		serviceCustomerAddress: notFalseOrUndefined(query?.applicantsAddress),
		gridReference: notFalseOrUndefined(query.geographicalInformation)
	};
};

/**
 *
 * @param {{subSector?: boolean | object, sector?: boolean | object, caseEmail?: boolean | object, keyDates?: boolean | object, geographicalInformation?: boolean | object, regions?: boolean | object, status?: boolean | object, applicants?: boolean | object, applicantsAddress?: boolean | object}} query
 * @returns {object}
 */
const findModelsToInclude = (query) => {
	return typeof query === 'undefined' ? defaultInclusions : inclusionsUsingQuery(query);
};

/**
 *
 * @param {object} parsedQuery
 * @param {object} applicationDetailsFormatted
 * @returns {object}
 */
const filterOutResponse = (parsedQuery, applicationDetailsFormatted) => {
	const findTruthyValues = pickBy({ id: true, ...parsedQuery }, (value) => {
		return value !== false;
	});

	const findKey = Object.keys(findTruthyValues);

	return pick(applicationDetailsFormatted, findKey);
};

/**
 *
 * @param {number} id
 * @param {{query?: any}} query
 * @returns {Promise<object>}
 */
export const getCaseDetails = async (id, query) => {
	let emptyQuery;

	const parsedQuery = !isEmpty(query) ? JSON.parse(query.query) : emptyQuery;
	const modelsToInclude = findModelsToInclude(parsedQuery);
	const caseDetails = await caseRepository.getById(id, modelsToInclude);

	const applicationDetailsFormatted = mapApplicationDetails(caseDetails);

	return typeof parsedQuery !== 'undefined'
		? filterOutResponse(parsedQuery, applicationDetailsFormatted)
		: applicationDetailsFormatted;
};

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {{searchTerm: string?, filters: Record<string, string[] | boolean>?, sort: object[]?}} filterAndSort
 * @returns {Promise<{ count: number, items: any[]}>}
 */
export const getCaseRepresentations = async (caseId, pagination, filterAndSort) => {
	return representationsRepository.getByCaseId(caseId, pagination, filterAndSort);
};

/**
 *
 * @param {number} caseId
 * @param {number} repId
 * @returns {Promise<object>}
 */
export const getCaseRepresentation = async (caseId, repId) => {
	return representationsRepository.getById(repId, caseId);
};

/**
 *
 * @param {string | any } status
 * @param {string} machineAction
 * @returns {import('xstate').StateValue}
 */
export const nextStatusInDocumentStateMachine = (status, machineAction) => {
	const nextStatus = transitionState({
		caseType: 'document',
		status,
		machineAction,
		context: {},
		throwError: true
	});

	return nextStatus.value;
};

/**
 *
 * @param {number | any} caseId
 * @param {string} guid
 * @param {string} status
 * @returns {Record<string, any>} An object containing the formatted case ID, GUID, and status.
 */
export const formatResponseBody = (caseId, guid, status) => {
	return { caseId, guid, status };
};
