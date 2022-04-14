// @ts-check

import { createValidator } from "@pins/express";
import { validatePostcode } from "@pins/platform";
import { body } from "express-validator";

export const validateAppellantName = createValidator(
	body('AppellantName')
		.isString()
		.withMessage('`AppellantName` is not a valid string')
		.bail()
		.trim()
		.withMessage('Enter a valid appellant name')
		.isLength({ min: 1 })
		.withMessage('Enter an appellant name')
		.isLength({ max: 500 })
		.withMessage('Appellant name must be 500 characters or fewer')
);

export const validateAppealSite = createValidator(
	body('Address.AddressLine1')
		.isString()
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the first line of the address')
		.isLength({ max: 500 })
		.withMessage('First line of the address must be 500 characters or fewer'),
	body('Address.AddressLine2')
		.optional({ nullable: true })
		.isString()
		.bail()
		.trim()
		.isLength({ max: 500 })
		.withMessage('Second line of the address must be 500 characters or fewer'),
	body('Address.Town')
		.isString()
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a town or city')
		.isLength({ max: 500 })
		.withMessage('Town or city must be 500 characters or fewer'),
	body('Address.County')
		.optional({ nullable: true })
		.isString()
		.bail()
		.trim()
		.isLength({ max: 500 }),
	body('Address.PostCode')
		.isString()
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a postcode')
		.custom(validatePostcode)
		.withMessage('Enter a real postcode')
);

export const validateLocalPlanningDepartment = createValidator(
	body('LocalPlanningDepartment')
		.isString()
		.withMessage('`LocalPlanningDepartment` is not a valid string')
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Select a local planning department')
		.isLength({ max: 500 })
		.withMessage('Enter a valid local planning department')
);

export const validatePlanningApplicationReference = createValidator(
	body('PlanningApplicationReference')
		.isString()
		.withMessage('`PlanningApplicationReference` is not a valid string')
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a planning application reference')
		.isLength({ max: 50 })
		.withMessage('Planning application reference must be 50 characters or fewer')
);
