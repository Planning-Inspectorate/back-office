import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { viewHomepage } from './app.controller.js';
import { hasAccess, isAuthenticated } from './auth/auth.guards.js';

const router = createRouter();

router.route('/services').get((_, response) => {
	response.render('app/dashboard');
});

router.route('/').get(
	isAuthenticated,
	hasAccess({
		accessRule: {
			methods: ['GET', 'POST'],
			groups: [
				config.auth.validationOfficerGroupID,
				config.auth.caseOfficerGroupID,
				config.auth.inspectorGroupID
			]
		}
	}),
	viewHomepage
);

// GET /health-check - Check service health
router.route('/health-check').get((request, response) => {
	response.send('OK');
});

export default router;
