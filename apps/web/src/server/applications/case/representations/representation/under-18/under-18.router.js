import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationUnder18, postRepresentationUnder18 } from './under-18.controller.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepresentationUnder18Router = createRouter({ mergeParams: true });

relevantRepresentationUnder18Router
	.route(repRoutes.under18)
	.get(addRepresentationToLocals, asyncRoute(getRepresentationUnder18))
	.post(addRepresentationToLocals, asyncRoute(postRepresentationUnder18));

export default relevantRepresentationUnder18Router;
