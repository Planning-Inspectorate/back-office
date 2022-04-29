// @ts-check

import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import * as caseOfficerService from './case-officer.service.js';
import formatAddressLowerCase from '../utils/address-formatter-lowercase.js';

/** @typedef {import('./case-officer.routes').AppealParams} AppealParams */

export const getAppeals = async function (_request, response) {
	const caseOfficerStatuses = [
		appealStates.awaiting_lpa_questionnaire,
		appealStates.overdue_lpa_questionnaire,
		appealStates.received_lpa_questionnaire,
		appealStates.incomplete_lpa_questionnaire,
	];
	const caseOfficerStatusesParallel = [
		appealStates.available_for_statements,
		appealStates.available_for_final_comments
	];
	const appeals = await appealRepository.getByStatuses(caseOfficerStatuses, true, true);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));

	const appealsParallel = await appealRepository.getByStatuses(caseOfficerStatusesParallel, true, true);
	const formattedParallelStateAppeals = appealsParallel.map((appealParallelStates) => appealFormatter.formatAppealForParallelStates(appealParallelStates));

	const allAppeals = Object.assign(formattedAppeals, formattedParallelStateAppeals);

	response.send(allAppeals);
};

export const getAppealDetails = async function (request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		address: true,
		latestLPAReviewQuestionnaire: true,
		lpaQuestionnaire: true
	});
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	return response.send(formattedAppeal);
};

export const getAppealDetailsForStatementsAndComments = async function(request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, { address: true });
	return response.send({
		id: appeal.id,
		reference: appeal.reference,
		appealSite: formatAddressLowerCase(appeal.address),
		localPlanningDepartment: appeal.localPlanningDepartment
	});
};

export const confirmLPAQuestionnaire = async function (request, response) {
	await caseOfficerService.confirmLPAQuestionnaireService(request.body.reason, request.params.appealId);
	return response.send();
};

/**
 * @typedef {object} UpdateAppealDetailsBody
 * @property {string} listedBuildingDescription
 */

/** @type {import('express').RequestHandler<AppealParams, ?, UpdateAppealDetailsBody>} */
export const updateAppealDetails = async ({ body, params }, response) => {
	await caseOfficerService.updateAppealDetails(params.appealId, body);

	const updatedAppeal = await appealRepository.getById(params.appealId, { lpaQuestionnaire: true });

	response.send(updatedAppeal);
};

export const uploadStatement = async function(request, response) {
	response.send();
};

export const uploadFinalComment = async function(request, response) {
	response.send();
};
