import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications.controller.js';
import * as filters from './applications.filters.js';
import * as locals from './applications.locals.js';
import applicationsCaseRouter from './case/applications-case.router.js';
import applicationsCreateRouter from './create-new-case/applications-create.router.js';
import applicationsSearchRouter from './search-results/applications-search.router.js';
import { destroySessionS51 } from './case/s51/applications-s51.session.js';
import { viewGeneralSection51page } from './case/general-s51/applications-general-s51.controller.js';

const router = createRouter();

router.use(filters.registerFilters);
router.use(locals.registerLocals);
router.use((request, _, next) => {
	// destroy session containing data for the S51 advice creation journey
	// triggers in every page
	// only activates when there is some data in the session
	const { originalUrl, session } = request;
	/** @type{any} */
	const sessionWithS51 = session;
	if (sessionWithS51.s51 && !originalUrl.includes('s51-advice/create')) {
		destroySessionS51(session);
	}
	next();
});

router.route('/').get(asyncHandler(controller.viewDashboard));

router.use('/search-results', applicationsSearchRouter);

router.use('/create-new-case', applicationsCreateRouter);

router.use('/case', applicationsCaseRouter);

router.get('/general-section-51', asyncHandler(viewGeneralSection51page));

export default router;
