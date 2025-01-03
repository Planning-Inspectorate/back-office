import documentationSessionHandlers from '../../applications-documentation.session.js';
import utils from '../../utils/move-documents/utils.js';

/**
 * Middleware to move documents
 * @param {*} req
 * @param {*} res
 * @param {import('express').NextFunction} next
 *
 *
 */

export const moveDocumentsMiddleware = async (req, res, next) => {
	const { session, query } = req;
	const { parentFolderId, parentFolderName } = query;
	const { caseId, serviceUrl } = res.locals;

	//@ts-ignore
	if (!session.moveDocuments) {
		return res.redirect(`${serviceUrl}/case/${caseId}/project-documentation`);
	}

	const folderList = await utils.getFolderList(caseId, Number(parentFolderId));
	const isRootFolder = utils.isFolderRoot(folderList);
	const breadcrumbItems = utils.buildMoveDocumentsBreadcrumbItems(
		session,
		Number(parentFolderId),
		parentFolderName
	);

	documentationSessionHandlers.setSessionMoveDocumentsBreadcrumbs(session, breadcrumbItems);
	documentationSessionHandlers.setSessionMoveDocumentsFolderList(session, folderList);
	documentationSessionHandlers.setSessionMoveDocumentsIsFolderRoot(session, isRootFolder);

	next();
};
