import { Router as createRouter } from 'express';
import * as guards from '../../create-new-case/applications-create.guards.js';
import { registerApplicationId } from '../../create-new-case/applications-create.locals.js';
import applicationsEditApplicantRouter from './applicant/applications-edit-applicant.router.js';
import { registerBackPath } from './applications-edit.locals.js';
import applicationsEditCaseRouter from './case/applications-edit-case.router.js';

const applicationsEditRouter = createRouter({ mergeParams: true });

applicationsEditRouter.use(guards.assertDomainTypeIsNotInspector);

applicationsEditRouter.use(registerApplicationId);
applicationsEditRouter.use(registerBackPath);

applicationsEditRouter.use('/', [applicationsEditCaseRouter, applicationsEditApplicantRouter]);

export default applicationsEditRouter;
