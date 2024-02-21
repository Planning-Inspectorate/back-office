import { Router as createRouter } from 'express';
import * as controller from './manage-linked-appeals.controller.js';
import * as validators from './manage-linked-appeals.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/add')
	.get(controller.getAddLinkedAppealReference)
	.post(validators.validateAddLinkedAppealReference, controller.postAddLinkedAppeal);

router
	.route('/add/check-and-confirm')
	.get(controller.getAddLinkedAppealCheckAndConfirm)
	.post(
		validators.validateAddLinkedAppealCheckAndConfirm,
		controller.postAddLinkedAppealCheckAndConfirm
	);

router.route('/manage').get(controller.getManageLinkedAppeals);

router.route('/manage/:relationshipId/:parentId').get(controller.getManageLinkedAppeals);

router
	.route('/unlink-appeal/:childId/:relationshipId')
	.get(controller.getUnlinkAppeal)
	.post(validators.validateUnlinkAppeal, controller.postUnlinkAppeal);

export default router;
