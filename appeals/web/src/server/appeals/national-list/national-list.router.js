import { Router as createRouter } from 'express';
import * as controller from './national-list.controller.js';

const router = createRouter();

router.route('/').get(controller.viewNationalList);

export default router;
