/* eslint-disable complexity */
/* eslint-disable unicorn/prefer-ternary */
import { validationResult } from 'express-validator';
import appealRepository from '../repositories/appeal.repository.js';
import ValidationError from './validation-error.js';
import household_appeal_machine from '../state-machine/household-appeal.machine.js';
import { validation_states_strings, validation_actions_strings } from '../state-machine/validation-states.js';
import appealFormatter from './appeal-formatter.js';

const validationStatuses = [
	validation_states_strings.received_appeal,
	validation_states_strings.awaiting_validation_info
];

const getAppealToValidate = async function (request, response) {
	const appeal = await getAppealForValidation(request.params.id);
	const formattedAppeal = await appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const getValidation = async function (_request, response) {
	const appeals = await appealRepository.getByStatuses(validationStatuses);
	const formattedAppeals = await Promise.all(appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal)));
	response.send(formattedAppeals);
};

const updateValidation = function (request, response) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	return response.send();
};

const invalidWithoutReasons =  function (request ) {
	return (request.body.AppealStatus == 'invalid' &&
	request.body.Reason.NamesDoNotMatch !== true &&
	request.body.Reason.Sensitiveinfo !== true &&
	request.body.Reason.MissingOrWrongDocs !== true &&
	request.body.Reason.InflamatoryComments !== true &&
	request.body.Reason.OpenedInError !== true &&
	request.body.Reason.WrongAppealType !== true &&
	(request.body.Reason.OtherReasons == '' || request.body.Reason.OtherReasons == undefined)
	) || (request.body.AppealStatus == 'incomplete' &&
	request.body.Reason.OutOfTime !== true &&
	request.body.Reason.NoRightOfappeal !== true &&
	request.body.Reason.NotAppealable !== true &&
	request.body.Reason.LPADeemedInvalid !== true &&
	(request.body.Reason.OtherReasons == '' || request.body.Reason.OtherReasons == undefined)
	);
};

const appealValidated = async function (request, response) {
	if (invalidWithoutReasons(request)) {
		throw new ValidationError('Invalid or Incomplete Appeal require a reason', 400);
	}
	const appeal = await getAppealForValidation(request.params.id);
	const machineAction = mapAppealStatusToStateMachineAction(request.body.AppealStatus);
	const nextState = household_appeal_machine.transition(appeal.state, machineAction);
	await appealRepository.updateStatusById(appeal.id, nextState.value);
	return response.send();


};

/**
 * @param {string} status status change action received in request
 * @returns {string} status change as expected by state machine
 */
function mapAppealStatusToStateMachineAction(status) {
	switch(status) {
		case 'valid':
			return validation_actions_strings.valid;
		case 'invalid':
			return validation_actions_strings.invalid;
		case 'info missing':
			return validation_actions_strings.information_missing;
		default:
			throw new ValidationError('Unknown AppealStatus', 400);
	}
}

/**
 * @param {string} appealId appeal ID
 * @returns {object} appeal with given ID
 */
async function getAppealForValidation(appealId) {
	const appeal = await appealRepository.getById(Number.parseInt(appealId, 10));
	if (!validationStatuses.includes(appeal.status)) {
		throw new ValidationError('Appeal does not require validation', 400);
	}
	return appeal;
}

export { getValidation, getAppealToValidate, updateValidation, appealValidated };
