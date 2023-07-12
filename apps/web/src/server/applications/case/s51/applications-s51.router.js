import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-s51.controller.js';
import * as locals from '../applications-case.locals.js';

const applicationsS51Router = createRouter({ mergeParams: true });

applicationsS51Router
	.route('/create/:step')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51CreatePage))
	.post(asyncRoute(controller.updateApplicationsCaseS51CreatePage));

applicationsS51Router
	.route('/create/check-your-answers')
	.post(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51CheckYourAnswers));

export default applicationsS51Router;
