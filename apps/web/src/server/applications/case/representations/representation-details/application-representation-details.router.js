import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as repsDetailsController from './applications-relevant-rep-details.controller.js';
import {
	getRedactRepresentationController,
	postRedactRepresentationController
} from './redact-representation/redact-representation.controller.js';

const representationDetailsRouter = createRouter({ mergeParams: true });

representationDetailsRouter.route('/').get(asyncRoute(repsDetailsController.relevantRepDetails));

representationDetailsRouter
	.route('/redact-representation')
	.get(asyncRoute(getRedactRepresentationController))
	.post(asyncRoute(postRedactRepresentationController));

export default representationDetailsRouter;
