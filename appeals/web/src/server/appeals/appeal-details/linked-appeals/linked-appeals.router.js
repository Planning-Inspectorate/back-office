import { Router as createRouter } from 'express';
import * as controller from './linked-appeals.controller.js';
import * as validators from './linked-appeals.validators.js';

const router = createRouter({ mergeParams: true });

router.route('/add')
	.get(controller.getAddLinkedAppeal)
	.post(validators.validateAddLinkedAppeal, controller.postAddLinkedAppeal);

router.route('/manage').get(controller.getLinkedAppeals);
router
	.route('/unlink-appeal/:parentId/:parentRef/:childRef')
	.get(controller.getUnlinkAppeal)
	.post(validators.validateUnlinkAppeal, controller.postUnlinkAppeal);

export default router;
