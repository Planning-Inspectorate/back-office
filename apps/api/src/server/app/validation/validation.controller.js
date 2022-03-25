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

const updateValidation = async function (request, response) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	const appeal = await getAppealForValidation(request.params.id);
	const data = {
		...(request.body.AppellantName && { appellantName: request.body.AppellantName }),
		...(request.body.Address && { address: { update: {
			addressLine1: request.body.Address.AddressLine1,
			addressLine2: request.body.Address.AddressLine2,
			addressLine3: request.body.Address.Town,
			addressLine4: request.body.Address.County,
			postcode: request.body.Address.PostCode
		} } }),
		...(request.body.LocalPlanningDepartment && { localPlanningDepartment: request.body.LocalPlanningDepartment } )
	};
	await appealRepository.updateById(appeal.id, data);
	return response.send();
};

const invalidWithoutReasons = function (body) {
	return (body.AppealStatus == 'invalid' &&
		body.Reason.NamesDoNotMatch !== true &&
		body.Reason.Sensitiveinfo !== true &&
		body.Reason.MissingOrWrongDocs !== true &&
		body.Reason.InflamatoryComments !== true &&
		body.Reason.OpenedInError !== true &&
		body.Reason.WrongAppealType !== true &&
		(body.Reason.OtherReasons == '' || body.Reason.OtherReasons == undefined)
	);
};

const incompleteWithoutReasons = function (body) {
	return (body.AppealStatus == 'incomplete' &&
		body.Reason.OutOfTime !== true &&
		body.Reason.NoRightOfappeal !== true &&
		body.Reason.NotAppealable !== true &&
		body.Reason.LPADeemedInvalid !== true &&
		(body.Reason.OtherReasons == '' || body.Reason.OtherReasons == undefined)
	);
};

const appealValidated = async function (request, response) {
	if (invalidWithoutReasons(request.body)) {
		throw new ValidationError('Invalid Appeal require a reason', 400);
	}
	if (incompleteWithoutReasons(request.body)) {
		throw new ValidationError('Incomplete Appeal require a reason', 400);
	}
	const appeal = await getAppealForValidation(request.params.id);
	const machineAction = mapAppealStatusToStateMachineAction(request.body.AppealStatus);
	const nextState = household_appeal_machine.transition(appeal.status, machineAction);
	await appealRepository.updateStatusById(appeal.id, nextState.value);
	return response.send();
};

/**
 * @param {string} status status change action received in request
 * @returns {string} status change as expected by state machine
 */
function mapAppealStatusToStateMachineAction(status) {
	switch (status) {
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
