import appealRepository from '../repositories/appeal.repository.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';

const getAppeals = async function(request, response) {
	const appeals = await appealRepository.getByStatusesAndUserId([
		inspectorStatesStrings.site_visit_not_yet_booked,
		inspectorStatesStrings.site_visit_booked,
		inspectorStatesStrings.decision_due
	], Number.parseInt(request.headers.userid, 10));
	return response.send(appeals);
};

export { getAppeals };
