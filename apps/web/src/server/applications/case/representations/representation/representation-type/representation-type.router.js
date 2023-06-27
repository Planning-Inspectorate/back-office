import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationType, postRepresentationType } from './representation-type.controller.js';
import { representationTypeValidation } from './representation-type.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepresentationTypeRouter = createRouter({ mergeParams: true });

relevantRepresentationTypeRouter
	.route(repRoutes.representationType)
	.get(addRepresentationToLocals, asyncRoute(getRepresentationType))
	.post(
		addRepresentationToLocals,
		representationTypeValidation,
		asyncRoute(postRepresentationType)
	);

export default relevantRepresentationTypeRouter;
