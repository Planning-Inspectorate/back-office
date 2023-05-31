import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
import representionDetailsRouter from './representation-details/application-representation-details.router.js';
import relevantRepContactDetailsRouter from './representation/contact-details/contact-details.router.js';
const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter.route('/').get(asyncRoute(controller.relevantRepsApplications));

relevantRepsRouter.use('/:representationId/representation-details', representionDetailsRouter);
relevantRepsRouter.use('/', relevantRepContactDetailsRouter);

export default relevantRepsRouter;
