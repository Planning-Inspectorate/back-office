import { caseStatusMap } from '../../utils/mapping/map-case-status-string.js';

/**
 * @type {import('express').RequestHandler}
 * */
export const getCaseStages = async (request, response) => {
	const items = Object.entries(caseStatusMap).map(([key, value]) => ({
		name: key,
		displayNameEn: value
	}));

	response.send(items);
};
