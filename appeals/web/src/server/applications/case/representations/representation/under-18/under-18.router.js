import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationUnder18, postRepresentationUnder18 } from './under-18.controller.js';

const relevantRepresentationUnder18Router = createRouter({ mergeParams: true });

relevantRepresentationUnder18Router
	.route('/under-18')
	.get(addRepresentationToLocals, asyncRoute(getRepresentationUnder18))
	.post(asyncRoute(postRepresentationUnder18));

export default relevantRepresentationUnder18Router;
