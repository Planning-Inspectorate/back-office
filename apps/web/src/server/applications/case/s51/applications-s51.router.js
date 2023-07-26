import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-s51.controller.js';
import * as locals from '../applications-case.locals.js';
import { s51ValidatorsDispatcher } from './applications-s51.validators.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';

const applicationsS51Router = createRouter({ mergeParams: true });

applicationsS51Router.use(assertDomainTypeIsNotInspector);

applicationsS51Router
	.route('/')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51Folder));

applicationsS51Router
	.route('/create/check-your-answers')
	.get(asyncRoute(controller.viewApplicationsCaseS51CheckYourAnswers))
	.post(asyncRoute(controller.postApplicationsCaseS51CheckYourAnswersSave));

applicationsS51Router
	.route('/create/:step')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51CreatePage))
	.post(s51ValidatorsDispatcher, asyncRoute(controller.updateApplicationsCaseS51CreatePage));

applicationsS51Router
	.route('/:action/success')
	.get(locals.registerFolder, asyncRoute(controller.viewSuccessfullyS51Created));

export default applicationsS51Router;
