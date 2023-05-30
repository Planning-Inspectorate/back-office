import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
import representionDetailsRouter from './representation-details/application-representation-details.router.js';

const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter.route('/').get(asyncRoute(controller.relevantRepsApplications));

relevantRepsRouter.use('/:representationId/representation-details', representionDetailsRouter);

export default relevantRepsRouter;
