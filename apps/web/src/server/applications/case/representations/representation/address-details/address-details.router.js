import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import {
	getAddressDetailsController,
	postAddressDetailsController
} from './address-details.controller.js';
import { addressDetailsValidation } from './address-details.validators.js';
import { addRepresentationToLocals } from '../representation.middleware.js';

const relevantRepAddressDetailsRouter = createRouter({ mergeParams: true });

relevantRepAddressDetailsRouter
	.route('/address-details')
	.get(addRepresentationToLocals, asyncRoute(getAddressDetailsController))
	.post(
		addRepresentationToLocals,
		addressDetailsValidation,
		asyncRoute(postAddressDetailsController)
	);

export default relevantRepAddressDetailsRouter;
