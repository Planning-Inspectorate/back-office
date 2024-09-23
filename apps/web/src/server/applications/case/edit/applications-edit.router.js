import { Router as createRouter } from 'express';
import applicationsEditApplicantRouter from './applicant/applications-edit-applicant.router.js';
import { registerBackPath } from './applications-edit.locals.js';
import applicationsEditCaseRouter from './case/applications-edit-case.router.js';

const applicationsEditRouter = createRouter({ mergeParams: true });

applicationsEditRouter.use(registerBackPath);

applicationsEditRouter.use('/', [applicationsEditCaseRouter, applicationsEditApplicantRouter]);

export default applicationsEditRouter;
