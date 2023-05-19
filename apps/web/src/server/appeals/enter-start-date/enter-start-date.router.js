import { Router as createRouter } from 'express';
import * as controller from './enter-start-date.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/').get(controller.getEnterStartDate).post(controller.postEnterStartDate);

export default router;
