import { Router as createRouter } from 'express';
import applicationsCreateApplicantRouter from './applicant/applications-create-applicant.router.js';
import * as guards from './applications-create.guards.js';
import * as locals from './applications-create.locals.js';
import applicationsCreateCaseRouter from './case/applications-create-case.router.js';
import applicationsCreateCheckYourAnswersRouter from './check-your-answers/applications-create-check-your-answers.router.js';
import applicationsCreateKeyDatesRouter from './key-dates/applications-create-key-dates.router.js';

const applicationsCreateRouter = createRouter();
const applicationsCreateResumedRouter = createRouter({ mergeParams: true });

applicationsCreateRouter.use(guards.assertDomainTypeIsNotInspector);

applicationsCreateRouter.use('/:caseId?', applicationsCreateResumedRouter);
applicationsCreateResumedRouter.use(locals.registerCaseId);

// do not change the order of the routers
applicationsCreateResumedRouter.use('/', [
	applicationsCreateCaseRouter,
	applicationsCreateCheckYourAnswersRouter,
	applicationsCreateKeyDatesRouter,
	applicationsCreateApplicantRouter
]);

export default applicationsCreateRouter;
