import { Router as createRouter } from 'express';
import * as controller from './applications-create.controller.js';
import * as guards from './applications-create.guards.js';
import * as locals from './applications-create.locals.js';
import * as validators from './applications-create.validators.js';

const applicationsCreateRouter = createRouter();
const applicationsCreateResumedStepsRouter = createRouter({ mergeParams: true });

applicationsCreateRouter.use(guards.assertDomainTypeIsNotInspector);
applicationsCreateRouter
	.route('/')
	.get(controller.viewApplicationsCreateName)
	.post(
		[validators.validateApplicationsCreateName, validators.validateApplicationsCreateDescription],
		controller.newApplicationsCreateName
	);

applicationsCreateRouter.use('/:applicationId', applicationsCreateResumedStepsRouter);
applicationsCreateResumedStepsRouter.use(locals.registerApplicationId);

applicationsCreateResumedStepsRouter
	.route('/sector')
	.get(controller.viewApplicationsCreateSector)
	.post(validators.validateApplicationsCreateSector, controller.newApplicationsCreateSector);

applicationsCreateResumedStepsRouter
	.route('/sub-sector')
	.get(controller.viewApplicationsCreateSubSector);

export default applicationsCreateRouter;
