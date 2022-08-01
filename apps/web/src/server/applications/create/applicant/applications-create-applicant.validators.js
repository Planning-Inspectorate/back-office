import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateApplicantWebsite = createValidator(
	// regex check added to exclude @ signs, which for some reason are valid in isUrl
	body('applicant.website')
		.optional({ checkFalsy: true })
		.trim()
		.matches(/^[^@]*$/)
		.withMessage('Enter a valid website')
		.isURL({
			require_tld: true,
			require_port: false,
			allow_trailing_dot: false,
			allow_protocol_relative_urls: false,
			allow_query_components: false,
			allow_fragments: false
		})
		.withMessage('Enter a valid website')
);
