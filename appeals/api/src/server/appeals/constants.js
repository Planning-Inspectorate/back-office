export const APPEAL_TYPE_SHORTCODE_FPA = 'FPA';
export const APPEAL_TYPE_SHORTCODE_HAS = 'HAS';

export const APPELLANT_CASE_VALIDATION_OUTCOME_INCOMPLETE = 'Incomplete';
export const APPELLANT_CASE_VALIDATION_OUTCOME_INVALID = 'Invalid';
export const APPELLANT_CASE_VALIDATION_OUTCOME_VALID = 'Valid';

export const BANK_HOLIDAY_FEED_DIVISION_ENGLAND = 'england-and-wales';
export const BANK_HOLIDAY_FEED_URL = 'https://www.gov.uk/bank-holidays.json';

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 30;

export const DOCUMENT_STATUS_NOT_RECEIVED = 'not_received';
export const DOCUMENT_STATUS_RECEIVED = 'received';

export const ERROR_FAILED_TO_GET_DATA = 'Failed to get data';
export const ERROR_FAILED_TO_SAVE_DATA = 'Failed to save data';
export const ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME =
	'Incomplete reasons should only be given if the validation outcome is Incomplete';
export const ERROR_INVALID_REASONS_ONLY_FOR_INVALID_OUTCOME =
	'Invalid reasons should only be given if the validation outcome is Invalid';
export const ERROR_INVALID_VALIDATION_OUTCOME = `Validation outcome must be one of ${APPELLANT_CASE_VALIDATION_OUTCOME_INCOMPLETE}, ${APPELLANT_CASE_VALIDATION_OUTCOME_INVALID}, ${APPELLANT_CASE_VALIDATION_OUTCOME_VALID}`;
export const ERROR_MAX_LENGTH_300 = 'Must be 300 characters or less';
export const ERROR_MUST_BE_ARRAY_OF_IDS = 'Must be an array of ids';
export const ERROR_MUST_BE_CORRECT_DATE_FORMAT =
	'Must be a valid date and in the format yyyy-mm-dd';
export const ERROR_MUST_BE_GREATER_THAN_ZERO = 'Must be greater than 0';
export const ERROR_MUST_BE_NUMBER = 'Must be a number';
export const ERROR_MUST_BE_STRING = 'Must be a string';
export const ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE = 'Must contain at least one value';
export const ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS =
	'Must not be included when invalidReasons or incompleteReasons does not contain Other';
export const ERROR_NOT_FOUND = 'Not found';
export const ERROR_OTHER_NOT_VALID_REASONS_REQUIRED =
	'Required when invalidReasons or incompleteReasons contains Other';
export const ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED =
	'Both pageNumber and pageSize are required for pagination';
export const ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS =
	'Should not include validation outcome reasons when validationOutcome is Valid';
export const ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED =
	'Validation outcome reasons are required when validationOutcome is Incomplete or Invalid';
