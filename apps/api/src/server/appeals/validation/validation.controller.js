import appealRepository from '../../repositories/appeal.repository.js';
import { appealStates } from '../../utils/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import {
	obtainLPAListService,
	submitValidationDecisionService,
	updateAppealService
} from './validation.service.js';

const validationStatuses = [appealStates.received_appeal, appealStates.awaiting_validation_info];

const getAppealDetails = async (request, response) => {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		validationDecision: true,
		address: true
	});
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);

	return response.send(formattedAppeal);
};

const getAppeals = async (_request, response) => {
	const appeals = await appealRepository.getByStatuses({
		statuses: validationStatuses,
		includeAddress: true,
		includeAppellant: true
	});
	const formattedAppeals = appeals.map((appeal) =>
		appealFormatter.formatAppealForAllAppeals(appeal)
	);

	response.send(formattedAppeals);
};

const updateAppeal = async (request, response) => {
	await updateAppealService({
		appealId: request.params.appealId,
		appellantName: request.body.AppellantName,
		address: request.body.Address,
		localPlanningDepartment: request.body.LocalPlanningDepartment,
		planningApplicationReference: request.body.PlanningApplicationReference
	});
	return response.send();
};

const submitValidationDecision = async (request, response) => {
	await submitValidationDecisionService(
		request.params.appealId,
		request.body.AppealStatus,
		request.body.Reason,
		request.body.descriptionOfDevelopment
	);
	return response.send();
};

/** @type {import('express').RequestHandler } */
const getLPAList = async (_request, response) => {
	const LPAList = await obtainLPAListService();

	return response.send(LPAList);
};

export { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList };
