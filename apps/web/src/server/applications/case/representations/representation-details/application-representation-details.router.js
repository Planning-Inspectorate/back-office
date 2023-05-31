import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as repsDetailsController from './applications-relevant-rep-details.controller.js';
import {
	getRedactRepresentationController,
	postRedactRepresentationController
} from './redact-representation/redact-representation.controller.js';

const representionDetailsRouter = createRouter({ mergeParams: true });

representionDetailsRouter.route('/').get(asyncRoute(repsDetailsController.relevantRepDetails));

representionDetailsRouter
	.route('/redact-representation')
	.get(asyncRoute(getRedactRepresentationController))
	.post(asyncRoute(postRedactRepresentationController));

export default representionDetailsRouter;
