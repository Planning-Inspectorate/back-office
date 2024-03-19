import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getAddressDetailsController,
	postAddressDetailsController
} from './address-details.controller.js';
import { addressDetailsValidation } from './address-details.validators.js';
import { addQueryToLocals, addRepresentationToLocals } from '../representation.middleware.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';
import { registerCaseId } from '../../applications-relevant-reps.locals.js';

const relevantRepAddressDetailsRouter = createRouter({ mergeParams: true });

relevantRepAddressDetailsRouter.use(registerCaseId);

relevantRepAddressDetailsRouter
	.route(repRoutes.addressDetails)
	.get(addRepresentationToLocals, asyncHandler(getAddressDetailsController))
	.post(
		addRepresentationToLocals,
		addQueryToLocals,
		addressDetailsValidation,
		asyncHandler(postAddressDetailsController)
	);

export default relevantRepAddressDetailsRouter;
