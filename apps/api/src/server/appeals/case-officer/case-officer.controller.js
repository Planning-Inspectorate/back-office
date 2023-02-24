// @ts-check

import appealRepository from '../../repositories/appeal.repository.js';
import formatAddress from '../../utils/address-formatter.js';
import { arrayOfStatusesContainsString } from '../../utils/array-of-statuses-contains-string.js';
import { appealStates } from '../../utils/transition-state.js';
import appealFormatter from './appeal-formatter.js';
import * as caseOfficerService from './case-officer.service.js';

/** @typedef {import('./case-officer.routes').AppealParams} AppealParams */

/**
 * Express request handler function to get all appeals for a case officer.
 *
 * @type {import('express').RequestHandler}
 */
export const getAppeals = async (request, response) => {
	const caseOfficerStatuses = [
		appealStates.awaiting_lpa_questionnaire,
		appealStates.overdue_lpa_questionnaire,
		appealStates.received_lpa_questionnaire,
		appealStates.incomplete_lpa_questionnaire
	];
	const caseOfficerStatusesParallel = [
		appealStates.available_for_statements,
		appealStates.available_for_final_comments
	];
	const appeals = await appealRepository.getByStatuses({
		statuses: caseOfficerStatuses,
		includeAddress: true,
		includeAppellant: true
	});
	const formattedAppeals = appeals.map((appeal) =>
		appealFormatter.formatAppealForAllAppeals(appeal)
	);

	const appealsParallel = await appealRepository.getByStatuses({
		statuses: caseOfficerStatusesParallel,
		includeAddress: true,
		includeAppellant: true
	});
	const formattedParallelStateAppeals = appealsParallel.map((appealParallelStates) =>
		appealFormatter.formatAppealForParallelStates(appealParallelStates)
	);

	const allAppeals = [...formattedAppeals, ...formattedParallelStateAppeals];

	response.send(allAppeals);
};

/**
 * Asynchronous function to handle Express requests for getting all appeals for a case officer.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const getAppealDetails = async (request, response) => {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		address: true,
		latestLPAReviewQuestionnaire: true,
		lpaQuestionnaire: true
	});
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);

	return response.send(formattedAppeal);
};

/**
 * Asynchronous function to handle Express requests for getting all appeals for a case officer.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const getAppealDetailsForStatementsAndComments = async (request, response) => {
	const appeal = await appealRepository.getById(Number.parseInt(request.params.appealId, 10), {
		address: true
	});

	return response.send({
		AppealId: appeal.id,
		AppealReference: appeal.reference,
		AppealSite: formatAddress(appeal.address),
		LocalPlanningDepartment: appeal.localPlanningDepartment,
		acceptingStatements: arrayOfStatusesContainsString(appeal.appealStatus, [
			appealStates.available_for_statements
		]),
		acceptingFinalComments: arrayOfStatusesContainsString(appeal.appealStatus, [
			appealStates.available_for_final_comments
		])
	});
};

/**
 * Asynchronous function to handle Express requests for getting all appeals for a case officer.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const confirmLPAQuestionnaire = async (request, response) => {
	await caseOfficerService.confirmLPAQuestionnaireService(
		request.body.reason,
		Number.parseInt(request.params.appealId, 10)
	);

	return response.send();
};

/**
 * @typedef {object} UpdateAppealDetailsBody
 * @property {string} listedBuildingDescription
 */
/** @type {import('express').RequestHandler<AppealParams, object, UpdateAppealDetailsBody>} */
export const updateAppealDetails = async ({ body, params }, response) => {
	await caseOfficerService.updateAppealDetails(params.appealId, body);

	const updatedAppeal = await appealRepository.getById(params.appealId, { lpaQuestionnaire: true });

	response.send(updatedAppeal);
};

/**
 * @type {import('express').RequestHandler}
 */
export const uploadStatement = async (request, response) => {
	const appeal = await appealRepository.getById(Number.parseInt(request.params.appealId, 10));

	response.send(appealFormatter.formatAppealForAfterStatementUpload(appeal));
};

/**
 * @type {import('express').RequestHandler}
 */
export const uploadFinalComment = async (request, response) => {
	const appeal = await appealRepository.getById(Number.parseInt(request.params.appealId, 10));

	response.send(appealFormatter.formatAppealAfterFinalCommentUpload(appeal));
};
