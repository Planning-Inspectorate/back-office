import { query } from 'express-validator';
import { isEmpty } from 'lodash-es';
import * as sectorRepository from '../../repositories/sector.repository.js';

/** @type {import('express').RequestHandler } */
export const validateSectorName = async (request, response, next) => {
	const result = await query('sectorName')
		.custom(async (sectorName) => {
			if (!sectorName) {
				return true;
			}

			const sector = await sectorRepository.getByName(sectorName);

			if (!isEmpty(sector)) {
				return true;
			}
			throw new Error('Sector name not recognised');
		})
		.run(request);

	if (!result.isEmpty()) {
		response.status(404).send({ errors: result.formatWith(({ msg }) => msg).mapped() });
	} else {
		next();
	}
};
