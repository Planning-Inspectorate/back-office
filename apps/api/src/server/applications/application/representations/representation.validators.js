import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/error-handler.js';

const isStrictTypeBoolean = async (value) => {
	if (typeof value !== 'boolean') throw new TypeError(`Must be a boolean or null`);
};

const isStrictTypeBooleanOrNull = async (value) => {
	if (typeof value !== 'boolean' && value !== null)
		throw new TypeError(`Must be a boolean or null`);
};

export const representationsStatusesList = [
	'AWAITING_REVIEW',
	'REFERRED',
	'INVALID',
	'VALID',
	'PUBLISHED',
	'WITHDRAWN',
	'ARCHIVED',
	'DRAFT'
];

const repTypes = [
	'Local authorities',
	'Members of the public/businesses',
	'Non-statutory organisations',
	'Statutory consultees',
	'Parish councils'
];

const contactTypes = ['AGENT', 'ORGANISATION', 'PERSON', 'FAMILY_GROUP'];

const representedValidations = () => {
	const keys = ['represented', 'representative'];
	let arrs = [];
	keys.forEach((el) => {
		arrs = [
			...arrs,
			body(`${el}.organisationName`).optional().exists({ checkFalsy: true, checkNull: true }),
			body(`${el}.jobTitle`).optional().isString().exists({ checkFalsy: true, checkNull: true }),
			body(`${el}.firstName`)
				.optional()
				.isString()
				.exists({ checkFalsy: true, checkNull: true })
				.isLength({ min: 1, max: 64 }),
			body(`${el}.lastName`)
				.optional()
				.exists({ checkFalsy: true, checkNull: true })
				.isLength({ min: 1, max: 64 }),
			body(`${el}.email`).optional().isEmail().withMessage('is not a valid email'),
			body(`${el}.phoneNumber`)
				.optional()
				.matches(/^\+?(?:\d\s?){10,12}$/)
				.withMessage('is not a valid phone number'),
			body(`${el}.type`)
				.optional()
				.isIn(contactTypes)
				.withMessage(`Must be a valid type: ${contactTypes}`),
			body(`${el}.under18`).optional().custom(isStrictTypeBooleanOrNull)
		];
	});
	return [...arrs];
};

export const representationPatchValidator = composeMiddleware(
	body('status')
		.optional()
		.isString()
		.isIn(representationsStatusesList)
		.withMessage(`Must be a valid status: ${representationsStatusesList}`),
	body('redacted').optional().custom(isStrictTypeBoolean),
	body('received').optional(),
	body('originalRepresentation').optional().isString(),
	body('reference').optional().isString(),
	body('type').optional().isIn(repTypes).withMessage(`Must be a valid type: ${repTypes}`),
	representedValidations(),
	validationErrorHandler
);
