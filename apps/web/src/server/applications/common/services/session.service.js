/**
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 * @typedef {import('express-session').Session & { caseHasNeverBeenResumed?: boolean }} SessionWithCaseHasNeverBeenResumed
 * @typedef {import('express-session').Session & { infoTypes?: string[] }} SessionWithApplicationsCreateApplicantInfoTypes
 * @typedef {import('express-session').Session & { filesNumberOnList?: number }} SessionWithFilesNumberOnList
 * @typedef {import('express-session').Session & { showSuccessBanner?: boolean }} SessionWithSuccessBanner
 * @typedef {import('express-session').Session & { 
 *	moveDocuments: { 
 *		documentationFilesToMove: object[],
 *		parentFolderId: number,
 * 		folderList: object[],
 * 		isFolderRoot: boolean,
 * 		rootFolderList: object[]
 *	} 
 * }} MoveDocumentsSession
*/

// Applicant session management

/**
 * Save in the session the list of information types to be provided in the create-new-applicant form.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @param {string[]} infoTypes
 * @returns {void}
 */
export const setSessionApplicantInfoTypes = (session, infoTypes) => {
	session.infoTypes = ['applicant-information-types', ...infoTypes];
};

/**
 * Retrieve the applicant information types from the session.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @returns {string[]}
 */
export const getSessionApplicantInfoTypes = (session) => {
	return session.infoTypes ?? [];
};

/**
 * Clear the list of applicant information types
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @returns {void}
 */
export const destroySessionApplicantInfoTypes = (session) => {
	delete session.infoTypes;
};

// Applications session management

/**
 * Save in the session the list of information types to be provided in the create-new-applicant form.
 *
 * @param {SessionWithCaseSectorName} session
 * @param {string|undefined} selectedCaseSectorName
 * @returns {void}
 */
export const setSessionCaseSectorName = (session, selectedCaseSectorName) => {
	session.caseSectorName = selectedCaseSectorName;
};

/**
 * Retrieve the applicant information types from the session.
 *
 * @param {SessionWithCaseSectorName} session
 * @returns {string|undefined}
 */
export const getSessionCaseSectorName = (session) => {
	return session.caseSectorName;
};

/**
 * Clear the case sector from the session.
 *
 * @param {SessionWithCaseSectorName} session
 * @returns {void}
 */
export const destroySessionCaseSectorName = (session) => {
	delete session.caseSectorName;
};

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {void}
 */
export const setSessionCaseHasNeverBeenResumed = (session) => {
	session.caseHasNeverBeenResumed = true;
};

/**
 * Retrieve the session info about the form being resumed or not.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {boolean|undefined}
 */
export const getSessionCaseHasNeverBeenResumed = (session) => {
	return session.caseHasNeverBeenResumed;
};

/**
 * Destroy session info when form gets resumed.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {void}
 */
export const destroySessionCaseHasNeverBeenResumed = (session) => {
	delete session.caseHasNeverBeenResumed;
};

// Files list

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithFilesNumberOnList} session
 * @param {number} newFilesNumberOnList
 * @returns {void}
 */
export const setSessionFilesNumberOnList = (session, newFilesNumberOnList) => {
	session.filesNumberOnList = newFilesNumberOnList;
};

/**
 * Retrieve the session info about the form being resumed or not.
 *
 * @param {SessionWithFilesNumberOnList} session
 * @returns {number|undefined}
 */
export const getSessionFilesNumberOnList = (session) => {
	return session.filesNumberOnList;
};

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {void}
 */
export const setSuccessBanner = (session) => {
	session.showSuccessBanner = true;
};

/**
 * Get session
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {boolean|undefined}
 */
export const getSuccessBanner = (session) => {
	return session.showSuccessBanner;
};

/**
 * Destroy session info when form gets resumed.
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {void}
 */
export const destroySuccessBanner = (session) => {
	delete session.showSuccessBanner;
};

/**
 * Session data is used for the success banner on the project updates page and overview page
 * It is deleted once read, as it only applies once
 *
 * @typedef {import('express-session').Session & { banner?: string }} BannerSession
 */

/**
 * Get the banner for the user from the session.
 *
 * @param {BannerSession} session
 * @returns {string|undefined}
 */
export function getSessionBanner(session) {
	return session.banner;
}

/**
 * Set the banner for the user in the session.
 *
 * @param {BannerSession} session
 * @param {string} banner
 * @returns {void}
 */
export function setSessionBanner(session, banner) {
	session.banner = banner;
}

/**
 * Delete the banner for the user from the session.
 *
 * @param {BannerSession} session
 * @returns
 */
export function deleteSessionBanner(session) {
	delete session.banner;
}

/**
 * Start move documents session
 *
 * @param {MoveDocumentsSession} session
 */
	export const startMoveDocumentsSession = (session) => {
		session.moveDocuments = session.moveDocuments || {};
	};

/**
 * Save in the session the document metadata for files selected to be moved between folders
 *
 * @param {MoveDocumentsSession} session
 * @param {object[]} documentationFiles
 * @returns {void}
 */
export const setSessionMoveDocumentsFilesToMove = (session, documentationFiles) => {
	session.moveDocuments.documentationFilesToMove = documentationFiles;
};

/**
 * Get the documents data for the files selected to be moved between folders
 *
 * @param {MoveDocumentsSession} session
 * @returns {object[]}
 */

export const getSessionMoveDocumentsFilesToMove = (session) => {
	return session.moveDocuments?.documentationFilesToMove ? session.moveDocuments?.documentationFilesToMove : [];
};


/**
 * 
 * @param {MoveDocumentsSession} session
 * @param {number} parentFolderId
 */

export const setSessionMoveDocumentsParentFolderId = (session, parentFolderId) => {
	console.log('setting parent folder id;>>', parentFolderId);
	session.moveDocuments.parentFolderId = parentFolderId;
};

export const getSessionMoveDocumentsParentFolderId = (session) => {
	return session.moveDocuments.parentFolderId;
};
/**
 * Save in the session the list of folders to move the documents to
 * @param {MoveDocumentsSession} session
 * @param {object[]} folderList
 **/
export const setSessionMoveDocumentsFolderList = (session, folderList) => {	
	session.moveDocuments.folderList = folderList;
}

/**
 * @param {MoveDocumentsSession} session 
 * @returns 
 */
export const getSessionMoveDocumentsFolderList = (session) => {
	return session.moveDocuments.folderList;
}

/**
 * @param {MoveDocumentsSession} session 
 * @returns 
 */
export const setSessionMoveDocumentsRootFolderList = (session, rootFolderList) => {
	session.moveDocuments.rootFolderList = rootFolderList;
}

/**
 * @param {MoveDocumentsSession} session 
 * @returns 
 */
export const getSessionMoveDocumentsRootFolderList = (session) => {
	return session.moveDocuments.rootFolderList;
}

/**
 * Save in the session whether the selected folder is the root folder
 * @param {MoveDocumentsSession} session
 * @param {boolean} isFolderRoot
 */

export const setSessionMoveDocumentsIsFolderRoot = (session, isFolderRoot) => {
	session.moveDocuments.isFolderRoot = isFolderRoot;
}

/**
 * @param {MoveDocumentsSession} session
 * @returns
 */
export const getSessionMoveDocumentsIsFolderRoot = (session) => {
	return session.moveDocuments.isFolderRoot;
}

/**
 * Delete the documents to move data from the session.
 *
 * @param {MoveDocumentsSession} session
 * @returns
 */
export const deleteMoveDocumentsSession = (session) => {
	delete session.moveDocuments;
}