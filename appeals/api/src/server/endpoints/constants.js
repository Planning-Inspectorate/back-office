export const VALIDATION_OUTCOME_COMPLETE = 'Complete';
export const VALIDATION_OUTCOME_INCOMPLETE = 'Incomplete';
export const VALIDATION_OUTCOME_INVALID = 'Invalid';
export const VALIDATION_OUTCOME_VALID = 'Valid';

export const APPEAL_TYPE_SHORTHAND_FPA = 'FPA';
export const APPEAL_TYPE_SHORTHAND_HAS = 'HAS';

export const BANK_HOLIDAY_FEED_DIVISION_ENGLAND = 'england-and-wales';

export const DEFAULT_DATE_FORMAT_DATABASE = 'yyyy-MM-dd';
export const DEFAULT_DATE_FORMAT_DISPLAY = 'dd LLL yyyy';
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 30;
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_TIMESTAMP_TIME = '01:00:00.000';

export const DOCUMENT_STATUS_NOT_RECEIVED = 'not_received';
export const DOCUMENT_STATUS_RECEIVED = 'received';

export const ERROR_FAILED_TO_GET_DATA = 'Failed to get data';
export const ERROR_FAILED_TO_SAVE_DATA = 'Failed to save data';
export const ERROR_FAILED_TO_SEND_NOTIFICATION_EMAIL = 'Failed to send notification email';
export const ERROR_GOV_NOTIFY_API_KEY_NOT_SET = 'Gov Notify API key is not set';
export const ERROR_INVALID_APPEAL_TYPE = `Must be one of ${APPEAL_TYPE_SHORTHAND_FPA}, ${APPEAL_TYPE_SHORTHAND_HAS}`;
export const ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME = `Must be one of ${VALIDATION_OUTCOME_INCOMPLETE}, ${VALIDATION_OUTCOME_INVALID}, ${VALIDATION_OUTCOME_VALID}`;
export const ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME = `Must be one of ${VALIDATION_OUTCOME_COMPLETE}, ${VALIDATION_OUTCOME_INCOMPLETE}`;
export const ERROR_INVALID_SITE_VISIT_TYPE =
	'Must be one of access required, accompanied, unaccompanied';
export const ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS = 'Must be between 2 and 8 characters';
export const ERROR_MAX_LENGTH_300_CHARACTERS = 'Must be 300 characters or less';
export const ERROR_MUST_BE_ARRAY_OF_IDS = 'Must be an array of ids';
export const ERROR_MUST_BE_CORRECT_DATE_FORMAT = `Must be a valid date and in the format ${DEFAULT_DATE_FORMAT_DATABASE}`;
export const ERROR_MUST_BE_CORRECT_TIME_FORMAT = `Must be a valid time and in the format hh:mm`;
export const ERROR_MUST_BE_GREATER_THAN_ZERO = 'Must be greater than 0';
export const ERROR_MUST_BE_NUMBER = 'Must be a number';
export const ERROR_MUST_BE_STRING = 'Must be a string';
export const ERROR_MUST_BE_GUID = 'Must be a guid';
export const ERROR_MUST_BE_VALID_FILEINFO = 'Must be a valid file';
export const ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE = 'Must contain at least one value';
export const ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS =
	'Must not be included when invalidReasons or incompleteReasons does not contain Other';
export const ERROR_NOT_FOUND = 'Not found';
export const ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME = `Should only be given if the validation outcome is ${VALIDATION_OUTCOME_INCOMPLETE}`;
export const ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME = `Should only be given if the validation outcome is ${VALIDATION_OUTCOME_INVALID}`;
export const ERROR_OTHER_NOT_VALID_REASONS_REQUIRED =
	'Required when invalidReasons or incompleteReasons contains Other';
export const ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED =
	'Both pageNumber and pageSize are required for pagination';
export const ERROR_SITE_VISIT_REQUIRED_FIELDS =
	'If any of visitDate, visitStartTime or visitEndTime are given then all these fields are required';
export const ERROR_START_TIME_MUST_BE_EARLIER_THAN_END_TIME =
	'Start time must be earlier than end time';
export const ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS =
	'Should not include validation outcome reasons when validationOutcome is Valid';
export const ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED =
	'Validation outcome reasons are required when validationOutcome is Incomplete or Invalid';
export const ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED =
	'Validation outcome reasons are required when validationOutcome is Incomplete';

export const STATE_TARGET_ARRANGE_SITE_VISIT = 'arrange_site_visit';
export const STATE_TARGET_COMPLETE = 'complete';
export const STATE_TARGET_FINAL_COMMENT_REVIEW = 'final_comment_review';
export const STATE_TARGET_INVALID = 'invalid';
export const STATE_TARGET_ISSUE_DETERMINATION = 'issue_determination';
export const STATE_TARGET_LPA_QUESTIONNAIRE_DUE = 'lpa_questionnaire_due';
export const STATE_TARGET_READY_TO_START = 'ready_to_start';
export const STATE_TARGET_STATEMENT_REVIEW = 'statement_review';

export const STATE_TYPE_FINAL = 'final';

export const ERROR_APPEAL_ALLOCATION_LEVELS = 'Invalid allocation level';
export const ERROR_APPEAL_ALLOCATION_SPECIALISMS = 'Invalid allocation specialism';
