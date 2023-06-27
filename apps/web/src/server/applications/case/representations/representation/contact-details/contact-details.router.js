import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getContactDetails, postContactDetails } from './contact-details.controller.js';
import { contactDetailsValidation } from './contact-details.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepContactDetails = createRouter({ mergeParams: true });

relevantRepContactDetails
	.route(repRoutes.contactDetails)
	.get(addRepresentationToLocals, asyncRoute(getContactDetails))
	.post(addRepresentationToLocals, contactDetailsValidation, asyncRoute(postContactDetails));

export default relevantRepContactDetails;
