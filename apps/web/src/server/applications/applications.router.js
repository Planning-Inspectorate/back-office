import { Router as createRouter } from 'express';
import * as controller from './applications.controller.js';
import * as filters from './applications.filters.js';
import * as guards from './applications.guards.js';
import * as locals from './applications.locals.js';
import applicationsCaseRouter from './pages/case/applications-case.router.js';
import applicationsEditRouter from './pages/case/edit/applications-edit.router.js';
import applicationsCreateRouter from './pages/create/applications-create.router.js';
import applicationsSearchRouter from './pages/search/applications-search.router.js';

const router = createRouter();
const domainRouter = createRouter({ mergeParams: true });

// The structure of Applications section is still to be defined
// Some views, as like as the dashboard and the single application page, will be "domain-driven"
// i.e. different types of users will see different content and will be able to do different things
// Others views, as like as the search results page or the create application page, will be "functionality-driven"
// i.e. different types of users will see the same thing, possibly with different auth levels
// Therefore the current routes structure is NOT definitive
// At the moment we're following both the methods (domain-driven urls and functionality urls)

router.use(filters.registerFilters);
router.use(locals.registerLocals);

/** Functionality-driven URLS */

// These URLs don't contain any information about the role of the user
// However their views sometimes require the local variable domainType to be defined
// How is domainType defined for functionality_driven URLs?
// 1. If the user has landed at least once on the dashboard
// THEN the domainType is saved in the session (through registerDomainLocals) and copied in the locals (through registerLocals)
//
// 2. If the user has never been in the dashboard and does not have the value of it in the session
// THEN the app redirects to the root page through the guard assertDomainTypExists

router.use('/search-results', guards.assertDomainTypeExists, applicationsSearchRouter);

router.use('/create-new-case', guards.assertDomainTypeExists, applicationsCreateRouter);

// TODO: move this in the case-summary router
router.use('/case/edit', guards.assertDomainTypeExists, applicationsEditRouter);

router.use('/case', guards.assertDomainTypeExists, applicationsCaseRouter);

/** Domain-driven URLS */

/**
 * @typedef {object} DomainParams
 * @property {import('./applications.types').DomainType} domainType
 * @property {string=} applicationId
 */
router.use('/:domainType', guards.assertDomainTypeAccess, domainRouter);
domainRouter.use(locals.registerDomainLocals);

domainRouter.route('/').get(controller.viewDashboard);

export default router;
