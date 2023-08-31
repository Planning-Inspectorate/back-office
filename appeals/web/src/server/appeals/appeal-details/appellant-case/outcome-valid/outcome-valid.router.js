import { Router as createRouter } from 'express';
import * as controller from './outcome-valid.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/confirmation').get(controller.getConfirmation);

export default router;
