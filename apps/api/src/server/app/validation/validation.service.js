import got from 'got';
import appealRepository from '../repositories/appeal.repository.js';
import validationDecisionRepository from '../repositories/validation-decision.repository.js';
import { appealStates, transitionState } from '../state-machine/transition-state.js';
import { validationActionsStrings } from '../state-machine/validation-states.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import { breakUpCompoundStatus } from '../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../utils/build-appeal-compound-status.js';
import { nullIfUndefined } from '../utils/null-if-undefined.js';
import ValidationError from './validation-error.js';

const validationDecisions = {
	valid: 'valid',
	invalid: 'invalid',
	incomplete: 'incomplete'
};

/**
 * @param {string} status status change action received in request
 * @returns {string} status change as expected by state machine
 */
function mapAppealStatusToStateMachineAction(status) {
	switch (status) {
		case validationDecisions.valid:
			return validationActionsStrings.valid;
		case validationDecisions.invalid:
			return validationActionsStrings.invalid;
		case validationDecisions.incomplete:
			return validationActionsStrings.information_missing;
		default:
			throw new ValidationError('Unknown AppealStatus', 400);
	}
}

// @ts-ignore
export const submitValidationDecisionService = async (appealId, appealStatus, reason, descriptionOfDevelopment) => {
	const appeal = await appealRepository.getById(appealId, {
		appellant: true,
		validationDecision: true,
		address: true
	});
	const machineAction = mapAppealStatusToStateMachineAction(appealStatus);
	const appealStatusForMachine = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState(appeal.appealType.type, { appealId: appeal.id }, appealStatusForMachine, machineAction);
	const newState = breakUpCompoundStatus(nextState.value, appeal.id);
	const newData = newState === appealStates.awaiting_lpa_questionnaire ||
		// @ts-ignore
		arrayOfStatusesContainsString(newState, [appealStates.awaiting_lpa_questionnaire]) ?
		{ startedAt: new Date() } : {};

	await appealRepository.updateStatusAndDataById(appeal.id, newState, newData, appeal.appealStatus);
	await validationDecisionRepository.addNewDecision(appeal.id, appealStatus, reason, descriptionOfDevelopment);
};

/**
 * @typedef {object} LocalPlanningDepartmentResponse
 * @property {LocalPlanningDepartment[]} features - A collection of requested LPAs in schema format.
 * @typedef {object} LocalPlanningDepartment
 * @property {object} attributes - A dictionary of request attributes
 * @property {string} attributes.LPA21NM - The name of the local planning department
 */

/**
 * Fetch a list of planning departments from the remote arcgis service.
 *
 * @returns {Promise<string[]>} - A list of local planning department names.
 */
export const obtainLPAListService = async () => {
	const { body } = await /** @type {Promise<import('got').Response<LocalPlanningDepartmentResponse>>} */ (
		got.get('https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LPA_APR_2021_UK_NC/FeatureServer/0/query', {
			responseType: 'json',
			searchParams: {
				where: '1=1',
				outFields: 'LPA21NM',
				outSR: 4326,
				f: 'json'
			}
		})
	);

	return body.features.map((feature) => feature.attributes.LPA21NM);
};

// @ts-ignore
export const updateAppealService = async (appealId, appellantName, address, localPlanningDepartment, planningApplicationReference) => {
	const appeal = await appealRepository.getById(appealId);
	const data = {
		...(appellantName && { appellant: { update: { name: appellantName } } }),
		...(address && { address: { update: {
			addressLine1: nullIfUndefined(address.AddressLine1),
			addressLine2: nullIfUndefined(address.AddressLine2),
			town: nullIfUndefined(address.Town),
			county: nullIfUndefined(address.County),
			postcode: nullIfUndefined(address.PostCode)
		} } }),
		...(localPlanningDepartment && { localPlanningDepartment } ),
		...(planningApplicationReference && { planningApplicationReference })
	};

	await appealRepository.updateById(appeal.id, data);
};
