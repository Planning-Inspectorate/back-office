/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */
/** @typedef {import('@pins/appeals.api').Appeals.GetAuditTrailsResponse} GetAuditTrailsResponse */

/**
 * @param {AuditTrail[] | null} auditTrail
 * @returns {GetAuditTrailsResponse | []}
 */
const formatAuditTrail = (auditTrail) =>
	auditTrail
		? auditTrail.map(({ details, loggedAt, user }) => ({
				azureAdUserId: user.azureAdUserId,
				details,
				loggedDate: loggedAt
		  }))
		: [];

export { formatAuditTrail };
