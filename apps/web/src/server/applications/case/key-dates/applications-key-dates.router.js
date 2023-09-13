import { registerCase } from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-key-dates.controller.js';
import * as validators from './applications-key-dates.validators.js';

const applicationsKeyDateRouter = createRouter({ mergeParams: true });

applicationsKeyDateRouter.use(assertDomainTypeIsNotInspector, registerCaseId);

applicationsKeyDateRouter.route('/').get(registerCase, asyncRoute(controller.viewKeyDatesIndex));

applicationsKeyDateRouter
	.route('/:sectionName')
	.get(registerCase, asyncRoute(controller.viewKeyDatesEditSection))
	.post(validators.validateKeyDates, asyncRoute(controller.updateKeyDatesSection));

export default applicationsKeyDateRouter;
