import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';

import {
	getRepresentationDetailsController,
	postRepresentationDetailsController
} from './applications-relevant-rep-details.controller.js';

import { addRepresentationToLocals } from '../representation/representation.middleware.js';
import { addRepresentationValuesToBody } from './applications-relevant-rep-details.middleware.js';
import { representationDetailsValidation } from './applications-relevant-rep-details.validators.js';

import {
	getRedactRepresentationController,
	postRedactRepresentationController
} from './redact-representation/redact-representation.controller.js';
import {
	getRepresentationDetailsChangeRedactionController,
	postRepresentationDetailsChangeRedactionController
} from './change-redaction/change-redaction.controller.js';
import { representationChangeRedactionValidation } from './change-redaction/change-redaction.validator.js';
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
	.get(addRepresentationToLocals, asyncHandler(getRepresentationDetailsController))
	.post(
		addRepresentationToLocals,
		addRepresentationValuesToBody,
		representationDetailsValidation,
		asyncHandler(postRepresentationDetailsController)
	);

representationDetailsRouter
	.route('/redact-representation')
	.get(asyncHandler(getRedactRepresentationController))
	.post(asyncHandler(postRedactRepresentationController));

representationDetailsRouter
	.route('/change-redaction')
	.get(asyncHandler(getRepresentationDetailsChangeRedactionController))
	.post(
		representationChangeRedactionValidation,
		asyncHandler(postRepresentationDetailsChangeRedactionController)
	);

representationDetailsRouter
	.route('/task-log')
	.get(asyncHandler(getRepresentationDetailsTaskLogController));

representationDetailsRouter
	.route('/change-status')
	.get(asyncHandler(getRepresentationStatusController))
	.post(representationStatusValidation, asyncHandler(postRepresentationStatus));

representationDetailsRouter
	.route('/status-result')
	.get(asyncHandler(getRepresentationStatusNotesController))
	.post(representationStatusNotesValidation, asyncHandler(postRepresentationStatusNotesController));

export default representationDetailsRouter;
