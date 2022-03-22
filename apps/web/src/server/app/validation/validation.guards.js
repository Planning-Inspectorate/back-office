/**
 * This Gurad makes sure there is an appealData in session when navigating straight into pages
 * that require first to select an appeal. If not it will redirect back to the dashboard.
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export function appealDataGuard(request, response, next) {
	if (!request.session.appealData) {
		return response.redirect('/validation');
	}

	return next();
}
