import { formatAuditTrail } from './audit-trails.formatter.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const getAuditTrailById = (req, res) => {
	const { auditTrail } = req.appeal;
	const formattedAuditTrail = formatAuditTrail(auditTrail);

	return res.send(formattedAuditTrail);
};

export { getAuditTrailById };
