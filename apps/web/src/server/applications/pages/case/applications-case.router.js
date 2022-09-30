import { Router as createRouter } from 'express';
import * as locals from '../../applications.locals.js';
import { registerApplicationId } from '../create/applications-create.locals.js';
import * as controller from './applications-case.controller.js';
import applicationsEditRouter from './edit/applications-edit.router.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:applicationId/edit', applicationsEditRouter);

applicationsCaseRouter.use('/:applicationId/:pageType?', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter.use(registerApplicationId);
applicationsCaseSummaryRouter.use(locals.loadApplication);
applicationsCaseSummaryRouter.route('/').get(controller.viewApplicationsCasePages);

export default applicationsCaseRouter;
