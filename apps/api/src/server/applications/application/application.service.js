import { EventType } from '@pins/event-client';
import { isArray, isEmpty, pick, pickBy } from 'lodash-es';
import * as caseRepository from '#repositories/case.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import { breakUpCompoundStatus } from '#utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '#utils/build-appeal-compound-status.js';
import { mapApplicationDetails } from '#utils/mapping/map-case-details.js';
import { transitionState } from '#utils/transition-state.js';
import BackOfficeAppError from '#utils/app-error.js';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';

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
 * @returns {Promise<import('@pins/applications.api').Schema.Case>}
 * @throws {Error}
 */
const verifyAllApplicationDetailsPresent = async (id) => {
	const caseDetails = await caseRepository.getById(id, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		casePublishedState: true,
		applicant: true,
		projectTeam: true,
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
 * This moves a case from draft into pre-application
 *
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

	await broadcastNsipProjectEvent(updatedCase, EventType.Update, { isCaseStart: true });

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
	casePublishedState: true,
	applicant: true,
	gridReference: true,
	hasUnpublishedChanges: true
};

/**
 *
 * @param {{subSector?: boolean | object, sector?: boolean | object, caseEmail?: boolean | object, keyDates?: boolean | object, geographicalInformation?: boolean | object, locationDescription?: boolean | object, regions?: boolean | object, status?: boolean | object, applicant?: boolean | object, hasUnpublishedChanges?: boolean, isMaterialChange: boolean }} query
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
		applicant: notFalseOrUndefined(query?.applicant),
		gridReference: notFalseOrUndefined(query.geographicalInformation),
		hasUnpublishedChanges: notFalseOrUndefined(query.hasUnpublishedChanges),
		isMaterialChange: notFalseOrUndefined(query?.isMaterialChange)
	};
};

/**
 *
 * @param {{subSector?: boolean | object, sector?: boolean | object, caseEmail?: boolean | object, keyDates?: boolean | object, geographicalInformation?: boolean | object, regions?: boolean | object, status?: boolean | object, applicant?: boolean | object, hasUnpublishedChanges?: boolean}} query
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
	const parsedQuery = !isEmpty(query) ? JSON.parse(query.query) : undefined;
	const modelsToInclude = findModelsToInclude(parsedQuery);

	const caseDetails = await caseRepository.getById(id, modelsToInclude);

	if (!caseDetails) {
		throw new BackOfficeAppError(`no case found with ID: ${id}`, 404);
	}

	const applicationDetailsFormatted = mapApplicationDetails(caseDetails);

	return typeof parsedQuery !== 'undefined'
		? filterOutResponse(parsedQuery, applicationDetailsFormatted)
		: applicationDetailsFormatted;
};

/**
 * @param {string} ref
 * @returns {Promise<object | null>}
 * */
export const getCaseByRef = async (ref) => {
	const caseDetails = await caseRepository.getByRef(ref);
	if (!caseDetails) {
		return null;
	}

	return mapApplicationDetails(caseDetails);
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
