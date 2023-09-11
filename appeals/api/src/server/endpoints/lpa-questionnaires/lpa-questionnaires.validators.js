import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_STRING,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	MAX_LENGTH_4000
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateNumberArrayParameter from '#common/validators/number-array-parameter.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';
import validateBooleanParameter from '#common/validators/boolean-parameter.js';
import validateBooleanWithConditionalStringParameters from '#common/validators/boolean-with-conditional-string-parameters.js';
import validateNumberParameter from '#common/validators/number-parameter.js';

const getLPAQuestionnaireValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('lpaQuestionnaireId'),
	validationErrorHandler
);

const patchLPAQuestionnaireValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('lpaQuestionnaireId'),
	validateNumberArrayParameter(
		'incompleteReasons',
		(
			/** @type {any} */ value,
			/** @type {{req: {body: { validationOutcome: string}}}} */ { req }
		) => {
			if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			return value;
		}
	),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: MAX_LENGTH_4000 })
		.withMessage(errorMessageReplacement(ERROR_MAX_LENGTH_CHARACTERS, [MAX_LENGTH_4000]))
		.custom((value, { req }) => {
			if (
				value &&
				!isOutcomeIncomplete(req.body.validationOutcome) &&
				!isOutcomeInvalid(req.body.validationOutcome)
			) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS);
			}

			return value;
		}),
	body('validationOutcome')
		.optional()
		.isString()
		.custom((value, { req }) => {
			if (isOutcomeIncomplete(value) && !req.body.incompleteReasons) {
				throw new Error(ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			return value;
		}),
	validateDateParameter({
		parameterName: 'lpaQuestionnaireDueDate',
		mustBeFutureDate: true,
		customFn: (
			/** @type {any} */ value,
			/** @type {{ req: { body: { validationOutcome: string } } }} */ { req }
		) => {
			if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			return value;
		}
	}),
	validateBooleanParameter('isListedBuilding'),
	validateBooleanParameter('doesAffectAListedBuilding'),
	validateBooleanParameter('doesAffectAScheduledMonument'),
	validateBooleanParameter('isConservationArea'),
	validateBooleanParameter('hasProtectedSpecies'),
	validateBooleanParameter('isTheSiteWithinAnAONB'),
	validateNumberArrayParameter('designatedSites'),
	validateBooleanParameter('hasTreePreservationOrder'),
	validateBooleanParameter('isGypsyOrTravellerSite'),
	validateBooleanParameter('isPublicRightOfWay'),
	validateNumberParameter('scheduleType'),
	validateBooleanParameter('isEnvironmentalStatementRequired'),
	validateBooleanParameter('hasCompletedAnEnvironmentalStatement'),
	validateBooleanParameter('includesScreeningOption'),
	validateBooleanWithConditionalStringParameters('isSensitiveArea', 'sensitiveAreaDetails', true),
	validateBooleanParameter('meetsOrExceedsThresholdOrCriteriaInColumn2'),
	validationErrorHandler
);

export { getLPAQuestionnaireValidator, patchLPAQuestionnaireValidator };
