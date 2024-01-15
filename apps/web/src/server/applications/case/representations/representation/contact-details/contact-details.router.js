import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getContactDetails, postContactDetails } from './contact-details.controller.js';
import { contactDetailsValidation } from './contact-details.validators.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';

const relevantRepContactDetails = createRouter({ mergeParams: true });

relevantRepContactDetails
	.route(repRoutes.contactDetails)
	.get(addRepresentationToLocals, asyncHandler(getContactDetails))
	.post(addRepresentationToLocals, contactDetailsValidation, asyncHandler(postContactDetails));

export default relevantRepContactDetails;
