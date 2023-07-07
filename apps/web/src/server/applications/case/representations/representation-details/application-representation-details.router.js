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
import { getRepresentationDetailsTaskLogController } from './task-log/task-log.controller.js';
import {
	getRepresentationStatusController,
	postRepresentationStatus
} from './representation-status/representation-status.controller.js';
import { representationStatusValidation } from './representation-status/representation-status.validators.js';
import {
	getRepresentationStatusNotesController,
	postRepresentationStatusNotesController
} from './representation-status/representation-status-notes/representation-status-notes.controller.js';
import { representationStatusNotesValidation } from './representation-status/representation-status-notes/representation-status-notes.validators.js';

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

representationDetailsRouter
	.route('/task-log')
	.get(asyncRoute(getRepresentationDetailsTaskLogController));

representationDetailsRouter
	.route('/change-status')
	.get(asyncRoute(getRepresentationStatusController))
	.post(representationStatusValidation, asyncRoute(postRepresentationStatus));

representationDetailsRouter
	.route('/status-result')
	.get(asyncRoute(getRepresentationStatusNotesController))
	.post(representationStatusNotesValidation, asyncRoute(postRepresentationStatusNotesController));

export default representationDetailsRouter;
