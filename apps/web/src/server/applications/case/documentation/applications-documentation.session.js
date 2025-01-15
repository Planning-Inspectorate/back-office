/**
 * @typedef {import('express-session').Session & { folderPage?: string }} SessionWithFolderPage
 * @typedef {import('express-session').Session & {
 *	moveDocuments?: {
 *		documentationFilesToMove?: {documentGuid: string, fileName: string}[],
 *		parentFolder?: {id: number, displayNameEn: string, stage: string|null|undefined},
 * 		folderList?: object[],
 * 		isFolderRoot?: boolean,
 * 		rootFolderList?: object[]
 * 		breadcrumbs?: {href: string, html: string, id:number}[]
 *	}
 * }} SessionWithMoveDocuments
 */

/**
 * Get the case-officer state from the session.
 *
 * @param {SessionWithFolderPage} session
 * @returns {string | null}
 */
const getSessionFolderPage = (session) => session.folderPage || null;

/**
 * @param {SessionWithFolderPage} session
 * @returns {void}
 */
const destroySessionFolderPage = (session) => {
	delete session.folderPage;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithFolderPage} session
 * @param {string} folderPage
 * @returns {void}
 */
const setSessionFolderPage = (session, folderPage) => {
	session.folderPage = folderPage;
};

/**
 * Start move documents session
 *
 * @param {SessionWithMoveDocuments} session
 */
const startMoveDocumentsSession = (session) => {
	session.moveDocuments = session.moveDocuments ?? {};
};

/**
 * Save in the session the document metadata for files selected to be moved between folders
 *
 * @param {SessionWithMoveDocuments} session
 * @param {{documentGuid: string, fileName: string}[]} documentationFiles
 * @returns {void}
 */
const setSessionMoveDocumentsFilesToMove = (session, documentationFiles) => {
	session.moveDocuments && (session.moveDocuments.documentationFilesToMove = documentationFiles);
};

/**
 * Get the documents data for the files selected to be moved between folders
 *
 * @param {SessionWithMoveDocuments} session
 * @returns
 */

const getSessionMoveDocumentsFilesToMove = (session) => {
	return session.moveDocuments?.documentationFilesToMove
		? session.moveDocuments?.documentationFilesToMove
		: [];
};

/**
 * Save in the session the list of folders to move the documents to
 * @param {SessionWithMoveDocuments} session
 * @param {import('../../applications.types.js').DocumentationCategory[]} folderList
 **/
const setSessionMoveDocumentsFolderList = (session, folderList) => {
	session.moveDocuments && (session.moveDocuments.folderList = folderList);
};

/**
 * @param {SessionWithMoveDocuments} session
 * @returns {*}
 */
const getSessionMoveDocumentsFolderList = (session) => {
	return session.moveDocuments?.folderList;
};

/**
 * Save parent folder data in session
 * @param {SessionWithMoveDocuments} session
 * @param {*} parentFolder
 **/
const setSessionMoveDocumentsParentFolder = (session, parentFolder) => {
	session.moveDocuments && (session.moveDocuments.parentFolder = parentFolder);
};

/**
 * @param {SessionWithMoveDocuments} session
 * @returns
 */
const getSessionMoveDocumentsParentFolder = (session) => {
	return session.moveDocuments?.parentFolder;
};

/**
 * @param {SessionWithMoveDocuments} session
 * @param {object[]} rootFolderList
 * @returns
 */
const setSessionMoveDocumentsRootFolderList = (session, rootFolderList) => {
	session.moveDocuments && (session.moveDocuments.rootFolderList = rootFolderList);
};

/**
 * @param {SessionWithMoveDocuments} session
 * @returns
 */
const getSessionMoveDocumentsRootFolderList = (session) => {
	return session.moveDocuments?.rootFolderList;
};

/**
 * Save in the session whether the selected folder is the root folder
 * @param {SessionWithMoveDocuments} session
 * @param {boolean} isFolderRoot
 */

const setSessionMoveDocumentsIsFolderRoot = (session, isFolderRoot) => {
	session.moveDocuments && (session.moveDocuments.isFolderRoot = isFolderRoot);
};

/**
 * @param {SessionWithMoveDocuments} session
 * @returns {boolean|undefined}
 */
const getSessionMoveDocumentsIsFolderRoot = (session) => {
	return session.moveDocuments?.isFolderRoot;
};

/**
 * Save in the session the breadcrumbs for the move documents page
 * @param {SessionWithMoveDocuments} session
 * @param {{href: string, html: string, id:number}[]} breadcrumbItems
 */

const setSessionMoveDocumentsBreadcrumbs = (session, breadcrumbItems) => {
	session.moveDocuments && (session.moveDocuments.breadcrumbs = breadcrumbItems);
};

/**
 * @param {SessionWithMoveDocuments} session
 * @returns {{href: string, html: string, id:number}[]|undefined}
 */
const getSessionMoveDocumentsBreadcrumbs = (session) => {
	return session.moveDocuments?.breadcrumbs;
};
/**
 * Delete the documents to move data from the session.
 *
 * @param {*} session
 * @returns {void}
 */
const deleteMoveDocumentsSession = (session) => {
	delete session.moveDocuments;
};

export default {
	getSessionFolderPage,
	setSessionFolderPage,
	destroySessionFolderPage,
	startMoveDocumentsSession,
	setSessionMoveDocumentsFilesToMove,
	getSessionMoveDocumentsFilesToMove,
	setSessionMoveDocumentsFolderList,
	getSessionMoveDocumentsParentFolder,
	setSessionMoveDocumentsParentFolder,
	getSessionMoveDocumentsFolderList,
	setSessionMoveDocumentsRootFolderList,
	getSessionMoveDocumentsRootFolderList,
	setSessionMoveDocumentsIsFolderRoot,
	getSessionMoveDocumentsIsFolderRoot,
	setSessionMoveDocumentsBreadcrumbs,
	getSessionMoveDocumentsBreadcrumbs,
	deleteMoveDocumentsSession
};
