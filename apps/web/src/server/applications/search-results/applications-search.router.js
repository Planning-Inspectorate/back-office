import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as validators from './application-search.validators.js';
import * as controller from './applications-search.controller.js';

const searchRouter = createRouter();

searchRouter
	.route('/:pageNumber?')
	.post(validators.validateSearchApplicationsTerm, asyncHandler(controller.searchApplications));

searchRouter.route('/:pageNumber?').get(asyncHandler(controller.searchApplications));

export default searchRouter;
