import config from '../../config/config.js';
import appealAllocationRepository from '#repositories/appeal-allocation.repository.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const getAllocationLevels = async (req, res) => {
	return res.send(config.appealAllocationLevels);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
export const saveAllocation = async (req, res) => {
	const { appeal } = req;
	const { level, specialisms } = req.body;
	const selectedLevel =
		config.appealAllocationLevels.find(
			(/** @type {{ level: string; }} */ l) => l.level === level
		) || null;
	if (selectedLevel) {
		appealAllocationRepository.updateAppealAllocationByAppealId(
			appeal.id,
			selectedLevel,
			specialisms
		);
	}

	return res.send(req.body);
};
