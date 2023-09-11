import { Router as createRouter } from 'express';
import * as controller from './national-list.controller.js';

const router = createRouter();

router.route('/').get(controller.viewNationalList);

//This is a test route to check user permissions on AD
router.route('/ad').get(controller.getCaseOfficers);

export default router;
