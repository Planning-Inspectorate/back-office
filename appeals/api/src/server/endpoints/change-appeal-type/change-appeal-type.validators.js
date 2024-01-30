import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateStringParameter from '#common/validators/string-parameter.js';

const postAppealTypeChangeValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter({
		parameterName: 'newAppealTypeFinalDate',
		mustBeFutureDate: true,
		mustBeBusinessDay: true
	}),
	validationErrorHandler
);

const postAppealTypeTransferValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validationErrorHandler
);

const postAppealTypeTransferConfirmationValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateStringParameter('newAppealReference'),
	validationErrorHandler
);

export {
	postAppealTypeChangeValidator,
	postAppealTypeTransferValidator,
	postAppealTypeTransferConfirmationValidator
};
