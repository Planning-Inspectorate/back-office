import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
import representationDetailsRouter from './representation-details/application-representation-details.router.js';
import relevantRepContactDetailsRouter from './representation/contact-details/contact-details.router.js';
import relevantRepAddressDetailsRouter from './representation/address-details/address-details.router.js';
import relevantRepresentationTypeRouter from './representation/representation-type/representation-type.router.js';
import relevantRepContactMethodRouter from './representation/contact-method/contact-method.router.js';

import relevantRepresentationUnder18Router from './representation/under-18/under-18.router.js';
import relevantRepresentationCommentRouter from './representation/representation-comment/representation-comment.router.js';

const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter.route('/').get(asyncRoute(controller.relevantRepsApplications));
relevantRepsRouter.use('/', relevantRepContactDetailsRouter);
relevantRepsRouter.use('/', relevantRepAddressDetailsRouter);
relevantRepsRouter.use('/:representationId/representation-details', representationDetailsRouter);
relevantRepsRouter.use('/', relevantRepContactDetailsRouter);
relevantRepsRouter.use('/', relevantRepresentationTypeRouter);
relevantRepsRouter.use('/', relevantRepContactMethodRouter);
relevantRepsRouter.use('/', relevantRepresentationUnder18Router);
relevantRepsRouter.use('/', relevantRepresentationCommentRouter);

export default relevantRepsRouter;
