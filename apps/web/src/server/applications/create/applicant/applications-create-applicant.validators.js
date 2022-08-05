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

export const validateApplicationsCreateApplicantEmail = createValidator(
	body('applicant.email')
		.optional({ checkFalsy: true })
		.trim()
		.isEmail({
			allow_display_name: false,
			require_tld: true,
			allow_ip_domain: false
		})
		.withMessage('Enter a valid email address')
);

// validate telephone number: digits or + or space only (+ only allowed 1st char). between 10-12 digits.
export const validateApplicationsCreateApplicantTelephoneNumber = createValidator(
	body('applicant.phoneNumber')
		.optional({ checkFalsy: true })
		.trim()
		.matches(/^\+?(?:\d\s?){10,12}$/g)
		.withMessage('Enter a phone number e.g. 01632 960 001, 07700 900 982 or +44 808 157 0192')
);

export const validateApplicationsCreateApplicantPostCode = createValidator(
	body('postcode')
		.custom((value) =>
			value
				.replace(/\s*/g, '')
				.match(
					/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z]\d{1,2})|(([A-Za-z][A-HJ-Ya-hj-y]\d{1,2})|(([A-Za-z]\d[A-Za-z])|([A-Za-z][A-HJ-Ya-hj-y]\d[A-Za-z]?))))\s?\d[A-Za-z]{2})$/
				)
		)
		.withMessage('Enter a valid postcode'),
	body('apiReference').trim().not().equals('-1')
.withMessage('Choose an address from the list')
);
