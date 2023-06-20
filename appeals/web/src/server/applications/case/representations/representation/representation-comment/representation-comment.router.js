import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import {
	getRepresentationComment,
	postRepresentationComment
} from './representation-comment.controller.js';
import { representationCommentValidation } from './representation-comment.validators.js';

const relevantRepresentationCommentRouter = createRouter({ mergeParams: true });

relevantRepresentationCommentRouter
	.route('/add-representation')
	.get(addRepresentationToLocals, asyncRoute(getRepresentationComment))
	.post(
		addRepresentationToLocals,
		representationCommentValidation,
		asyncRoute(postRepresentationComment)
	);

export default relevantRepresentationCommentRouter;
