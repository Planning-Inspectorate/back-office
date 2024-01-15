import { registerCase } from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-key-dates.controller.js';
import * as validators from './applications-key-dates.validators.js';

const applicationsKeyDateRouter = createRouter({ mergeParams: true });

applicationsKeyDateRouter.use(registerCaseId);

applicationsKeyDateRouter.route('/').get(registerCase, asyncHandler(controller.viewKeyDatesIndex));

applicationsKeyDateRouter
	.route('/:sectionName')
	.get(registerCase, asyncHandler(controller.viewKeyDatesEditSection))
	.post(validators.validateKeyDates, asyncHandler(controller.updateKeyDatesSection));

export default applicationsKeyDateRouter;
