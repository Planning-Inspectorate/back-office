export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 25;

export const SYSTEM_USER_NAME = 'System';

/**
 * These are used in documentType the Document table
 */
export const DOCUMENT_TYPES = {
	Document: 'document',
	S51Attachment: 's51-attachment',
	RelevantRepresentation: 'relevant-representation'
};

/**
 * These are used in documentType in the DocumentVersion table
 */
export const DOCUMENT_VERSION_TYPES = {
	DCODecisionLetterApprove: 'DCO decision letter (SoS)(approve)',
	DCODecisionLetterRefuse: 'DCO decision letter (SoS)(refuse)',
	EventRecording: 'Event recording',
	Rule6Letter: 'Rule 6 letter',
	Rule8Letter: 'Rule 8 letter',
	ExamLibrary: 'Exam library'
};

// Define all the document case stages that can be mapped to folders
export const DOCUMENT_CASE_STAGE_ACCEPTANCE = 'Acceptance';
const DOCUMENT_CASE_STAGE_DECISION = 'Decision';
const DOCUMENT_CASE_STAGE_DEVELOPERS_APPLICATION = "Developer's Application";
const DOCUMENT_CASE_STAGE_EXAMINATION = 'Examination';
const DOCUMENT_CASE_STAGE_POST_DECISION = 'Post-decision';
const DOCUMENT_CASE_STAGE_PRE_APPLICATION = 'Pre-application';
const DOCUMENT_CASE_STAGE_PRE_EXAMINATION = 'Pre-examination';
const DOCUMENT_CASE_STAGE_RECOMMENDATION = 'Recommendation';
const DOCUMENT_CASE_STAGE_RELEVANT_REP = 'Relevant representation attachment'; // NOTE: this is broadcast as '0' to service bus - special value required by Front Office
const DOCUMENT_CASE_STAGE_S51_ADVICE = '0'; // special value required by Front Office

// Define top level document case stage mappings, so we can change in one single place if needed
export const folderDocumentCaseStageMappings = {
	PROJECT_MANAGEMENT: null,
	CORRESPONDENCE: null,
	LEGAL_ADVICE: null,
	TRANSBOUNDARY: DOCUMENT_CASE_STAGE_PRE_APPLICATION,
	LAND_RIGHTS: null,
	S51_ADVICE: DOCUMENT_CASE_STAGE_S51_ADVICE,
	PRE_APPLICATION: DOCUMENT_CASE_STAGE_PRE_APPLICATION,
	ACCEPTANCE: DOCUMENT_CASE_STAGE_ACCEPTANCE,
	DEVELOPERS_APPLICATION: DOCUMENT_CASE_STAGE_DEVELOPERS_APPLICATION,
	PRE_EXAMINATION: DOCUMENT_CASE_STAGE_PRE_EXAMINATION,
	RELEVANT_REPRESENTATIONS: DOCUMENT_CASE_STAGE_RELEVANT_REP,
	EXAMINATION: DOCUMENT_CASE_STAGE_EXAMINATION,
	RECOMMENDATION: DOCUMENT_CASE_STAGE_RECOMMENDATION,
	DECISION: DOCUMENT_CASE_STAGE_DECISION,
	POST_DECISION: DOCUMENT_CASE_STAGE_POST_DECISION
};

export const ACCEPTANCE_STAGE_SUBFOLDERS = {
	EVENTS_MEETINGS: 'Events / meetings',
	CORRESPONDENCE: 'Correspondence',
	EST: 'EST',
	APPLICATION_DOCUMENTS: 'Application documents',
	ADEQUACY_OF_CONSULTATION: 'Adequacy of consultation',
	REG_5_AND_6: 'Reg 5 and Reg 6',
	DRAFTING_AND_DECISION: 'Drafting and decision'
};

//Document folder structure
//to be expanded as needed, ideally covering all the document case stages
export const DOCUMENTS_FOLDER_MAP = {
	[DOCUMENT_CASE_STAGE_ACCEPTANCE]: {
		[ACCEPTANCE_STAGE_SUBFOLDERS.APPLICATION_DOCUMENTS]: {
			APPLICATION_FORM: 'Application form',
			COMPULSORY_ACQUISITION_INFORMATION: 'Compulsory acquisition information',
			DCO_DOCUMENTS: 'DCO documents',
			ENVIRONMENTAL_STATEMENT: 'Environmental statement',
			OTHER_DOCUMENTS: 'Other documents',
			PLANS: 'Plans',
			REPORTS: 'Reports',
			ADDITIONAL_REG_6_INFORMATION: 'Additional Reg 6 information'
		}
	}
};

/**
 * who is making the representation?
 * Stored in CBOS field Representation.representedType,
 * and in ODW as representationFrom
 */
export const REPRESENTATION_FROM_TYPE = {
	AGENT: 'AGENT',
	ORGANISATION: 'ORGANISATION',
	PERSON: 'PERSON'
};
