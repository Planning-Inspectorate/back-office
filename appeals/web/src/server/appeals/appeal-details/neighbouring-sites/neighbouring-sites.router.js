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

router.route('/manage').get(asyncRoute(controller.getManageNeighbouringSites));

router
	.route('/remove/:siteId')
	.get(asyncRoute(controller.getRemoveNeighbouringSite))
	.post(
		validators.validateNeighbouringSiteDeleteAnswer,
		asyncRoute(controller.postRemoveNeighbouringSite)
	);

router
	.route('/change/:siteId')
	.get(asyncRoute(controller.getChangeNeighbouringSite))
	.post(validators.validateAddNeighbouringSite, asyncRoute(controller.postChangeNeighbouringSite));

router
	.route('/change/:siteId/check-and-confirm')
	.get(asyncRoute(controller.getChangeNeighbouringSiteCheckAndConfirm))
	.post(asyncRoute(controller.postChangeNeighbouringSiteCheckAndConfirm));

export default router;
