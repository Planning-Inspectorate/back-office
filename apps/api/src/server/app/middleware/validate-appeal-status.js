import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import appealRepository from '../repositories/appeal.repository.js';

const sendInvalidStateMessage = function (response, message) {
	response.status(409).send({
		errors: {
			status: message
		}
	});
};

export const validateAppealStatus = (statuses) =>
	async ({ params }, response, next) => {
		const appeal = await appealRepository.getById(params.appealId);
		if (!arrayOfStatusesContainsString(appeal.appealStatus, statuses)) {
			sendInvalidStateMessage(response, 'Appeal is in an invalid state');
		} else {
			next();
		}
	}
