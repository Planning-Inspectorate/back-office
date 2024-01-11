import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationType, postRepresentationType } from './representation-type.controller.js';
import { representationTypeValidation } from './representation-type.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepresentationTypeRouter = createRouter({ mergeParams: true });

relevantRepresentationTypeRouter
	.route(repRoutes.representationType)
	.get(addRepresentationToLocals, asyncHandler(getRepresentationType))
	.post(
		addRepresentationToLocals,
		representationTypeValidation,
		asyncHandler(postRepresentationType)
	);

export default relevantRepresentationTypeRouter;
