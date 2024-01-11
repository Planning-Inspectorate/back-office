import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getContactMethod, postContactMethod } from './contact-method.controller.js';
import { contactMethodValidation } from './contact-method.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepContactMethod = createRouter({ mergeParams: true });

relevantRepContactMethod
	.route(repRoutes.contactMethod)
	.get(addRepresentationToLocals, asyncHandler(getContactMethod))
	.post(addRepresentationToLocals, contactMethodValidation, asyncHandler(postContactMethod));

export default relevantRepContactMethod;
