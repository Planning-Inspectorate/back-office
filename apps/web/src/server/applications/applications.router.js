import { Router as createRouter } from 'express';
import * as validators from './application.validators.js';
import * as controller from './applications.controller.js';
import * as guards from './applications.guards.js';
import * as locals from './applications.locals.js';

const router = createRouter();
const domainRouter = createRouter({ mergeParams: true });

/**
 * @typedef {object} DomainParams
 * @property {import('./applications.types').DomainType} domainType
 */

// All routes within applications have their own namespace. For now, this is
// largely superficial as the underlying pages are the same, so there's no need
// to dedicate actual domains in the codebase until they diverge in purpose.
router.use('/:domainType', guards.assertDomainTypeAccess, domainRouter);

domainRouter.use(locals.registerLocals);
domainRouter
	.route('/')
	.get(controller.viewDashboard)
	.post(validators.validateSearchText, controller.searchApplications);

domainRouter.param('applicationId', locals.loadApplication);
domainRouter.route('/applications/:applicationId').get(controller.viewApplication);

export default router;
