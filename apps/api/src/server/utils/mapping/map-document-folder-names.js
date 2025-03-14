import {
	DOCUMENTS_FOLDER_MAP,
	DOCUMENT_CASE_STAGE_ACCEPTANCE,
	ACCEPTANCE_STAGE_SUBFOLDERS
} from '#api-constants';
import { applicationDocumentsFolderNamesCy } from '../../applications/translations.js';

const {
	APPLICATION_FORM,
	COMPULSORY_ACQUISITION_INFORMATION,
	DCO_DOCUMENTS,
	ENVIRONMENTAL_STATEMENT,
	OTHER_DOCUMENTS,
	PLANS,
	REPORTS,
	ADDITIONAL_REG_6_INFORMATION
} =
	DOCUMENTS_FOLDER_MAP[DOCUMENT_CASE_STAGE_ACCEPTANCE][
		ACCEPTANCE_STAGE_SUBFOLDERS.APPLICATION_DOCUMENTS
	];

const mapApplicationDocumnetsFolderNames = {
	[APPLICATION_FORM]: {
		en: 'Application Form',
		cy: applicationDocumentsFolderNamesCy[APPLICATION_FORM]
	},
	[COMPULSORY_ACQUISITION_INFORMATION]: {
		en: 'Adequacy of Consultation Representation',
		cy: applicationDocumentsFolderNamesCy[COMPULSORY_ACQUISITION_INFORMATION]
	},
	[DCO_DOCUMENTS]: {
		en: 'Draft Development Consent Order',
		cy: applicationDocumentsFolderNamesCy[DCO_DOCUMENTS]
	},
	[ENVIRONMENTAL_STATEMENT]: {
		en: 'Environmental Statement',
		cy: applicationDocumentsFolderNamesCy[ENVIRONMENTAL_STATEMENT]
	},
	[OTHER_DOCUMENTS]: {
		en: 'Other Documents',
		cy: applicationDocumentsFolderNamesCy[OTHER_DOCUMENTS]
	},
	[PLANS]: {
		en: PLANS,
		cy: applicationDocumentsFolderNamesCy[PLANS]
	},
	[REPORTS]: {
		en: REPORTS,
		cy: applicationDocumentsFolderNamesCy[REPORTS]
	},
	[ADDITIONAL_REG_6_INFORMATION]: {
		en: 'Additional Reg 6 Information',
		cy: applicationDocumentsFolderNamesCy[ADDITIONAL_REG_6_INFORMATION]
	}
};

/**
 * Get the acceptance folder names based on the folder name and language
 * @param {string} folderName
 * @param {string?} lang
 * @returns {object|string}
 */

export const getApplicationDocumentsFolderName = (folderName, lang) => {
	return lang
		? mapApplicationDocumnetsFolderNames[folderName][lang]
		: mapApplicationDocumnetsFolderNames[folderName];
};
