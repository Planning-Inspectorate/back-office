import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import { submitValidationDecisionService, obtainLPAListService, updateAppealService } from './validation.service.js';

const validationStatuses = [
	appealStates.received_appeal,
	appealStates.awaiting_validation_info
];

const getAppealDetails = async function (request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, true, true, true);
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

const getAppeals = async function (_request, response) {
	const appeals = await appealRepository.getByStatuses(validationStatuses, true, true);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	response.send(formattedAppeals);
};

const updateAppeal = async function (request, response) {
	await updateAppealService(
		request.params.appealId, 
		request.body.AppellantName, 
		request.body.Address, 
		request.body.LocalPlanningDepartment,
		request.body.PlanningApplicationReference
	);
	return response.send();
};

const submitValidationDecision = async function (request, response) {
	await submitValidationDecisionService(request.params.appealId, request.body.AppealStatus, request.body.Reason, request.body.descriptionOfDevelopment);
	return response.send();
};

/** @type {import('express').RequestHandler } */
const getLPAList = async function (_request, response) {
	const LPAList = await obtainLPAListService();
	return response.send(LPAList);
};

export { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList };
