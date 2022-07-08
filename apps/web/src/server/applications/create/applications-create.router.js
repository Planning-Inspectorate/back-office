import { Router as createRouter } from 'express';
import applicationsCreateApplicantRouter from './applicant/applications-create-applicant.router.js';
import * as guards from './applications-create.guards.js';
import * as locals from './applications-create.locals.js';
import applicationsCreateCaseRouter from './case/applications-create-case.router.js';

const applicationsCreateRouter = createRouter();
const applicationsCreateResumedRouter = createRouter({ mergeParams: true });

applicationsCreateRouter.use(guards.assertDomainTypeIsNotInspector);

applicationsCreateRouter.use('/:applicationId?', applicationsCreateResumedRouter);
applicationsCreateResumedRouter.use(locals.registerApplicationId);

applicationsCreateResumedRouter.use('/', [
	applicationsCreateCaseRouter,
	applicationsCreateApplicantRouter
]);

export default applicationsCreateRouter;
