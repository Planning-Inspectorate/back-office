import { Router as createRouter } from 'express';
import * as controller from './appellant-case.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/').get(controller.getAppellantCase);

export default router;
