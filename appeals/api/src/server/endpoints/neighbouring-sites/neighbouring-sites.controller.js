import { ERROR_NOT_FOUND } from '#endpoints/constants.js';
import neighbouringSitesRepository from '#repositories/neighbouring-sites.repository.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import {
	AUDIT_TRAIL_ADDRESS_ADDED,
	AUDIT_TRAIL_ADDRESS_UPDATED,
	AUDIT_TRAIL_ADDRESS_REMOVED
} from '#endpoints/constants.js';
import formatAddress from '#utils/format-address.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const addNeighbouringSite = async (req, res) => {
	const { appeal } = req;
	const { addressLine1, addressLine2, town, county, postcode } = req.body;

	const result = await neighbouringSitesRepository.addSite(appeal.id, {
		addressLine1,
		addressLine2,
		addressTown: town,
		addressCounty: county,
		postcode
	});

	if (result) {
		await createAuditTrail({
			appealId: appeal.id,
			azureAdUserId: req.get('azureAdUserId'),
			details: AUDIT_TRAIL_ADDRESS_ADDED
		});

		await broadcastAppealState(appeal.id);
	}

	return res.send({
		siteId: result.id,
		address: formatAddress(result?.address)
	});
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const updateNeighbouringSite = async (req, res) => {
	const { appeal } = req;
	const { siteId, address } = req.body;

	const { addressLine1, addressLine2, town, county, postcode } = address;

	const result = await neighbouringSitesRepository.updateSite(siteId, {
		addressLine1,
		addressLine2,
		addressTown: town,
		addressCounty: county,
		postcode
	});

	if (!result) {
		return res.status(404).send({ errors: { siteId: ERROR_NOT_FOUND } });
	}

	await createAuditTrail({
		appealId: appeal.id,
		azureAdUserId: req.get('azureAdUserId'),
		details: AUDIT_TRAIL_ADDRESS_UPDATED
	});

	await broadcastAppealState(appeal.id);
	return res.send({
		siteId
	});
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const removeNeighbouringSite = async (req, res) => {
	const { appeal } = req;
	const { siteId } = req.body;

	const result = await neighbouringSitesRepository.removeSite(siteId);

	if (!result) {
		return res.status(404).send({ errors: { siteId: ERROR_NOT_FOUND } });
	}

	await createAuditTrail({
		appealId: appeal.id,
		azureAdUserId: req.get('azureAdUserId'),
		details: AUDIT_TRAIL_ADDRESS_REMOVED
	});

	await broadcastAppealState(appeal.id);
	return res.send({
		siteId
	});
};
