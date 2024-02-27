import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import * as controller from './national-list.controller.js';

const router = createRouter();

router.route('/').get(asyncRoute(controller.viewNationalList));

//This is a test route to check user permissions on AD
router.route('/ad').get(asyncRoute(controller.getCaseOfficers));

export default router;
