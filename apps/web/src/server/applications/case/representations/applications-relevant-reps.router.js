import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
import * as repsDetailsController from './representation-details/applications-relevant-rep-details.controller.js'
const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter.route('/').get(asyncRoute(controller.relevantRepsApplications));

relevantRepsRouter
	.route('/:representationId/representation-details')
	.get(asyncRoute(repsDetailsController.relevantRepDetails));


export default relevantRepsRouter;
