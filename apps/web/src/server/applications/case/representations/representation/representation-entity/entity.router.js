import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationEntity, postRepresentationEntity } from './entity.controller.js';
import { representationEntityValidation } from './entity.validators.js';

const relevantRepEntityRouter = createRouter({ mergeParams: true });

relevantRepEntityRouter
	.route('/representation-entity')
	.get(addRepresentationToLocals, asyncHandler(getRepresentationEntity))
	.post(
		addRepresentationToLocals,
		representationEntityValidation,
		asyncHandler(postRepresentationEntity)
	);

export default relevantRepEntityRouter;
