import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { addRepresentationToLocals } from '../representation.middleware.js';
import {
	getRepresentationComment,
	postRepresentationComment
} from './representation-comment.controller.js';
import { representationCommentValidation } from './representation-comment.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepresentationCommentRouter = createRouter({ mergeParams: true });

relevantRepresentationCommentRouter
	.route(repRoutes.addRepresentation)
	.get(addRepresentationToLocals, asyncHandler(getRepresentationComment))
	.post(
		addRepresentationToLocals,
		representationCommentValidation,
		asyncHandler(postRepresentationComment)
	);

export default relevantRepresentationCommentRouter;
