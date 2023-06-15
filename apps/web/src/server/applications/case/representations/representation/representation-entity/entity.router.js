import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationEntity, postRepresentationEntity } from './entity.controller.js';
import { representationEntityValidation } from './entity.validators.js';

const relevantRepEntityRouter = createRouter({ mergeParams: true });

relevantRepEntityRouter
	.route('/representation-entity')
	.get(addRepresentationToLocals, asyncRoute(getRepresentationEntity))
	.post(
		addRepresentationToLocals,
		representationEntityValidation,
		asyncRoute(postRepresentationEntity)
	);

export default relevantRepEntityRouter;
