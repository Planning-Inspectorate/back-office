import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
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
	.get(addRepresentationToLocals, asyncRoute(getRepresentationComment))
	.post(
		addRepresentationToLocals,
		representationCommentValidation,
		asyncRoute(postRepresentationComment)
	);

export default relevantRepresentationCommentRouter;
