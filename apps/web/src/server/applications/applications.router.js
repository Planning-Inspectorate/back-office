import { Router as createRouter } from 'express';
import asyncRoute from '../lib/async-route.js';
import * as controller from './applications.controller.js';
import * as filters from './applications.filters.js';
import * as guards from './applications.guards.js';
import * as locals from './applications.locals.js';
import applicationsCaseRouter from './case/applications-case.router.js';
import applicationsCreateRouter from './create-new-case/applications-create.router.js';
import relevantRepsRouter from './representations/applications-relevant-reps.router.js';
import applicationsSearchRouter from './search-results/applications-search.router.js';

const router = createRouter();
const domainRouter = createRouter({ mergeParams: true });

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

router.use('/case', guards.assertDomainTypeExists, relevantRepsRouter);

router.use('/case', guards.assertDomainTypeExists, applicationsCaseRouter);

/** Domain-driven URLS */

/**
 * @typedef {object} DomainParams
 * @property {import('./applications.types').DomainType} domainType
 * @property {string=} caseId
 */
router.use('/:domainType', guards.assertDomainTypeAccess, domainRouter);
domainRouter.use(locals.registerDomainLocals);

domainRouter.route('/').get(asyncRoute(controller.viewDashboard));

export default router;
