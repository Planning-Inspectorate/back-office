import { check } from 'express-validator';

/**
 * @param {string} name
 * @returns {import('express-validator').ValidationChain}
 */
export const bodyForGovukDateInput = (name) =>
	check(name).customSanitizer((_, { req }) => {
		const day = req.body[`${name}-day`] || '';
		const month = req.body[`${name}-month`] || '';
		const year = req.body[`${name}-year`] || '';

		delete req.body[`${name}-day`];
		delete req.body[`${name}-month`];
		delete req.body[`${name}-year`];
		// treat no populated units as an empty string to allow validation on it
		// being present
		return day || month || year ? [year, month, day].join('-') : '';
	});
