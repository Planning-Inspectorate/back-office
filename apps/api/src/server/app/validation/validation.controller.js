// eslint-disable-next-line import/no-unresolved
import got from 'got';
import appealRepository from '../repositories/appeal.repository.js';
import validationDecisionRepository from '../repositories/validation-decision.repository.js';
import ValidationError from './validation-error.js';
import { transitionState, appealStates } from '../state-machine/transition-state.js';
import { validationActionsStrings } from '../state-machine/validation-states.js';
import appealFormatter from './appeal-formatter.js';
import { nullIfUndefined } from '../utils/null-if-undefined.js';

const validationDecisions = {
	valid: 'valid',
	invalid: 'invalid',
	incomplete: 'incomplete'
};

const validationStatuses = [
	appealStates.received_appeal,
	appealStates.awaiting_validation_info
];

const getAppealDetails = async function (request, response) {
	const appeal = await appealRepository.getByIdWithValidationDecisionAndAddress(request.params.appealId);
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatusesWithAddresses(validationStatuses);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	response.send(formattedAppeals);
};

const updateAppeal = async function (request, response) {
	const appeal = await appealRepository.getByIdWithValidationDecisionAndAddress(request.params.appealId);
	const data = {
		...(request.body.AppellantName && { appellant: { update: { name: request.body.AppellantName } } }),
		...(request.body.Address && { address: { update: {
			addressLine1: nullIfUndefined(request.body.Address.AddressLine1),
			addressLine2: nullIfUndefined(request.body.Address.AddressLine2),
			town: nullIfUndefined(request.body.Address.Town),
			county: nullIfUndefined(request.body.Address.County),
			postcode: nullIfUndefined(request.body.Address.PostCode)
		} } }),
		...(request.body.LocalPlanningDepartment && { localPlanningDepartment: request.body.LocalPlanningDepartment } ),
		...(request.body.PlanningApplicationReference && { planningApplicationReference: request.body.PlanningApplicationReference })
	};
	await appealRepository.updateById(appeal.id, data);
	return response.send();
};

const submitValidationDecision = async function (request, response) {
	const appeal = await appealRepository.getByIdWithValidationDecisionAndAddress(request.params.appealId);
	const machineAction = mapAppealStatusToStateMachineAction(request.body.AppealStatus);
	const nextState = transitionState('household', { appealId: appeal.id }, appeal.status, machineAction);
	await appealRepository.updateStatusById(appeal.id, nextState.value);
	await validationDecisionRepository.addNewDecision(appeal.id, request.body.AppealStatus, request.body.Reason, request.body.descriptionOfDevelopment);
	return response.send();
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
const obtainLPAList = async function () {
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

/** @type {import('express').RequestHandler } */
const getLPAList = async function (_request, response) {
	const LPAList = await obtainLPAList();
	return response.send(LPAList);
};

export { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList };
