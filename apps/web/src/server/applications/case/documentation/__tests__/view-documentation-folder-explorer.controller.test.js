//@ts-nocheck
import { jest } from '@jest/globals';
import {
	postDocumentationFolderExplorer,
	viewDocumentationFolderExplorer
} from '../applications-documentation.controller.js';
import sessionHandlers from '../applications-documentation.session.js';
import utils from '../utils/move-documents/utils.js';

describe('Move documents:', () => {
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
	describe('viewDocumentationFolderExplorer', () => {
		let request, response;

		beforeEach(() => {
			request = {
				session: {
					moveDocuments: {}
				},
				query: { parentFolderId: '100000000', parentFolderName: 'Mock parent folder name' },
				params: {
					folderId: '100000000',
					folderName: 'Mock param folder name'
				}
			};
			response = {
				render: jest.fn(),
				locals: { caseId: 1 }
			};
		});

		it('should set session data and render the folder explorer page with correct data', async () => {
			const mockBreadcrumbItems = [
				{ href: './folder-explorer', text: 'Project documentation' },
				{
					href: './folder-explorer?parentFolderId=100000000&parentFolderName=Mock%parent%folder%name',
					text: 'Correspondence'
				}
			];

			const mockBackLink =
				'/applications-service/case/1/project-documentation/100000000/mock-parent-folder-name/move-documents/folder-explorer';

			utils.getBackLinkUrlFromBreadcrumbs = jest.fn().mockReturnValue(mockBackLink);
			utils.getFolderViewData = jest.fn().mockReturnValue([
				{
					text: 'Mock child folder name',
					value: 111111111
				}
			]);

			sessionHandlers.getSessionMoveDocumentsFolderList = jest
				.fn()
				.mockResolvedValue(mockFolderList);
			sessionHandlers.getSessionMoveDocumentsBreadcrumbs = jest
				.fn()
				.mockReturnValue(mockBreadcrumbItems);
			sessionHandlers.getSessionMoveDocumentsIsFolderRoot = jest.fn().mockReturnValue(false);

			await viewDocumentationFolderExplorer(request, response);

			expect(sessionHandlers.getSessionMoveDocumentsFolderList).toHaveBeenCalledWith(
				request.session
			);
			expect(sessionHandlers.getSessionMoveDocumentsBreadcrumbs).toHaveBeenCalledWith(
				request.session
			);
			expect(sessionHandlers.getSessionMoveDocumentsIsFolderRoot).toHaveBeenCalledWith(
				request.session
			);

			expect(utils.getBackLinkUrlFromBreadcrumbs).toHaveBeenCalledWith(
				mockBreadcrumbItems,
				response.locals.caseId,
				Number(request.params.folderId),
				request.params.folderName
			);

			expect(response.render).toHaveBeenCalledWith(
				'applications/case-documentation/move-documents/folder-explorer',
				{
					backLink: mockBackLink,
					breadcrumbItems: mockBreadcrumbItems,
					folderListViewData: [
						{
							text: 'Mock child folder name',
							value: 111111111
						}
					],
					isRootFolder: false
				}
			);
		});
	});

	describe('postDocumentationFolderExplorer', () => {
		let request, response;

		beforeEach(() => {
			request = {
				session: {
					moveDocuments: {
						folderList: mockFolderList
					}
				},
				body: {
					openFolder: '111111111'
				},
				params: {
					folderId: '100000000',
					folderName: 'Mock param folder name'
				}
			};
			response = {
				render: jest.fn(),
				locals: { caseId: 1 },
				redirect: jest.fn()
			};

			sessionHandlers.getSessionMoveDocumentsFolderList = jest
				.fn()
				.mockResolvedValue(mockFolderList);
			utils.getFolderViewData = jest.fn().mockReturnValue([
				{
					text: 'Mock child folder name',
					value: 111111111
				}
			]);
			utils.getFolderNameById = jest.fn().mockReturnValue('Mock child folder name');
		});

		it('should render error message if no folders where selected to open', async () => {
			request.body.openFolder = undefined;
			request.errors = {
				openFolder: {
					value: undefined,
					msg: 'Select a folder',
					param: 'openFolder',
					location: 'body'
				}
			};

			await postDocumentationFolderExplorer(request, response);

			expect(response.render).toHaveBeenCalledWith(
				'applications/case-documentation/move-documents/folder-explorer',
				expect.objectContaining({
					errors: {
						openFolder: {
							location: 'body',
							msg: 'Select a folder',
							param: 'openFolder',
							value: undefined
						}
					}
				})
			);
		});

		it('should redirect to folder explorer with correct query parameters', async () => {
			await postDocumentationFolderExplorer(request, response);

			expect(response.redirect).toHaveBeenCalledWith(
				'./folder-explorer?parentFolderId=111111111&parentFolderName=Mock child folder name'
			);
		});
	});
});
