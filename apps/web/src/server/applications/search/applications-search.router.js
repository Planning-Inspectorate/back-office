import { Router as createRouter } from 'express';
import * as validators from './application-search.validators.js';
import * as controller from './applications-search.controller.js';

const searchRouter = createRouter();

searchRouter
	.route('/')
	.post(validators.validateSearchApplicationsTerm, controller.searchApplications);

export default searchRouter;
