import {
	validateRepresentedAddress,
	validateRepresentedContactMethod,
	validateType,
	validateRepresentedUnder18,
	validateRepresentationEntity,
	validateRepresentativeName,
	validateRepresentativeAddress,
	validateRepresentativeContactMethod,
	validateOriginalRepresentation
} from './utils/common-validators.js';

export const checkAnswersValidation = [
	validateRepresentedAddress,
	validateRepresentedContactMethod,
	validateType,
	validateRepresentedUnder18,
	validateRepresentationEntity,
	validateRepresentativeName,
	validateRepresentativeAddress,
	validateRepresentativeContactMethod,
	validateOriginalRepresentation
];
