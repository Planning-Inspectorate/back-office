import appealRepository from '../repositories/appeal.repository.js';

export const validateAppealStatus = (statuses) =>
	async ({ params }, response, next) => {
		const appeal = await appealRepository.getById(params.appealId);

		if (!statuses.includes(appeal?.status)) {
			response.status(409).send({
				errors: {
					status: 'Appeal is in an invalid state'
				}
			});
		} else {
			next();
		}
	};
