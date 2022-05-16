/** @type {import('express').RequestHandler} */
export default function ({ session }, _, next) {
	if (!session.isAuthenticated) {
		session.isAuthenticated = true;
		session.account = /** @type {import('@pins/platform').PlanningInspectorAccountInfo} */ ({
			idTokenClaims: {
				groups: ['case_officer', 'inspector', 'validation_officer']
			}
		});
	}
	next();
}
