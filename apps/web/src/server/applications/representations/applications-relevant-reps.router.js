import { Router as createRouter } from 'express';
import asyncRoute from '../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter
	.route('/:id/relevant-representations')
	.get(asyncRoute(controller.relevantRepsApplications));

export default relevantRepsRouter;
