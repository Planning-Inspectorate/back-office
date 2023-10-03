import config from '../../config/config.js';
import appealAllocationRepository from '#repositories/appeal-allocation.repository.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { AUDIT_TRAIL_ALLOCATION_DETAILS_ADDED } from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const getAllocationLevels = async (req, res) => {
	return res.send(config.appealAllocationLevels);
};

/**
 * @param {Request} req
 * @param {Response} res
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
		await appealAllocationRepository.updateAppealAllocationByAppealId(
			appeal.id,
			selectedLevel,
			specialisms
		);

		await createAuditTrail({
			appealId: appeal.id,
			azureAdUserId: req.get('azureAdUserId'),
			details: AUDIT_TRAIL_ALLOCATION_DETAILS_ADDED
		});
	}

	return res.send(req.body);
};
