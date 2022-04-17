import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import { nullIfUndefined } from '../utils/null-if-undefined.js';
import { submitValidationDecisionService, obtainLPAListService } from './validation.service.js';

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
	submitValidationDecisionService(appeal, request.body.AppealStatus, request.body.Reason, request.body.descriptionOfDevelopment);
	return response.send();
};

/** @type {import('express').RequestHandler } */
const getLPAList = async function (_request, response) {
	const LPAList = await obtainLPAListService();
	return response.send(LPAList);
};

export { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList };
