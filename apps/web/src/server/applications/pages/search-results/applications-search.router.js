import { Router as createRouter } from 'express';
import * as validators from './application-search.validators.js';
import * as controller from './applications-search.controller.js';

const searchRouter = createRouter();

searchRouter
	.route('/:pageNumber?')
	.post(validators.validateSearchApplicationsTerm, controller.searchApplications);

searchRouter.route('/:pageNumber?').get(controller.searchApplications);

export default searchRouter;
