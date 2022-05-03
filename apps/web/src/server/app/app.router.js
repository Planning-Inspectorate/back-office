import express from 'express';
import { config } from './../config/config.js';
import { isAuthenticated, hasAccess } from './auth/auth.guards.js';
import { viewHomepage } from './app.controller.js';

const router = express.Router();

router.route('/services').get((req, res) => {
	res.render('app/dashboard');
});

router.route('/').get(
	isAuthenticated,
	hasAccess({
		accessRule: {
			methods: ['GET', 'POST'],
			groups: [config.auth.validationOfficerGroupID, config.auth.caseOfficerGroupID, config.auth.inspectorGroupID]
		}
	}),
	viewHomepage
);

// GET /health-check - Check service health
router.route('/health-check').get((request, response) => {
	response.send('OK');
});

export default router;
