export const VALIDATION_OUTCOME_COMPLETE = 'Complete';
export const VALIDATION_OUTCOME_INCOMPLETE = 'Incomplete';
export const VALIDATION_OUTCOME_INVALID = 'Invalid';
export const VALIDATION_OUTCOME_VALID = 'Valid';

export const APPEAL_TYPE_SHORTHAND_FPA = 'FPA';
export const APPEAL_TYPE_SHORTHAND_HAS = 'HAS';

export const AUDIT_TRAIL_ASSIGNED_CASE_OFFICER =
	'The case officer {replacement0} was added to the team';
export const AUDIT_TRAIL_ASSIGNED_INSPECTOR =
	'The inspector {replacement0} was assigned to the team';

export const BANK_HOLIDAY_FEED_DIVISION_ENGLAND = 'england-and-wales';

export const DATABASE_ORDER_BY_ASC = 'asc';
export const DATABASE_ORDER_BY_DESC = 'desc';

export const DEFAULT_DATE_FORMAT_DATABASE = 'yyyy-MM-dd';
export const DEFAULT_DATE_FORMAT_DISPLAY = 'dd LLL yyyy';
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 30;
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_TIMESTAMP_TIME = '01:00:00.000';

export const DOCUMENT_STATUS_NOT_RECEIVED = 'not_received';
export const DOCUMENT_STATUS_RECEIVED = 'received';

export const ERROR_APPEAL_ALLOCATION_LEVELS = 'Invalid allocation level';
export const ERROR_APPEAL_ALLOCATION_SPECIALISMS = 'Invalid allocation specialism';
export const ERROR_CANNOT_BE_EMPTY_STRING = 'Cannot be an empty string';
export const ERROR_DOCUMENT_REDACTION_STATUSES_MUST_BE_ONE_OF =
	'Document redaction statuses must be one of {replacement0}';
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
export const ERROR_MAX_LENGTH_CHARACTERS = 'Must be {replacement0} characters or less';
export const ERROR_MUST_BE_ARRAY_OF_NUMBERS = 'Must be an array of numbers';
export const ERROR_MUST_BE_BOOLEAN = 'Must be a boolean';
export const ERROR_MUST_BE_BUSINESS_DAY = 'Must be a business day';
export const ERROR_MUST_BE_CORRECT_DATE_FORMAT = `Must be a valid date and in the format ${DEFAULT_DATE_FORMAT_DATABASE}`;
export const ERROR_MUST_BE_CORRECT_TIME_FORMAT = 'Must be a valid time and in the format hh:mm';
export const ERROR_MUST_BE_GREATER_THAN_ZERO = 'Must be greater than 0';
export const ERROR_MUST_BE_IN_FUTURE = 'Must be in the future';
export const ERROR_MUST_BE_INCOMPLETE_INVALID_REASON =
	'Must be an array of objects containing a required id number parameter and an optional text string array parameter containing 10 or less items';
export const ERROR_MUST_BE_NUMBER = 'Must be a number';
export const ERROR_MUST_BE_SET_AS_HEADER = 'Must be set as a header';
export const ERROR_MUST_BE_STRING = 'Must be a string';
export const ERROR_MUST_BE_UUID = 'Must be a uuid';
export const ERROR_MUST_BE_VALID_FILEINFO = 'Must be a valid file';
export const ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE = 'Must contain at least one value';
export const ERROR_MUST_HAVE_DETAILS =
	'Must have {replacement0} when {replacement1} is {replacement2}';
export const ERROR_MUST_NOT_HAVE_DETAILS =
	'Must not have {replacement0} when {replacement1} is {replacement2}';
export const ERROR_MUST_NOT_HAVE_TIMETABLE_DATE =
	'Must not be included for a {replacement0} appeal type';
export const ERROR_NOT_FOUND = 'Not found';
export const ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME = `Should only be given if the validation outcome is ${VALIDATION_OUTCOME_INCOMPLETE}`;
export const ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME = `Should only be given if the validation outcome is ${VALIDATION_OUTCOME_INVALID}`;
export const ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED =
	'Both pageNumber and pageSize are required for pagination';
export const ERROR_SITE_VISIT_REQUIRED_FIELDS =
	'If any of visitDate, visitStartTime or visitEndTime are given then all these fields are required';
export const ERROR_START_TIME_MUST_BE_EARLIER_THAN_END_TIME =
	'Start time must be earlier than end time';
export const ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED =
	'Validation outcome reasons are required when validationOutcome is Incomplete or Invalid';
export const ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED =
	'Validation outcome reasons are required when validationOutcome is Incomplete';

export const LENGTH_1 = 1;
export const LENGTH_8 = 8;
export const LENGTH_10 = 10;
export const LENGTH_300 = 300;

export const NODE_ENV_PRODUCTION = 'production';

export const SITE_VISIT_TYPE_UNACCOMPANIED = 'Unaccompanied';

export const STATE_TARGET_ARRANGE_SITE_VISIT = 'arrange_site_visit';
export const STATE_TARGET_COMPLETE = 'complete';
export const STATE_TARGET_FINAL_COMMENT_REVIEW = 'final_comment_review';
export const STATE_TARGET_INVALID = 'invalid';
export const STATE_TARGET_ISSUE_DETERMINATION = 'issue_determination';
export const STATE_TARGET_LPA_QUESTIONNAIRE_DUE = 'lpa_questionnaire_due';
export const STATE_TARGET_READY_TO_START = 'ready_to_start';
export const STATE_TARGET_STATEMENT_REVIEW = 'statement_review';

export const STATE_TYPE_FINAL = 'final';

export const USER_TYPE_CASE_OFFICER = 'caseOfficer';
export const USER_TYPE_INSPECTOR = 'inspector';

export const AUDIT_TRAIL_SYSTEM_UUID = '00000000-0000-0000-0000-000000000000';
export const AUDIT_TRAIL_APPELLANT_IMPORT_MSG = 'The Appellant case was received';
export const AUDIT_TRAIL_LPAQ_IMPORT_MSG = 'The LPA questionnaire was received';
