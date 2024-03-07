import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import * as controller from './change-page.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/:question').get(asyncRoute(controller.getChangePage));

export default router;
