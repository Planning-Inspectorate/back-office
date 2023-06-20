import { composeMiddleware } from '@pins/express';
import { query } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import * as sectorRepository from '../../repositories/sector.repository.js';

/**
 * @param {string} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateSectorName = async (value) => {
	const subSector = await sectorRepository.getByName(value);

	if (subSector === null) {
		throw new Error('Unknown Sector');
	}
};

export const validateGetSubSectors = composeMiddleware(
	query('sectorName')
		.custom(validateSectorName)
		.withMessage('Sector name not recognised')
		.optional({ nullable: true }),
	validationErrorHandler
);
