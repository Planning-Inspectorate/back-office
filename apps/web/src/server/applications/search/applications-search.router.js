import { Router as createRouter } from 'express';
import * as validators from './application-search.validators.js';
import * as controller from './applications-search.controller.js';
// TODO:
//  refactor all vars in this scope to be: [something]searchApplications[something].js
//  possibly rename consistently the templates
//  view "create" scope for reference
const searchRouter = createRouter();

searchRouter
	.route('/')
	.post(validators.validateSearchApplicationsTerm, controller.searchApplications);

export default searchRouter;
