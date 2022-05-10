import config from '@pins/web/environment/config.js';

/** @type {import('express').RequestHandler} */
export default function ({ session }, _, next) {
	if (!session.isAuthenticated) {
		session.isAuthenticated = true;
		session.account = /** @type {import('@pins/platform').PlanningInspectorAccountInfo} */ ({
			idTokenClaims: {
				groups: config.authSimulatedGroups
			}
		});
	}
	next();
}
