import { Router as createRouter } from 'express';
import * as controller from './start-date-entered.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/').get(controller.getStartDateEntered);

export default router;
