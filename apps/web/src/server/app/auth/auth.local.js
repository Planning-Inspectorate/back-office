import { loadEnvironment } from '@pins/platform';

/** @type {import('express').RequestHandler} */
export default function ({ session }, _, next) {
	if (!session.isAuthenticated) {
		const { AUTH_SIMULATED_GROUPS } = /** @type {{ AUTH_SIMULATED_GROUPS?: string }} */ (loadEnvironment(process.env.NODE_ENV));
		const groups = (AUTH_SIMULATED_GROUPS || '').split(',').map((group) => group.trim());

		session.isAuthenticated = true;
		session.account = /** @type {import('@azure/msal-node').AccountInfo} */ ({
			idTokenClaims: {
				groups
			}
		});
	}
	next();
}
