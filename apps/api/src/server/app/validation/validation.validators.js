import { composeMiddleware } from '@pins/express';
import { body, validationResult } from 'express-validator';
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

export const validateAppealAttributesToChange = composeMiddleware(
	body('AppellantName')
		.isAlpha('en-US', { ignore: ' ' } )
		.optional({ nullable: true })
		.withMessage('Appellant Name must only contain letters'),
	body('LocalPlanningDepartment')
		.isAlpha('en-US', { ignore: ' ' } )
		.optional({ nullable: true })
		.withMessage('Local Planning Department must only contain letters'),
	body('PlanningApplicationReference').optional({ nullable: true }),
	body('Address.AddressLine1').optional({ nullable: true }),
	body('Address.AddressLine2').optional({ nullable: true }),
	body('Address.County').optional({ nullable: true }),
	body('Address.Town').optional({ nullable: true }),
	body('Address.PostCode').optional({ nullable: true }),
	handleValidationError
);

/**
 * Evaluate any errors collected by express validation and return a 400 status
 * with the mapped errors.
 *
 * @type {import('express').RequestHandler}
 */
 function handleValidationError(request, response, next) {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(400).send({ errors: result.mapped() });
	} else {
		next();
	}
}
