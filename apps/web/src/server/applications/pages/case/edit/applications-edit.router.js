import { Router as createRouter } from 'express';
import * as guards from '../../create/applications-create.guards.js';
import * as locals from '../../create/applications-create.locals.js';
import applicationsEditCaseRouter from './case/applications-edit-case.router.js';

const applicationsEditRouter = createRouter();
const applicationsEditResumedRouter = createRouter({ mergeParams: true });

applicationsEditRouter.use(guards.assertDomainTypeIsNotInspector);

applicationsEditRouter.use('/:applicationId?', applicationsEditResumedRouter);

applicationsEditResumedRouter.use(locals.registerApplicationId);

applicationsEditResumedRouter.use('/', [applicationsEditCaseRouter]);

export default applicationsEditRouter;
