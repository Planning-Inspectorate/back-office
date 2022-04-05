// eslint-disable-next-line import/no-unresolved
import got from 'got';
import appealRepository from '../repositories/appeal.repository.js';
import validationDecisionRepository from '../repositories/validation-decision.repository.js';
import ValidationError from './validation-error.js';
import transitionState from '../state-machine/household-appeal.machine.js';
import { validationStatesStrings, validationActionsStrings } from '../state-machine/validation-states.js';
import appealFormatter from './appeal-formatter.js';
import { validationDecisions, validateAppealValidatedRequest, validateUpdateValidationRequest } from './validate-request.js';

const validationStatuses = [
	validationStatesStrings.received_appeal,
	validationStatesStrings.awaiting_validation_info
];

const getAppealDetails = async function (request, response) {
	const appeal = await getAppealForValidation(request.params.id);
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatusesWithAddresses(validationStatuses);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	response.send(formattedAppeals);
};

const nullIfUndefined = function(value) {
	// eslint-disable-next-line unicorn/no-null
	return value || null;
};

const updateAppeal = async function (request, response) {
	validateUpdateValidationRequest(request);
	const appeal = await getAppealForValidation(request.params.id);
	const data = {
		...(request.body.AppellantName && { appellantName: request.body.AppellantName }),
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
	validateAppealValidatedRequest(request.body);
	const appeal = await getAppealForValidation(request.params.id);
	const machineAction = mapAppealStatusToStateMachineAction(request.body.AppealStatus);
	const nextState = transitionState({ appealId: appeal.id }, appeal.status, machineAction);
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
 * @param {string} appealId appeal ID
 * @returns {object} appeal with given ID
 */
async function getAppealForValidation(appealId) {
	const appeal = await appealRepository.getByIdWithValidationDecisionAndAddress(Number.parseInt(appealId, 10));
	if (!validationStatuses.includes(appeal.status)) {
		throw new ValidationError('Appeal does not require validation', 400);
	}
	return appeal;
}

const obtainLPAList = async function() {
	const dataRaw = await got.get('https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LPA_APR_2021_UK_NC/FeatureServer/0/query?where=1%3D1&outFields=LPA21NM&outSR=4326&f=json');
	return dataRaw.json().features.map((lpas) => lpas.attributes.LPA21NM);
};

const getLPAList = async function(_request, response) {
	const LPAList = await obtainLPAList();
	return response.send(LPAList);
};

export { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList };
