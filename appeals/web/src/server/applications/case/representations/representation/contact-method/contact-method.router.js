import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getContactMethod, postContactMethod } from './contact-method.controller.js';
import { contactMethodValidation } from './contact-method.validators.js';

const relevantRepContactMethod = createRouter({ mergeParams: true });

relevantRepContactMethod
	.route('/contact-method')
	.get(addRepresentationToLocals, asyncRoute(getContactMethod))
	.post(addRepresentationToLocals, contactMethodValidation, asyncRoute(postContactMethod));

export default relevantRepContactMethod;
