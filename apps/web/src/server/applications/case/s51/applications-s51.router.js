import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-s51.controller.js';
import * as locals from '../applications-case.locals.js';
import {
	s51ValidatorsDispatcher,
	validateS51AdviceToChange,
	validateS51AdviceActions
} from './applications-s51.validators.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';

const applicationsS51Router = createRouter({ mergeParams: true });

applicationsS51Router.use(assertDomainTypeIsNotInspector);

applicationsS51Router
	.route('/')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51Folder));

applicationsS51Router
	.route('/change-status')
	.post(
		[validateS51AdviceToChange, validateS51AdviceActions, locals.registerFolder],
		asyncRoute(controller.changeAdviceStatus)
	);

applicationsS51Router
	.route('/create/check-your-answers')
	.get(asyncRoute(controller.viewApplicationsCaseS51CheckYourAnswers))
	.post(asyncRoute(controller.postApplicationsCaseS51CheckYourAnswersSave));

applicationsS51Router
	.route('/create/:step')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51CreatePage))
	.post(s51ValidatorsDispatcher, asyncRoute(controller.updateApplicationsCaseS51CreatePage));

applicationsS51Router
	.route('/:adviceId/upload')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51Upload));

applicationsS51Router
	.route('/:adviceId/delete/:attachmentId')
	.get(asyncRoute(controller.viewApplicationsCaseS51Delete))
	.post(locals.registerFolder, asyncRoute(controller.deleteApplicationsCaseS51Attachment));

applicationsS51Router
	.route('/:adviceId/edit/:step')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseEditS51Item))
	.post(asyncRoute(controller.postApplicationsCaseEditS51Item));

applicationsS51Router
	.route('/:adviceId/:step')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseS51Item));

export default applicationsS51Router;
