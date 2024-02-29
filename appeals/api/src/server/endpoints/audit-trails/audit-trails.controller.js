import auditTrailRepository from '#repositories/audit-trail.repository.js';
import { formatAuditTrail } from './audit-trails.formatter.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getAuditTrailById = async (req, res) => {
	const { appealId } = req.params;
	const auditTrail = await auditTrailRepository.getAuditTrail(Number(appealId));
	const formattedAuditTrail = formatAuditTrail(auditTrail);

	return res.send(formattedAuditTrail);
};

export { getAuditTrailById };
