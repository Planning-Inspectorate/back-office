import _ from 'lodash';
import appealRepository from '../repositories/appeal.repository.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';
import formatAddressLowerCase from '../utils/address-formatter-lowercase.js';
import formatDate from '../utils/date-formatter.js';
import InspectorError from './inspector-error.js';
import transitionState from '../state-machine/household-appeal.machine.js';

const daysBetweenDates = function(firstDate, secondDate) {
	const oneDay = 24 * 60 * 60 * 1000;
	return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

const formatStatus = function(status) {
	switch (status) {
		case inspectorStatesStrings.site_visit_booked:
			return 'booked';
		case inspectorStatesStrings.decision_due:
			return 'decision due';
		case inspectorStatesStrings.site_visit_not_yet_booked:
			return 'not yet booked';
		default:
			throw new Error('Unknown status');
	}
};

const formatAppealForAllAppeals = function(appeal) {
	return {
		appealId: appeal.id,
		appealAge: daysBetweenDates(appeal.startedAt, new Date()),
		appealSite: formatAddressLowerCase(appeal.address),
		appealType: 'HAS',
		reference: appeal.reference,
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitDate: formatDate(appeal.siteVisit.visitDate) }),
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitSlot: appeal.siteVisit.visitSlot }),
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitType: appeal.siteVisit.visitType }),
		...(_.isEmpty(appeal.siteVisit) && { 
			provisionalVisitType: (appeal.lpaQuestionnaire.siteVisibleFromPublicLand || appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand) ? 
				'access required' : 'unaccompanied' 
		}),
		status: formatStatus(appeal.status),
	};
};

const validateUserId = function(userid) {
	if (userid == undefined) {
		throw new InspectorError('Must provide userid', 400);
	}
	return Number.parseInt(userid, 10);
};

const getAppeals = async function(request, response) {
	const userId = validateUserId(request.headers.userid);
	const appeals = await appealRepository.getByStatusesAndUserId([
		inspectorStatesStrings.site_visit_not_yet_booked,
		inspectorStatesStrings.site_visit_booked,
		inspectorStatesStrings.decision_due
	], userId);
	const appealsForResponse = appeals.map((appeal) => formatAppealForAllAppeals(appeal));
	return response.send(appealsForResponse);
};

const assignAppealsById = async function(userId, appealIds) {
	const successfullyAssigned = [];
	const unsuccessfullyAssigned = [];
	await Promise.all(appealIds.map(async (appealId) => {
		const appeal = await appealRepository.getById(appealId);
		if (appeal.userId == undefined && appeal.status == 'available_for_inspector_pickup') {
			const nextState = transitionState({ appealId: appeal.id }, appeal.status, 'PICKUP');
			await appealRepository.updateById(appeal.id, { status: nextState.value, userId: userId });
			successfullyAssigned.push(appeal.id);
		} else if (appeal.status != 'available_for_inspector_pickup') {
			unsuccessfullyAssigned.push({ appealId: appeal.id, reason: 'appeal in wrong state' });
		} else if (appeal.userId != undefined) {
			unsuccessfullyAssigned.push({ appealId: appeal.id, reason: 'appeal already assigned' });
		}
	}));
	return { successfullyAssigned: successfullyAssigned, unsuccessfullyAssigned: unsuccessfullyAssigned };
};

const validateAppealIdsPresent = function(body) {
	if (_.isEmpty(body)) {
		throw new InspectorError('Must provide appeals to assign', 400);
	}
};

const assignAppeals = async function(request, response) {
	const userId = validateUserId(request.headers.userid);
	validateAppealIdsPresent(request.body);
	const resultantAppeals = await assignAppealsById(userId, request.body);
	response.send(resultantAppeals);
};

export { getAppeals, assignAppeals };
