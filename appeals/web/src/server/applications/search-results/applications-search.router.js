import { Router as createRouter } from 'express';
import asyncRoute from '../../lib/async-route.js';
import * as validators from './application-search.validators.js';
import * as controller from './applications-search.controller.js';

const searchRouter = createRouter();

searchRouter
	.route('/:pageNumber?')
	.post(validators.validateSearchApplicationsTerm, asyncRoute(controller.searchApplications));

searchRouter.route('/:pageNumber?').get(asyncRoute(controller.searchApplications));

export default searchRouter;
