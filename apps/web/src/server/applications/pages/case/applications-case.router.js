import { Router as createRouter } from 'express';
import * as locals from '../../applications.locals.js';
import * as controller from './applications-case.controller.js';
import applicationsEditRouter from './edit/applications-edit.router.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);

applicationsCaseRouter.use('/:caseId/:pageType?', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter.use(locals.registerCase);
applicationsCaseSummaryRouter.route('/').get(controller.viewApplicationsCasePages);

export default applicationsCaseRouter;
