import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import * as controller from './personal-list.controller.js';

const router = createRouter();

router.route('/').get(asyncRoute(controller.viewPersonalList));

export default router;
