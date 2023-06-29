import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import {
	getCheckAnswersController,
	postCheckAnswersController
} from './check-answers.controller.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { addRepresentationValuesToBody } from './check-answers.middleware.js';
import { checkAnswersValidation } from './check-answers.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepCheckAnswersRouter = createRouter({ mergeParams: true });

relevantRepCheckAnswersRouter
	.route(repRoutes.checkAnswers)
	.get(addRepresentationToLocals, asyncRoute(getCheckAnswersController))
	.post(
		addRepresentationToLocals,
		addRepresentationValuesToBody,
		checkAnswersValidation,
		asyncRoute(postCheckAnswersController)
	);

export default relevantRepCheckAnswersRouter;
