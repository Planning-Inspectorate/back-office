import { validationResult } from 'express-validator';
import appealRepository from '../repositories/appeal.repository.js';
import addressRepository from '../repositories/address.repository.js';
import formatDate from '../utils/date-formatter.js';
import formatAddress from '../utils/address-formatter.js';
import ValidationError from './validation-error.js';
import household_appeal_machine from '../state-machine/household-appeal.machine.js';
import { response } from 'express';

const validationStatuses = ['received_appeal', 'awaiting_validation_info'];

const getAppealToValidate = async function (request, response) {
	const appeal = await appealRepository.getById(Number.parseInt(request.params.id, 10));
	if (!validationStatuses.includes(appeal.status)) {
		throw new ValidationError('Appeal does not require validation', 400);
	}
	const formattedAppeal = await formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

/**
 * @param {object} appeal appeal
 */
async function formatAppealForAppealDetails(appeal) {
	const address = await addressRepository.getById(appeal.addressId);
	const addressAsString = formatAddress(address);
	const appealStatus = mapAppealStatus(appeal.status);
	return {
		AppealId: appeal.id,
		AppealReference: appeal.reference,
		AppellantName: appeal.appellantName,
		AppealStatus: appealStatus,
		Received: formatDate(appeal.createdAt),
		AppealSite: addressAsString,
		LocalPlanningDepartment: appeal.localPlanningDepartment,
		PlanningApplicationReference: appeal.planningApplicationReference,
		Documents: [
			{
				Type: 'planning application form',
				Filename: 'planning-application.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'decision letter',
				Filename: 'decision-letter.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'appeal statement',
				Filename: 'appeal-statement.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-1.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-2.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-3.pdf',
				URL: 'localhost:8080'
			}
		]
	};
}

const getValidation = async function (_request, response) {
	const appeals = await appealRepository.getByStatuses(validationStatuses);
	const formattedAppeals = await Promise.all(appeals.map((appeal) => formatAppealForAllAppeals(appeal)));
	response.send(formattedAppeals);
};

/**
 * @param {object} appeal appeal that requires formatting for the getValidation controller
 * @returns {object} appeal as a hash
 */
async function formatAppealForAllAppeals(appeal) {
	const address = await addressRepository.getById(appeal.addressId);
	const addressAsString = formatAddress(address);
	const appealStatus = mapAppealStatus(appeal.status);
	return {
		AppealId: appeal.id,
		AppealReference: appeal.reference,
		AppealStatus: appealStatus,
		Received: formatDate(appeal.createdAt),
		AppealSite: addressAsString
	};
}

/**
 * @param {string} status appeal status
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(status) {
	return status == 'received_appeal' ? 'new' : 'incomplete';
}

const updateValidation = function (request, response) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	}
	return response.send();
};

const appealValidated = async function (request, response) {
	const appeal = await appealRepository.getById(Number.parseInt(request.params.id, 10));
	if (!validationStatuses.includes(appeal.status)) {
		throw new ValidationError('Appeal does not require validation', 400);
	}
	const machineAction = mapAppealStatusToStateMachineAction(request.body.AppealStatus);
	const nextState = household_appeal_machine.transition(appeal.state, machineAction);
	await appealRepository.updateStatusById(appeal.id, nextState.value);
	return response.send();
};

function mapAppealStatusToStateMachineAction(status) {
	switch(status) {
		case 'valid':
			return 'VALID';
		default:
			throw new ValidationError('Unknown AppealStatus', 400);
	}
}

export { getValidation, getAppealToValidate, updateValidation, appealValidated };
