/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */
/** @typedef {import('@pins/appeals.api').Appeals.GetAuditTrailsResponse} GetAuditTrailsResponse */

/**
 * @param {AuditTrail[] | null | undefined} auditTrail
 * @returns {GetAuditTrailsResponse | []}
 */
const formatAuditTrail = (auditTrail) =>
	auditTrail
		? auditTrail.map(({ details, loggedAt, user, doc }) => ({
				azureAdUserId: user.azureAdUserId,
				details,
				loggedDate: loggedAt,
				doc: doc
					? {
							name: doc.document?.name || '',
							documentGuid: doc.document?.latestDocumentVersion?.documentGuid || '',
							stage: doc.document?.latestDocumentVersion?.stage || '',
							folderId: doc.document?.folderId
					  }
					: undefined
		  }))
		: [];

export { formatAuditTrail };
