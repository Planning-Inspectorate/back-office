import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateRepresentedAddress = createValidator(
	body('represented.address.postcode').notEmpty().withMessage('Enter address details')
);

export const validateRepresentedContactMethod = createValidator(
	body('represented.contactMethod').notEmpty().withMessage('Enter preferred method of contact')
);

export const validateType = createValidator(body('type').notEmpty().withMessage('Enter type'));

export const validateRepresentedUnder18 = createValidator(
	body('represented.under18').notEmpty().withMessage('Enter Under 18')
);

export const validateRepresentationEntity = createValidator(
	body('represented.type').notEmpty().withMessage('Enter on behalf of')
);

export const validateRepresentativeName = createValidator(
	body('representative.firstName').notEmpty().withMessage('Enter agent contact details')
);

export const validateRepresentativeAddress = createValidator(
	body('representative.address.postcode').notEmpty().withMessage('Enter agent address details')
);

export const validateRepresentativeContactMethod = createValidator(
	body('representative.contactMethod')
		.notEmpty()
		.withMessage('Enter agent preferred method of contact')
);

export const validateOriginalRepresentation = createValidator(
	body('originalRepresentation').notEmpty().withMessage('Enter representation')
);
