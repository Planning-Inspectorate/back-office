import { Router as createRouter } from 'express';
import * as controller from './manage-linked-appeals.controller.js';
import * as validators from './manage-linked-appeals.validators.js';

const router = createRouter({ mergeParams: true });

router.route('/linked-appeals').get(controller.getLinkedAppeals);
router
	.route('/linked-appeals/:childShortAppealReference/:parentId')
	.get(controller.getLinkedAppeals);
router
	.route('/unlink-appeal/:childId')
	.get(controller.getUnlinkAppeal)
	.post(validators.validateUnlinkAppeal, controller.postUnlinkAppeal);

export default router;
