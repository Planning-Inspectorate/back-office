import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as repsDetailsController from './applications-relevant-rep-details.controller.js';
import {
	getRedactRepresentationController,
	postRedactRepresentationController
} from './redact-representation/redact-representation.controller.js';
import {
	getRepresentationDetailsChangeRedactionController,
	postRepresentationDetailsChangeRedactionController
} from './change-redaction/change-redaction.controller.js';
import { representationChangeRedactionValidation } from './change-redaction/change-redaction.validator.js';
import { addRepresentationToLocals } from '../representation/representation.middleware.js';

const representationDetailsRouter = createRouter({ mergeParams: true });

representationDetailsRouter
	.route('/')
	.get(addRepresentationToLocals, asyncRoute(repsDetailsController.relevantRepDetails));

representationDetailsRouter
	.route('/redact-representation')
	.get(asyncRoute(getRedactRepresentationController))
	.post(asyncRoute(postRedactRepresentationController));

representationDetailsRouter
	.route('/change-redaction')
	.get(asyncRoute(getRepresentationDetailsChangeRedactionController))
	.post(
		representationChangeRedactionValidation,
		asyncRoute(postRepresentationDetailsChangeRedactionController)
	);

export default representationDetailsRouter;
