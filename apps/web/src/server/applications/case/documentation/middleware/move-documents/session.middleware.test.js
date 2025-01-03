//@ts-nocheck
import { jest } from '@jest/globals';
import { moveDocumentsMiddleware } from './session.middleware.js';
import sessionHandlers from '../../applications-documentation.session.js';
import utils from '../../utils/move-documents/utils.js';

const mockFolderList = [
	{
		id: 111111111,
		displayNameEn: 'Mock child folder name',
		displayOrder: 100,
		stage: null,
		isCustom: true,
		parentFolderId: 100000000
	}
];

describe('Move documents session middleware:', () => {
	describe('#moveDocumentsMiddleware', () => {
		let req, res, next;

		beforeEach(() => {
			req = {
				session: {
					moveDocuments: {}
				},
				query: { parentFolderId: '100000000', parentFolderName: 'Mock parent folder name' }
			};
			res = {
				redirect: jest.fn(),
				locals: { caseId: 1, serviceUrl: '/applications-service' }
			};

			next = jest.fn();
		});

		it('should redirect to project documentation if move documents session is not present', async () => {
			req.session.moveDocuments = undefined;

			await moveDocumentsMiddleware(req, res, next);

			expect(res.redirect).toHaveBeenCalledWith(
				'/applications-service/case/1/project-documentation'
			);
		});

		it('should set move documents session data', async () => {
			const mockBreadcrumbItems = [
				{ href: './folder-explorer', text: 'Project documentation' },
				{
					href: './folder-explorer?parentFolderId=100000000&parentFolderName=Mock%parent%folder%name',
					text: 'Correspondence'
				}
			];

			utils.getFolderList = jest.fn().mockResolvedValue(mockFolderList);
			utils.isFolderRoot = jest.fn().mockReturnValue(false);
			utils.buildMoveDocumentsBreadcrumbItems = jest.fn().mockReturnValue(mockBreadcrumbItems);

			sessionHandlers.setSessionMoveDocumentsFolderList = jest.fn();
			sessionHandlers.setSessionMoveDocumentsBreadcrumbs = jest.fn();
			sessionHandlers.setSessionMoveDocumentsIsFolderRoot = jest.fn();

			await moveDocumentsMiddleware(req, res, next);

			expect(utils.getFolderList).toHaveBeenCalledWith(
				res.locals.caseId,
				Number(req.query.parentFolderId)
			);

			expect(utils.isFolderRoot).toHaveBeenCalledWith(mockFolderList);

			expect(utils.buildMoveDocumentsBreadcrumbItems).toHaveBeenCalledWith(
				req.session,
				Number(req.query.parentFolderId),
				'Mock parent folder name'
			);

			expect(sessionHandlers.setSessionMoveDocumentsBreadcrumbs).toHaveBeenCalledWith(
				req.session,
				mockBreadcrumbItems
			);
			expect(sessionHandlers.setSessionMoveDocumentsFolderList).toHaveBeenCalledWith(
				req.session,
				mockFolderList
			);

			expect(sessionHandlers.setSessionMoveDocumentsIsFolderRoot).toHaveBeenCalledWith(
				req.session,
				false
			);
		});
	});
});
