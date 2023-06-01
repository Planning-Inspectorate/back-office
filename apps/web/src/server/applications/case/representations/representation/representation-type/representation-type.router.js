import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationType, postRepresentationType } from './representation-type.controller.js';
import { representationTypeValidation } from './representation-type.validators.js';

const relevantRepresentationTypeRouter = createRouter({ mergeParams: true });

relevantRepresentationTypeRouter
	.route('/representation-type')
	.get(addRepresentationToLocals, asyncRoute(getRepresentationType))
	.post(
		addRepresentationToLocals,
		representationTypeValidation,
		asyncRoute(postRepresentationType)
	);

export default relevantRepresentationTypeRouter;
