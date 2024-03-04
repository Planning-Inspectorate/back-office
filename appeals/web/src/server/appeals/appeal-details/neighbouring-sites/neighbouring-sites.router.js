import { Router as createRouter } from 'express';
import * as controller from './neighbouring-sites.controller.js';
import asyncRoute from '#lib/async-route.js';
import * as validators from './neighbouring-sites.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/add')
	.get(asyncRoute(controller.getAddNeighbouringSite))
	.post(validators.validateAddNeighbouringSite, asyncRoute(controller.postAddNeighbouringSite));

router
	.route('/add/check-and-confirm')
	.get(asyncRoute(controller.getAddNeighbouringSiteCheckAndConfirm))
	.post(asyncRoute(controller.postAddNeighbouringSiteCheckAndConfirm));

export default router;
