import { Router as createRouter } from 'express';
import * as controller from './applications.controller.js';
import * as guards from './applications.guards.js';
import * as locals from './applications.locals.js';
import searchRouter from './search/applications-search.router.js';

const router = createRouter();
const domainRouter = createRouter({ mergeParams: true });

// The structure of Applications section is still to be defined
// Some views, as like as the dashboard and the single application page, will be "domain-driven"
// i.e. different types of users will see different content and will be able to do different things
// Others views, as like as the search results page or the create application page, will be "functionality-driven"
// i.e. different types of users will see the same thing, possibly with different auth levels
// Therefore the current routes structure is NOT definitive
// At the moment we're following both the methods (domain-driven urls and functionality urls)

/** Functionality-driven URLS */

router.use('/search-results', searchRouter);

/** Domain-driven URLS */

/**
 * @typedef {object} DomainParams
 * @property {import('./applications.types').DomainType} domainType
 */
router.use('/:domainType', guards.assertDomainTypeAccess, domainRouter);

domainRouter.use(locals.registerLocals);
domainRouter.route('/').get(controller.viewDashboard);

domainRouter.param('applicationId', locals.loadApplication);
domainRouter.route('/applications/:applicationId').get(controller.viewApplication);

export default router;
