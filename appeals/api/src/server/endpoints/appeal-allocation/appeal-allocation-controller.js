import config from '../../config/config.js';
import appealRepository from '#repositories/appeal.repository.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<any>}
 */
export const getAllocationLevels = async (req, res) => {
	return res.send(config.appealAllocationLevels);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<any>}
 */
export const saveAllocation = async (req, res) => {
	const { appeal } = req;
	const { level, specialisms } = req.body;
	const selectedLevel =
		config.appealAllocationLevels.find(
			(/** @type {{ level: string; }} */ l) => l.level === level
		) || null;
	if (selectedLevel) {
		appealRepository.updateAppealAllocation(appeal.id, selectedLevel, specialisms);
	}

	return res.send(req.body);
};
