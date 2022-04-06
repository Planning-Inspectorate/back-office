import _ from 'lodash';
import appealRepository from '../repositories/appeal.repository.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';
import formatAddressLowerCase from '../utils/address-formatter-lowercase.js';
import formatDate from '../utils/date-formatter.js';

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
		status: formatStatus(appeal.status)
	};
};

const getAppeals = async function(request, response) {
	const appeals = await appealRepository.getByStatusesAndUserId([
		inspectorStatesStrings.site_visit_not_yet_booked,
		inspectorStatesStrings.site_visit_booked,
		inspectorStatesStrings.decision_due
	], Number.parseInt(request.headers.userid, 10));
	const appealsForResponse = appeals.map((appeal) => formatAppealForAllAppeals(appeal));
	return response.send(appealsForResponse);
};

export { getAppeals };
