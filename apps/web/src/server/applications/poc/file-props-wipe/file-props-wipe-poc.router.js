import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './file-props-wipe-poc.controller.js';

const router = createRouter();

router
	.route('/')
	.get(asyncHandler(controller.viewFilePropsWipePoc))
	.post(asyncHandler(controller.showUploadPage));

router.get('/results', asyncHandler(controller.runFilePropsWipePoc));
router.post('/delete', asyncHandler(controller.deleteAndRetry));

export default router;
