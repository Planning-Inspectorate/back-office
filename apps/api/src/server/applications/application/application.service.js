import { isArray, isEmpty } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { breakUpCompoundStatus } from '../../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../../utils/build-appeal-compound-status.js';
import { transitionState } from '../../utils/transition-state.js';

/**
 *
 * @param {Object<any, string>} errors
 * @param {string | number | object[] | undefined | null} field
 * @param {string} fieldName
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
 */
const verifyAllApplicationDetailsPresent = async (id) => {
	const caseDetails = await caseRepository.getById(id, {
		applicationDetails: true,
		caseStatus: true,
		regions: true
	});

	if (caseDetails === null) {
		throw new StartApplicationError('Not able to obtain case', 500);
	}

	const errors = {};

	addErrorIfMissing(errors, caseDetails?.title, 'title');
	addErrorIfMissing(errors, caseDetails?.description, 'description');
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.subSectorId, 'subSector');
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.zoomLevelId, 'mapZoomLevel');
	addErrorIfMissing(errors, caseDetails?.ApplicationDetails?.regions, 'regions');

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
		caseDetails.id
	);

	await caseRepository.updateApplicationStatusAndDataById(caseDetails.id, {
		status: nextStatusForRepository,
		data: {},
		currentStatuses: caseDetails.CaseStatus,
		setReference: true
	});

	const updatedCase = await caseRepository.getById(caseDetails.id);

	return {
		id: updatedCase?.id,
		reference: updatedCase?.reference,
		status: nextStatusInStateMachine.value
	};
};
