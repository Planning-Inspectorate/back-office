import { Router as createRouter } from 'express';
import * as controller from './personal-list.controller.js';

const router = createRouter();

router.route('/').get(controller.viewPersonalList);

export default router;
